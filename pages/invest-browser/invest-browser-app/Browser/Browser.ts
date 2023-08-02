"use strict"

import mitt from "/node_modules/mitt/dist/mitt.mjs"
import { GeoTerritory } from "../GeoTerritory/GeoTerritory"
import { LoadingProjectsManager } from "../LoadingObjectManager/projects/LoadingProjectsManager.js"
import { IUserFocusEmmiter } from "../UserInterface/interfaces/IUserFocusEmmiter.js"
import { FreeUserWithRestrictions } from "./User/FreeRestrictedUser/FreeUserWithRestrictions.js"
import { Guest } from "./User/Guest.js"
import { Registrant } from "./User/Registrant.js"
import { Subscriber } from "./User/Subscriber.js"
import { IFolderItemsManager } from "./interfaces/IFolderItemsManager.js"
import { IMap } from "./interfaces/IMap.js"
import { IObjectManager } from "./interfaces/IObjectManager.js"
import { IUser } from "./interfaces/IUser.js"
import { IUserInterface } from "./interfaces/IUserInterface.js"
import { readUrlParamsData } from "/modules/read-url-params.js"

type UrlParamsDTO = {
    territory?: ["RU" | "UA" | "BY" | "KZ", string | undefined],
    cenrter?: [number, number],
    zoom?: number,
    x?: number,
    y?: number
}

type TCountryInfo = {
    id: number
    code: number
    iso: string
    name: string
    name_en: string
}

