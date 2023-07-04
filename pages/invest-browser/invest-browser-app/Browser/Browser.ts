"use strict"

import ProjectsLoader from "./GeoObjects/Projects/ProjectsLoader.js"
import { IMap } from "./interfaces/IMap.js"
import { IUser } from "./interfaces/IUser.js"
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
    // private static requests = {
    //     'project-points-for-the-map': '/ymap/load-projects?bounds=%b'
    // }
    // private static _projectsDataEndpoint = ['POST', `${app.en_prefix}/ajax/ymaps/get-projects-data`]

    /** ограничение просмотров проектов для незарегистрированных пользователей */
    private readonly limitOfProjectViews = 10;

    private _map: IMap
    private _userInterface: IUserInterface
    private _user: IUser

    constructor(map: IMap, userInterface: IUserInterface, user: IUser) {
        this._map = map
        this._userInterface = userInterface
        this._user = user

        if (user.isGuest || user.isRegistrant) userInterface.doSomething2()

        // Если пользователь потратил лимит просмотра проектов, ограничиваем ему зум. Логично.
        if (user.isSpentDailyLimit || (user.numberOfViewedProjects >= this.limitOfProjectViews)) {
            if (user.isGuest) userInterface.setZoomRestriction("for-guest")
            if (user.isRegistrant) userInterface.setZoomRestriction("for-registrant")
        }


        // ############################################################
        // Состояние пользовательского интерфейса
        // ########################################

        let mapState: { center: [number, number], zoom: number } = {
            center: [59.92, 30.3413],
            zoom: this.restoreMapZoom() || 7
        }

        if (!user.isGuest && this.restoreMapCenter2()) {
            mapState.center = this.restoreMapCenter2()
        } else if ((this.restoreFocusedProjects()).length > 1) {
            mapState.center = [59.92, 60.3413]
        } else if (user.isGuest) {
            // nothing.
        } else if (this.restoreMapCenter1()) {
            mapState = { center: this.restoreMapCenter1(), zoom: 11 }
        } else if (this.findUserCompanies(user).length) {
            const { map_x, map_y } = this.findUserCompanies(user)[0].addr
            mapState.center = [+map_x, +map_y]
        }

        // ############################################################
        // end section
        // ########################################

        const projectsLoader = new ProjectsLoader()
        userInterface.addPointSpawnerAsProjects(projectsLoader)

        // this.showProjects()
    }

    private findUserCompanies(user: IUser): { id: number; company_id: number; addess: string; typeData: CompanyProdAddressType }[] {
        return companyProdAddresses || []
    }

    private restoreMapCenter1(): [number, number] | null {
        if (get_x && get_y) return [+get_x, +get_y]
        return null
    }

    private restoreMapCenter2(): [number, number] | null {
        if (app.getUrlParameter('center'))
            return app.getUrlParameter('center').split(',').map((value) => +value)
        return null
    }

    private restoreMapZoom(): number | null {
        if (app.getUrlParameter('zoom')) return (+(app.getUrlParameter('zoom')))
        return null
    }

    private restoreFocusedProjects(): number[] {
        return projects_to_map || []
    }

    // private showProjects() {
    //     const pointsLoader = new 
    //     pointsLoader
    //     const decoratedPointsLoader = this._userInterface.decoratePointsLoader(pointsLoader).asProjects()
    //     this._userInterface.addPointsLoaderToMap(decoratedPointsLoader)
    // }

    /** @deprecated */
    // private static isProjectInAnyFolder(projectData: ProjectsData): boolean {
    //     for (const folder of _folders) if (folder.projects.includes(projectData.id)) return true
    //     return false
    // }

    /** @deprecated */
    // private static isProjectForeign(projectData: ProjectData): boolean {
    //     return projectData.o === 89
    // }
}