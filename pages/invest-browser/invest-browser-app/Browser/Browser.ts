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

        // this.showProjects()
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