type TRegionInfo = {
    id: number
    iso: string
    name: string
    name_en: string
}

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

    private readonly events = mitt<{
        "browse-objects-manager": IObjectManager,
        "cancel-browse-objects-manager": IObjectManager
    }>()

    private get viewedObjectsDump(): string[] {
        const dump = localStorage.getItem('IBA-browser-viewedObjects')
        return dump ? JSON.parse(dump) : []
    }

    private set viewedObjectsDump(objects: string[]) {
        localStorage.setItem('IBA-browser-viewedObjects', JSON.stringify(objects))
    }

    private readonly _browsedTerritories: Set<GeoTerritory> = new Set()

    public get countOfViewedRestrictedObjects(): number {
        return +(localStorage.getItem('countOfViewedRestrictedObjects') ?? 0)
    }

    public set countOfViewedRestrictedObjects(value: number) {
        localStorage.setItem('countOfViewedRestrictedObjects', String(value))
    }

    constructor(map: IMap, userInterface: IUserInterface, user: Guest | Registrant | Subscriber) {
        this._map = map
        this._userInterface = userInterface
        this._user = user

        this.restrictionTObjectManagers = this.restrictionTUserToTObjectManager
            .filter(([UserType, LoaderType]) => user instanceof UserType)
            .map(([UserType, LoaderType]) => LoaderType)

        if (user instanceof Guest || user instanceof Registrant) this.initForFreeUserWithRestrictions(user)

        let tusksChain: Promise<any> = Promise.reject()

        const browsedTerritory = this.restoreBrowsedTerritory()

        if (browsedTerritory) {
            const tusk = tusksChain.catch(async () => {
                if (await this.browseRegion(browsedTerritory)) return true
                if (await this.browseCountry(browsedTerritory)) return true
                throw new Error("Не удалось инициализировать просмотр по территории")
            })
            
            tusksChain = tusk

            tusk.then(() => {
                this._map.viewTerritories([...this._browsedTerritories])
            })
        }

        if (user instanceof Guest || user instanceof Registrant) {
            const tusk = tusksChain.catch(async () => {
                const browsedTerritory = this.findUserTerritory()
                if (await this.browseRegion(await browsedTerritory)) return true
                if (await this.browseCountry(await browsedTerritory)) return true
                throw new Error("Не удалось инициализировать просмотр по местоположению пользователя")
            })

            tusksChain = tusk

            tusk.then(() => {
                this._map.viewTerritories([...this._browsedTerritories])
            })
        }

        tusksChain.catch(() => {
            const restoredMapState = this.restoreMapState()
            if (restoredMapState.center) map.setCenter(restoredMapState.center)
            if (restoredMapState.zoom) map.setZoom(restoredMapState.zoom)
        })

        this.inspectBrowsedObjectsByVisibleArea()
    }

    public async browseGeoTerritories(geoTerritories: GeoTerritory[], groupName: string): Promise<void> {
        try {
            // регионы выключаем
            const regionsFilters = [...document.querySelectorAll<HTMLInputElement>(`[data-type="regions"]`)]
            regionsFilters.map((element) => { element.checked = false })

            // страны выключаем
            const countriesFilters = [...document.querySelectorAll<HTMLInputElement>(`[data-type="countries"]`)]
            countriesFilters.map((element) => { element.checked = false })

            for (const geoTerritory of geoTerritories) {
                const countryInfo = await this.loadCountryInfo(geoTerritory.countryIso3166)
                const regionInfo = geoTerritory.regionIso3166
                    ? await this.loadRegionInfo(geoTerritory.countryIso3166, geoTerritory.regionIso3166)
                    : null

                // целевой регион включаем
                if (regionInfo) {
                    const targetRegionFilter = document.querySelector<HTMLInputElement>(`[name="filter[regions][${regionInfo.id}]"]`) || null
                    if (targetRegionFilter) targetRegionFilter.checked = true
                }

                // целевую страну включаем
                if (countryInfo) {
                    const targetCountryFilter = document.querySelector<HTMLInputElement>(`[name="filter[countries][${countryInfo.code}]"]`) || null
                    if (targetCountryFilter) targetCountryFilter.checked = true
                }
            }

            // применить фильтры
            document.querySelector<HTMLAnchorElement>('.apply-filter').click()
        } catch (error) {
            console.warn(error)
        }


        try {
            // ########################################################
            // Заполняем кнопку закрытия зоны и показываем
            $('.autoSelectedRegion > span').text(groupName)
            $('.autoSelectedRegion').show()
            document.querySelector<HTMLElement>('.autoSelectedRegion').addEventListener("click", (event) => {
                $(event.currentTarget).hide()

                this.cancelBrowseGeoTerritories(geoTerritories)
            })
        } catch (error) {
            console.warn(error)
        }


        // ########################################################
        
        for (const geoTerritory of geoTerritories) {
            this._map.addGeoTerrirory(geoTerritory)

            this._browsedTerritories.add(geoTerritory)
        }
    }

    public async cancelBrowseGeoTerritories(geoTerritories: GeoTerritory[]): Promise<void> {
        try {
            // регионы включаем
            const regionsFilters = [...document.querySelectorAll<HTMLInputElement>(`[data-type="regions"]`)]
            regionsFilters.map((element) => { element.checked = true })

            // страны включаем
            const countriesFilters = [...document.querySelectorAll<HTMLInputElement>(`[data-type="countries"]`)]
            countriesFilters.map((element) => { element.checked = true })

            // применить фильтры
            document.querySelector<HTMLAnchorElement>('.apply-filter').click()
        } catch (error) {
            console.warn(error)
        }

        for (const geoTerritory of geoTerritories) {
            this._map.removeGeoTerritory(geoTerritory)
            
            this._browsedTerritories.delete(geoTerritory)
        }
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

        this.events.emit("browse-objects-manager", manager)
    }

    public cancelBrowseObjectsFromObjectManager(manager: IObjectManager) {
        if (!this._browsedObjectManagers.has(manager)) return

        this._browsedObjectManagers.delete(manager)

        if (this.restrictedObjectManagerToListener.has(manager)) {
            manager.deleteFocusFistener(this.restrictedObjectManagerToListener.get(manager))
            this.restrictedObjectManagerToListener.delete(manager)
        }

        this.events.emit("cancel-browse-objects-manager", manager)
    }

    private restoreBrowsedTerritory(): GeoTerritory | null {
        const urlParamsData = readUrlParamsData<UrlParamsDTO>()

        const countryIso3166: "RU" | "UA" | "BY" | "KZ" | undefined = urlParamsData.territory?.[0]

        if (!countryIso3166) return null

        const regionIso3166: string | undefined = urlParamsData.territory?.[1]

        if (!GeoTerritory.checkIsCountryIsoAllowed(countryIso3166)) return null

        return new GeoTerritory(countryIso3166, regionIso3166)
    }

    private async findUserTerritory(): Promise<GeoTerritory | null> {
        const countryIso3166 = await this._user.countryIso3166
        const regionIso3166 = await this._user.regionIso3166

        if (countryIso3166 && GeoTerritory.checkIsCountryIsoAllowed(countryIso3166)) {
            return new GeoTerritory(countryIso3166, regionIso3166)
        }
        return null
    }

    private async browseRegion(territory: GeoTerritory): Promise<boolean> {
        if (territory.countryIso3166 !== 'RU') return false
        if (!territory.regionIso3166) return false

        const { territories, mainTerritory } = this.normalizeRegion(territory)
        
        await this.browseGeoTerritories(territories, await mainTerritory.name)

        return true
    }

    private normalizeRegion(passedTerritory: GeoTerritory): { territories: GeoTerritory[], mainTerritory: GeoTerritory } {
        const geoTerritoryToCountry = new Map<string, "RU" | "UA" | "BY" | "KZ">([
            ["RU-SPE", "RU"],
            ["RU-LEN", "RU"],
            ["RU-MOW", "RU"],
            ["RU-MOS", "RU"],
            ["UA-40", "UA"],
            ["UA-43", "UA"]
        ])

        const cityTerritoryToRegion = new Map<string, string>([
            ["RU-SPE", "RU-LEN"],
            ["RU-MOW", "RU-MOS"],
            ["UA-40", "UA-43"]
        ])

        let mainTerritory = passedTerritory

        const territories: GeoTerritory[] = [passedTerritory]

        // Если территория пользователя - федеральный город (https://en.wikipedia.org/wiki/Federal_cities_of_Russia)
        if (cityTerritoryToRegion.has(passedTerritory.regionIso3166)) {
            // ищем регион этого города
            const regionIso = cityTerritoryToRegion.get(passedTerritory.regionIso3166)
            const regionCountryIso = geoTerritoryToCountry.get(regionIso)
            const region = new GeoTerritory(regionCountryIso, regionIso)

            // Добавляем в территории региона территорию самого региона (раньше была только территория федерального города)
            territories.push(region)

            // И регион это основная территория, в отличие от города
            mainTerritory = region
        }

        const regionToCityTerritory = new Map(
            [...cityTerritoryToRegion].map(([city, region]) => [region, city])
        )

        // Если регион пользователя содержит федеральный город, то складываем их территории (https://en.wikipedia.org/wiki/Federal_cities_of_Russia)
        if (regionToCityTerritory.has(passedTerritory.regionIso3166)) {
            const cityIso = regionToCityTerritory.get(passedTerritory.regionIso3166)
            const cityCountryIso = geoTerritoryToCountry.get(cityIso)
            const city = new GeoTerritory(cityCountryIso, cityIso)

            territories.push(city)
        }

        return { territories, mainTerritory }
    }

    private async browseCountry(territory: GeoTerritory): Promise<boolean> {
        await this.browseGeoTerritories([territory], await territory.name)

        return true
    }

    private addViewedObject(id: string) {
        if (this.viewedObjectsDump.includes(id)) return

        const objects = this.viewedObjectsDump
        objects.push(id)
        this.viewedObjectsDump = objects

        ++this.countOfViewedRestrictedObjects
    }

    private async blockForFreeUserWithRestrictions(user: FreeUserWithRestrictions): Promise<void> {
        this.countOfViewedRestrictedObjects = this.limitOfProjectViews + 1

        await app.querySelectorPromise('#no-access-guest-map')
        // показываем пользователю сообщение о том что у него ограничение стоит
        // $('#no-access-guest-map').modal({ keyboard: false, backdrop: 'static' })

        // если у пользователя указано что он потратил лимит, то все готово
        if (await user.isSpentDailyLimit) return

        // иначе блокируем пользователя и актуализируем его статус
        const investProjectIdentitiy = await user.investProjectIdentity
        return new Promise((resolve, reject) => {
            $.get(`/ajax/ymaps/set-map-block?fpOurId=${investProjectIdentitiy}`)
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

    private restoreMapState(): { center?: [number, number], zoom?: number } {
        const state = this.loadMapState()

        // if guest, then we skip loading the parameter url
        if (this._user instanceof Guest) return state

        const urlParamsData = readUrlParamsData<UrlParamsDTO>()
        if (urlParamsData.cenrter) state.center = urlParamsData.cenrter
        if (urlParamsData.zoom) state.zoom = urlParamsData.zoom

        return state
    }

    private loadMapState(): { center?: [number, number], zoom?: number } {
        if (globalThis.projects_to_map && globalThis.projects_to_map.length > 1) {
            return { center: [59.92, 60.3413] }
        }

        if (this._user instanceof Guest) return {}

        const urlParamsData = readUrlParamsData<UrlParamsDTO>()
        if (urlParamsData.x && urlParamsData.y) return { center: [urlParamsData.x, urlParamsData.y], zoom: 11 }

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

    private async loadCountryInfo(countryIso3166: string): Promise<TCountryInfo | null> {
        return new Promise<TCountryInfo | null>((resolve) => {
            $.ajax({
                type: 'GET',
                url: `/ajax/ymaps/country-by-iso3166-alpha2?iso=${countryIso3166}`,
                success(response) {
                    resolve(JSON.parse(response).data)
                },
                error(error, errorName) {
                    console.warn(error)
                    resolve(null)
                }
            })
        })
    }

    private async loadRegionInfo(countryIso3166: string, regionIso3166: string): Promise<TRegionInfo | null> {
        return new Promise<TRegionInfo | null>((resolve) => {
            $.ajax({
                type: 'GET',
                url: `/ajax/ymaps/region-by-iso3166-alpha2?countryIso=${countryIso3166}&regionIso=${regionIso3166}`,
                success(response) {
                    resolve(JSON.parse(response).data)
                },
                error(error, errorName) {
                    console.warn(error)
                    resolve(null)
                }
            })
        })
    }

    public inspectBrowsedObjectsByVisibleArea() {
        this.events.on("browse-objects-manager", manager => {
            manager.eve
        })
    }
}