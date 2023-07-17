"use strict"

import { LoadingProjectsManager } from "../LoadingObjectManager/projects/LoadingProjectsManager.js"
import { IUserFocusEmmiter } from "../UserInterface/interfaces/IUserFocusEmmiter.js"
import { FreeUserWithRestrictions } from "./User/FreeRestrictedUser/FreeUserWithRestrictions.js"
import { Guest } from "./User/Guest.js"
import { Registrant } from "./User/Registrant.js"
import { Subscriber } from "./User/Subscriber.js"
import { IFolderItemsManager } from "./interfaces/IFolderItemsManager.js"
import { IMap } from "./interfaces/IMap.js"
import { IObjectManager } from "./interfaces/IObjectManager.js"
import { IUserInterface } from "./interfaces/IUserInterface.js"

/**
 * `Браузер Данных` Сайта Investprojects. Взаимодействует с `Пользовательским Интерфейсом` и `Картой`
 * - Реализует логику получения различных данных Сайта Investprojects.
 * 
 * Дальше немного монолита:
 * - Реализует логику отображения данных на `Пользовательском Интерфейсе`.
 * - Реализует логику управления `Пользовательским Интерфейсом`.
 * 
 * Дальше еще немного монолита:
 * - Реализует логику отображения данных на `Карте`
 */
export class Browser {
    /** ограничение просмотров проектов для незарегистрированных пользователей */
    private readonly limitOfProjectViews = 10;

    private readonly restrictionTUserToTObjectManager = [
        [FreeUserWithRestrictions, LoadingProjectsManager]
    ]

    private readonly restrictionTObjectManagers = []

    private readonly restrictedObjectManagerToListener: Map<IObjectManager, (feathure: ymaps.geometry.json.IFeatureJson<any, any, any>) => Promise<boolean>> = new Map()

    private readonly _map: IMap

    private readonly _userInterface: IUserInterface

    private readonly _user: Guest | Registrant | Subscriber

    private readonly _browsedObjectManagers: Set<IObjectManager> = new Set()

    private get viewedObjectsDump(): string[] {
        return localStorage.getItem('IBA-browser-viewedObjects')
            ? JSON.parse(localStorage.getItem('IBA-browser-viewedObjects'))
            : []
    }

    private set viewedObjectsDump(objects: string[]) {
        localStorage.setItem('IBA-browser-viewedObjects', JSON.stringify(objects))
    }

    private addViewedObject(id: string) {
        if (this.viewedObjectsDump.includes(id)) return

        const objects = this.viewedObjectsDump
        objects.push(id)
        this.viewedObjectsDump = objects

        ++this.countOfViewedRestrictedObjects
    }

    public get countOfViewedRestrictedObjects(): number {
        return +localStorage.getItem('gsp')
    }

    public set countOfViewedRestrictedObjects(value: number) {
        localStorage.setItem('gsp', String(value))
    }

    constructor(map: IMap, userInterface: IUserInterface, user: Guest | Registrant | Subscriber) {
        this._map = map
        this._userInterface = userInterface
        this._user = user

        this.restrictionTObjectManagers = this.restrictionTUserToTObjectManager
            .filter(([UserType, LoaderType]) => user instanceof UserType)
            .map(([UserType, LoaderType]) => LoaderType)

        if (user instanceof Guest || user instanceof Registrant) this.initForFreeUserWithRestrictions(user)
        else if (user instanceof Subscriber) this.initForSubscriber(user)
        else throw new TypeError("")

        const restoredMapState = this.restoreMapState()
        if (restoredMapState.center) map.setCenter(restoredMapState.center)
        if (restoredMapState.zoom) map.setZoom(restoredMapState.zoom)
    }

    public async browseObjectsFromObjectManager(manager: IObjectManager | IObjectManager & IFolderItemsManager) {
        if (this._browsedObjectManagers.has(manager)) return

        this._browsedObjectManagers.add(manager)

        // manager implements IFolderItemsManager?
        if ("hasFolderItems" in manager && manager.hasFolderItems) {
            // hook is not set?
            if (!manager.checkIsFolderItemHook) manager.checkIsFolderItemHook = this.isProjectInAnyFolder.bind(this)
        }

        this._userInterface.addFocusEmmiter(manager)
        this._map.addObjectsManager(await manager._loadingManager)

        if (!(this._user instanceof FreeUserWithRestrictions)) return
        const user = this._user
        
        if (this.restrictionTObjectManagers.some(ManagerType => manager instanceof ManagerType)) {
            const openProjectHandler = async (feathure: ymaps.geometry.json.IFeatureJson<any, any, any>) => {
                this.addViewedObject(feathure.id)
                if (this.countOfViewedRestrictedObjects >= this.limitOfProjectViews) {
                    this.blockForFreeUserWithRestrictions(user)
                    return false
                }
                return true
            }

            this.restrictedObjectManagerToListener.set(manager, openProjectHandler)

            manager.addFocusFistener(openProjectHandler)
        }
    }

