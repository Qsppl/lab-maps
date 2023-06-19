import { InvestprojectsBrowserUI } from "../InvestprojectsBrowserUI/InvestprojectsBrowserUI";
import { app, isGuest, isRegistrant } from "../globalStates"
import { loadScript } from "../lib/asyncTools";
import { IBrowserUI } from "./IInvestBrowserUI";
import { IMap } from "./IInvestBrowserMap"

type FingerprintJSType = {
    load({ delayFallback, debug, monitoring }: {
        delayFallback?: number;
        debug?: boolean;
        monitoring?: boolean;
    }): Promise<Agent>;
}

interface Agent {
    get(): Promise<GetResult>
}

interface GetResult {
    visitorId: string
    confidence: {
        score: number
        comment?: string
    }
    components: {
        [key: string]:
        { value: any, duration: number } |
        { error: object, duration: number }
    }
    version: string
}

var FingerprintJS: undefined | FingerprintJSType

type localizationAsset = { 'zoom-in-is-limited-for-registrant': string; 'zoom-in-is-limited-for-guest': string }

export class InvestprojectsBrowser {
    static _projectsDataEndpoint = ['POST', `${app.en_prefix}/ajax/ymaps/get-projects-data`]
    static fingerprintjsCDN = 'https://cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@3/dist/fp.min.js'
    static checkVisitorIdURL = '/ajax/ymaps/test-fp'
    /** ограничение просмотров проектов для незарегистрированных пользователей */
    static restrictionOfProjectViews = 10;

    static localizationAssets: { [k in 'ru' | 'en']: localizationAsset } = {
        ru: {
            'zoom-in-is-limited-for-registrant': 'Для большего увеличения оформите подписку или получите демо-доступ',
            'zoom-in-is-limited-for-guest': 'Масштабирование ограничено для незарегистрированных пользователей',
        },
        en: {
            'zoom-in-is-limited-for-registrant': 'For a bigger zoom, subscribe or get demo access',
            'zoom-in-is-limited-for-guest': 'Zooming is limited for unregistered users',
        }
    }

    _localizationAsset: localizationAsset;
    _map: IMap
    _browserUI: IBrowserUI
    _userFingerprintId: any;
    _isLimited: boolean;

    constructor(map: IMap, browserUI: IBrowserUI, languageLocale: string) {
        this._map = map
        this._browserUI = browserUI
        this._localizationAsset = languageLocale === 'en'
            ? InvestprojectsBrowser.localizationAssets.en
            : InvestprojectsBrowser.localizationAssets.ru

        this.limitMapZoom()

        if (isGuest || isRegistrant) {
            this._browserUI.prepareUIForGuestUse()

            loadScript(InvestprojectsBrowser.fingerprintjsCDN)
                .then(InvestprojectsBrowser.loadVisitorStatis)
                .then(value => this.applyVisitorRestriction(value))
                .then(() => {
                    const gsp = +(localStorage.getItem('gsp') || '')
                    if (this._isLimited || (gsp >= InvestprojectsBrowser.restrictionOfProjectViews)) {
                        this._browserUI.showRestrictionNotice()
                    }
                })
        }
    }

    applyVisitorRestriction({ userFingerprintId, isLimited }: { userFingerprintId: any; isLimited: boolean; }) {
        this._userFingerprintId = userFingerprintId
        this._isLimited = isLimited
        const gsp = +(localStorage.getItem('gsp') || '')
        if (!(this._isLimited) && (gsp >= InvestprojectsBrowser.restrictionOfProjectViews)) {
            localStorage.setItem('gsp', '0')
        }
    }

    static async loadVisitorStatis(): Promise<{ userFingerprintId: any, isLimited: boolean }> {
        if (!FingerprintJS) throw new Error("Невозможно выполнить метод пока не будет загружен скрипт FingerprintJS");
        const FingerprintJSAgent: Agent = await FingerprintJS.load({})
        const result: GetResult = await FingerprintJSAgent.get();
        const requestURL = `${InvestprojectsBrowser.checkVisitorIdURL}?fpId=${result.visitorId}`

        const response = await fetch(requestURL, { credentials: 'same-origin' })
        if (!response.ok) throw new Error("Ошибка сети!")
        if (response.status !== 200) throw new Error(`Неправильный запрос: ${requestURL}`)

        const data = await response.json()
        return { userFingerprintId: data.userFpId, isLimited: !!(data.isMapLimited) }
    }

    limitMapZoom() {
        // this._map.limitZoom()
        // if (isGuest) toastText = this.localizationData['zoom-in-is-limited-for-guest']
        // if (isRegistrant) toastText = this.localizationData['zoom-in-is-limited-for-registrant']
    }

    // static _readAppStateFromUrl() {
    //     let targetProjectId = app.getUrlParameter('project_id') ? +app.getUrlParameter('project_id') : null
    //     return { targetProjectId }
    // }

    // async loadProjects(ids) {
    //     InvestprojectsBrowser._applyLoadScreen()
    //     const data = await InvestprojectMapApp._loadProjectsData(ids)
    //     renderProjects(data.projects, data.projects_quantity, data.projects_all_ids)
    //     InvestprojectsBrowser._hideLoadScreen()
    // }

    // static _loadProjectsData(ids) {
    //     const [type, url] = InvestprojectMapApp._projectsDataEndpoint
    //     return new Promise((resolve, reject) => {
    //         $.ajax({
    //             type,
    //             url,
    //             data: { ids },
    //             success: (response) => {
    //                 resolve(JSON.parse(response).data)
    //             },
    //             error: reject
    //         })
    //     })
    // }

    // /** Показать новое окно с проектами */
    // openProjects(projects, projects_quantity = 0, projects_all_ids = [], type = 'projects') {
    //     // Добавление проектов в окно происходит уже непосредственно в конструкторе CustomControlClass
    //     if (this.projectsControl) {
    //         this.projectsControl.onRemoveFromMap()
    //     }
    //     this.projectsControl = new CustomControlClass()
    //     this.projectsControl.type = 'projects'
    //     this.projectsControl.projects = projects
    //     this.projectsControl.projects_quantity = projects_quantity
    //     this.projectsControl.projects_all_ids = projects_all_ids

    //     this._map.addProjectsFocusMenu(this.projectsControl)
    // }

    // openCompanies() {

    // }

    // tooManyApproximatelyProjects(ids) {
    //     if (!ids || !ids.length) return false
    //     ids = ids.map(t => parseInt(t, 10))
    //     const maxApproximProjects = 15
    //     if (ids.length < maxApproximProjects) return false
    //     let proj_x, proj_y
    //     const dubles = []
    //     let isTooMany = false
    //     let dublesCounter = 0
    //     let str = ''

    //     for (const [key, p] of Object.entries(projects_all.features)) {
    //         if (!ids.includes(p.id)) continue
    //         proj_x = parseFloat(p.geometry.coordinates[0])
    //         proj_y = parseFloat(p.geometry.coordinates[1])
    //         str = proj_x + '-' + proj_y
    //         if (dubles.includes(str)) dublesCounter++
    //         else dubles.push(str)
    //         if (dublesCounter > maxApproximProjects) {
    //             isTooMany = true
    //             break
    //         }
    //     }

    //     return isTooMany
    // }

    // static _applyLoadScreen() {
    //     appLoadScreen.loading()
    // }

    // static _hideLoadScreen() {
    //     appLoadScreen.hide()
    // }
}