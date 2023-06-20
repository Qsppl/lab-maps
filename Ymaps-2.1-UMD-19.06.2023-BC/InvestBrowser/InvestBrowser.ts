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
class InvestBrowser {
    private static _projectsDataEndpoint = ['POST', `${app.en_prefix}/ajax/ymaps/get-projects-data`]

    /** ограничение просмотров проектов для незарегистрированных пользователей */
    private static limitOfProjectViews = 10;

    private _map: IInvestBrowserMap
    private _browserUI: IInvestBrowserUI
    private _user: IInvestBrowserUser

    constructor(map: IInvestBrowserMap, browserUI: IInvestBrowserUI, user: IInvestBrowserUser) {
        this._map = map
        this._browserUI = browserUI
        this._user = user

        if (user.isGuest || user.isRegistrant) {
            browserUI.doSomething2();
            if (user.isSpentDailyLimit || (user.numberOfViewedProjects >= InvestBrowser.limitOfProjectViews)) {
                browserUI.limitMapZoom()
            }
        }
    }
}