    public cancelBrowseObjectsFromObjectManager(manager: IObjectManager) {
        if (!this._browsedObjectManagers.has(manager)) return

        this._browsedObjectManagers.delete(manager)

        if (!this.restrictedObjectManagerToListener.has(manager)) return

        manager.deleteFocusFistener(this.restrictedObjectManagerToListener.get(manager))
        this.restrictedObjectManagerToListener.delete(manager)
    }

    private async blockForFreeUserWithRestrictions(user: FreeUserWithRestrictions): Promise<void> {
        this.countOfViewedRestrictedObjects = this.limitOfProjectViews + 1

        await app.querySelectorPromise('#no-access-guest-map')
        // показываем пользователю сообщение о том что у него ограничение стоит
        $('#no-access-guest-map').modal({ keyboard: false, backdrop: 'static' })

        // если у пользователя указано что он потратил лимит, то все готово
        if (await user.isSpentDailyLimit) return

        // иначе блокируем пользователя и актуализируем его статус
        const investProjectIdentitiy = await user.investProjectIdentity
        return new Promise((resolve, reject) => {
            $.post('/ajax/ymaps/set-map-block', { fpOurId: investProjectIdentitiy })
                .done(() => {
                    user.isSpentDailyLimit = true
                    resolve()
                })
                .fail(function () {
                    console.log('fail ajax fp')
                    reject()
                })
        })
    }

    private async initForFreeUserWithRestrictions(user: Guest | Registrant): Promise<void> {
        // сбросить счетчик если у пользователя восстановился дневной лимит
        if (!(await user.isSpentDailyLimit) && (this.countOfViewedRestrictedObjects >= this.limitOfProjectViews)) {
            this.countOfViewedRestrictedObjects = 0
            this.viewedObjectsDump = []
        }

        // Если пользователь потратил лимит просмотра проектов, ограничиваем ему зум. Логично.
        if (await user.isSpentDailyLimit || (this.countOfViewedRestrictedObjects >= this.limitOfProjectViews)) {
            if (user instanceof Guest) this._userInterface.setZoomRestriction("for-guest")
            if (user instanceof Registrant) this._userInterface.setZoomRestriction("for-guest")
            this.blockForFreeUserWithRestrictions(user)
        }
    }

    private async initForSubscriber(user: Subscriber) { }

    private restoreMapState(): { center?: [number, number], zoom?: number } {
        const state = this.loadMapState()

        // if guest, then we skip loading the parameter url
        if (this._user instanceof Guest) return state

        if (app.getUrlParameter('center')) state.center = app.getUrlParameter('center').split(',').map((value: string) => +value)
        if (app.getUrlParameter('zoom')) state.zoom = +(app.getUrlParameter('zoom'))

        return state
    }

    private loadMapState(): { center?: [number, number], zoom?: number } {
        if (globalThis.projects_to_map && globalThis.projects_to_map.length > 1) {
            return { center: [59.92, 60.3413] }
        }

        if (this._user instanceof Guest) return {}

        if (app.getUrlParameter('x') && app.getUrlParameter('y')) {
            return { center: [+app.getUrlParameter('x'), +app.getUrlParameter('y')], zoom: 11 }
        }

        if (globalThis.companyProdAddresses) {
            const lastUserCompany = globalThis.companyProdAddresses[globalThis.companyProdAddresses.length - 1]
            return { center: [lastUserCompany.map_x, lastUserCompany.map_y] }
        }

        return {}
    }

    private isProjectInAnyFolder(targetObject: ymaps.geometry.json.IFeatureJson<any, any, any>): boolean {
        if (!globalThis._folders) return false
        return globalThis._folders.some(folder => folder.projects.includes(+targetObject.id))
    }
}