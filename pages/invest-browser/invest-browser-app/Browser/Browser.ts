"use strict"

import { Guest } from "./User/Guest.js"
import { Registrant } from "./User/Registrant.js"
import { Subscriber } from "./User/Subscriber.js"
import { IMap } from "./interfaces/IMap.js"
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


    private _map: IMap

    private _userInterface: IUserInterface

    private _user: Guest | Registrant | Subscriber


    public onLoadProject: (projectFeathure: ProjectFeathure) => void = () => { }

    public get countOfViewedProjects(): number {
        return +localStorage.getItem('gsp')
    }

    public set countOfViewedProjects(value: number) {
        localStorage.setItem('gsp', String(value))
    }

    constructor(map: IMap, userInterface: IUserInterface, user: Guest | Registrant | Subscriber) {
        this._map = map
        this._userInterface = userInterface
        this._user = user

        if (user instanceof Guest || user instanceof Registrant) this.initForFreeUserWithRestrictions(user)
        else if (user instanceof Subscriber) this.initForSubscriber(user)
        else throw new TypeError("")

        const restoredMapState = this.restoreMapState()
        if (restoredMapState.center) map.setCenter(restoredMapState.center)
        if (restoredMapState.zoom) map.setZoom(restoredMapState.zoom)
    }

    // public async addProjects(url: string = "/pages/invest-browser/ambiance/jsonp-projects.js"): Promise<ProjectsLoadingObjectManager> {
    //     const loadingManager = await new ProjectsManager(url, ProjectsManagerDecorator.clustererOptionsAsset).loadingManager

    //     this._userInterface.addProjectsManager(loadingManager)

    //     loadingManager.objects.events.add('add', (event: ymaps.IEvent<MouseEvent>) => {
    //         const targetObject: ProjectFeathure = event.get("child")
    //         this.onLoadProject(targetObject)
    //         const isFolderItem = this.isProjectInAnyFolder(targetObject)
    //         loadingManager.objects.setObjectOptions(targetObject.id, { isFolderItem })
    //     })

    //     this._map.addProjectsManager(loadingManager)

    //     return loadingManager
    // }

    // public async addGroups(url: string = "/pages/invest-browser/ambiance/jsonp-load-project-groups.js"): Promise<GroupsLoadingObjectManager> {
    //     const loadingManager = await new GroupsManager(url, GroupManagerDecorator.clustererOptionsAsset).loadingManager

    //     this._userInterface.addGroupsManager(loadingManager)

    //     this._map.addGroupsManager(loadingManager)

    //     return loadingManager
    // }

    private async blockForFreeUserWithRestrictions(user: Guest | Registrant): Promise<void> {
        this.countOfViewedProjects = this.limitOfProjectViews + 1

        // показываем пользователю сообщение о том что у него ограничение стоит
        $('#no-access-guest-map').modal({ keyboard: false, backdrop: 'static' })

        // если у пользователя указано что он потратил лимит, то все готово
        if (user.isSpentDailyLimit) return

        // иначе блокируем пользователя и актуализируем его статус
        const investProjectIdentitiy = await user.investProjectIdentity
        return new Promise((resolve, reject) => {
            $.post('/ajax/ymaps/set-map-block', { fpOurId: investProjectIdentitiy })
                .done(() => {
                    user.setIsSpentDailyLimit(true)
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
        if (!user.isSpentDailyLimit && (user.numberOfViewedProjects >= this.limitOfProjectViews)) {
            this.countOfViewedProjects = 0
        }

        // Если пользователь потратил лимит просмотра проектов, ограничиваем ему зум. Логично.
        if (await user.isSpentDailyLimit || (user.numberOfViewedProjects >= this.limitOfProjectViews)) {
            if (user instanceof Guest) this._userInterface.setZoomRestriction("for-guest")
            if (user instanceof Registrant) this._userInterface.setZoomRestriction("for-guest")
            this.blockForFreeUserWithRestrictions(user)
        }
    }

    private async initForSubscriber(user: Subscriber) { }

    private restoreMapState(): { center?: [number, number], zoom?: number } {
        // <<< one
        if (globalThis.projects_to_map && globalThis.projects_to_map.length > 1) return { center: [59.92, 60.3413], zoom: 7 }

        // <<< two
        if (this._user instanceof Guest) return { center: [59.92, 30.3413], zoom: 7 }

        let state: { center?: [number, number], zoom?: number } = {}

        // three
        if (globalThis.companyProdAddresses) {
            const lastUserCompany = globalThis.companyProdAddresses[globalThis.companyProdAddresses.length - 1]
            state = { center: [lastUserCompany.map_x, lastUserCompany.map_y], zoom: 7 }
        }

        // four
        if (app.getUrlParameter('x') && app.getUrlParameter('y')) state = { center: [+app.getUrlParameter('x'), +app.getUrlParameter('y')], zoom: 11 }

        // (three & five) || (four & five)
        if (app.getUrlParameter('center')) state.center = app.getUrlParameter('center').split(',').map((value: string) => +value)
        if (app.getUrlParameter('zoom')) state.zoom = +(app.getUrlParameter('zoom'))

        return state // <<< three || four || (three & five) || (four & five)
    }

    private isProjectInAnyFolder(targetObject: ProjectFeathure): boolean {
        if (!globalThis._folders) return false
        return globalThis._folders.some(folder => folder.projects.includes(+targetObject.id))
    }
}