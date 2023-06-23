import { IUserInterface, ZoomRestrictionPresetKeys } from "../Browser/interfaces/IUserInterface.js"
import { ModalRestrictionNotice } from "./ModalRestrictionNotice.js"
import { IMap } from "./interfaces/IMap.js"
import { IPlace } from "./interfaces/IPlace.js"

type ZoomRestrictionPresetData = { baseZoom?: number, zoomInLimit: number, zoomInMessageKey: string, zoomOutLimit: number, zoomOutMessageKey: string }

/** Класс реализующий работу пользовательского интерфейса управления браузером проектов Investproject */
export class UserInterface implements IUserInterface {
    private readonly restrictionPresets = new Map<ZoomRestrictionPresetKeys, ZoomRestrictionPresetData>([
        ["for-guest", { baseZoom: 7, zoomInLimit: 10, zoomInMessageKey: "zoom-restriction-guest", zoomOutLimit: 4, zoomOutMessageKey: "zoom-restriction-guest" }],
        ["for-registrant", { baseZoom: 7, zoomInLimit: 10, zoomInMessageKey: "zoom-restriction-registrant", zoomOutLimit: 4, zoomOutMessageKey: "zoom-restriction-registrant" }],
    ])
    private readonly localizationAssets = {
        ru: {
            'zoom-in-limit': 'Это максимальное приближение карты',
            'zoom-out-limit': 'Это максимальное отдаление карты',
            'zoom-restriction-registrant': 'Для большего увеличения оформите подписку или получите демо-доступ',
            'zoom-restriction-guest': 'Масштабирование ограничено для незарегистрированных пользователей',
        },
        en: {
            'zoom-in-limit': 'This is the maximum zoom of the map',
            'zoom-out-limit': 'This is the maximum distance of the map',
            'zoom-restriction-registrant': 'For a bigger zoom, subscribe or get demo access',
            'zoom-restriction-guest': 'Zooming is limited for unregistered users',
        }
    }

    private readonly _map: IMap
    private readonly _place: IPlace
    private readonly _localizationAsset
    /** Модальное окно уведомляющее пользователя о том что у него есть какое-либо ограничение использования приложения */
    private readonly _modalRestrictionNotice: Promise<ModalRestrictionNotice>

    private _zoomInMessage: string

    private _zoomOutMessage: string

    constructor(map: IMap, place: IPlace, languageLocale: string) {
        this._map = map
        this._place = place
        this._localizationAsset = this.localizationAssets[languageLocale]

        this._modalRestrictionNotice = app.querySelectorPromise('#no-access').then((element: HTMLElement | null) => {
            if (!element) throw new Error('Could not find element by id="no-access"')
            return new ModalRestrictionNotice(element)
        })

        this.doSomething1()

        // Ymaps по умолчанию имеет ограничение на зум.
        // Будем выводить сообщения при попытке выкрутить масштабирование за границы ограничения.
        // Так красивее
        this.setMapZoomBoundsingNotions(this.localizationAssets["zoom-in-limit"], this.localizationAssets["zoom-out-limit"])
        this._map.onZoomInBoundsing = (() => { this.showWarningNotice(this._zoomInMessage, "map-zoom-boundsing-notions") }).bind(this)
        this._map.onZoomOutBoundsing = (() => { this.showWarningNotice(this._zoomOutMessage, "map-zoom-boundsing-notions") }).bind(this)
    }

    public setZoomRestriction(presetKey: ZoomRestrictionPresetKeys): void {
        // extracting information from a preset
        const { baseZoom, zoomOutLimit, zoomInLimit, zoomInMessageKey, zoomOutMessageKey } = this.restrictionPresets.get(presetKey)
        const [zoomInMessage, zoomOutMessage] = [this._localizationAsset[zoomInMessageKey], this._localizationAsset[zoomOutMessageKey]]

        // apply
        if (baseZoom) this._map.setZoom(baseZoom)
        this._map.setZoomRange(zoomOutLimit, zoomInLimit)
        this.setMapZoomBoundsingNotions(zoomInMessage, zoomOutMessage)
    }

    public doSomething2() {
        $('header').hover(function () { $('body').removeClass('modal-open') })
        $('.form-control--search').click(function () { $(this).trigger("focus") })
        $('header').addClass('position-relative')
        $('header').css('z-index', '1060')
    }

    // async showRestrictionNotice() {
    //     //     const restrictionNotice = await this._modalRestrictionNotice

    //     //     if (restrictionNotice.isShow) {
    //     //         // Зачем? Что тут, блин, происходит?
    //     //         setTimeout(this._showRestrictionNotice.bind(this), 3000)
    //     //     } else {
    //     //         localStorage.setItem('gsp', '11')
    //     //         $('#no-access-guest-map').modal({
    //     //             keyboard: false,
    //     //             backdrop: 'static'
    //     //         })
    //     //     }

    //     //     if (isFpOK) {
    //     //         $.post('/ajax/ymaps/set-map-block', {
    //     //             fpOurId: fpOurId,
    //     //         })
    //     //             .done(function (res) {
    //     //                 res = JSON.parse(res).data
    //     //                 fpOurId = res.userFpId
    //     //                 isFpOK = res.isMapLimited
    //     //             })
    //     //             .fail(function () { console.log('fail ajax fp') })
    //     //     }
    // }

    private setMapZoomBoundsingNotions(zoomInMessage: string, zoomOutMessage: string) {
        this._zoomInMessage = zoomInMessage
        this._zoomOutMessage = zoomOutMessage
    }

    private showWarningNotice(message: string, debounceGroup: string) {
        this.showToast({ heading: message, text: "", icon: 'info', position: 'bottom-right' })
    }

    private showToast({ heading, icon, text = '', position = 'bottom-right' }: toastOptions) {
        $.toast({
            heading,
            text,
            showHideTransition: 'fade',
            icon,
            position,
            hideAfter: 3000,
            allowToastClose: false,
            loader: false,
            class: 'toast_larger-font toast_map_alert',
            stack: false
        })
    }

    private doSomething1() {
        document.addEventListener('DOMContentLoaded', () => {
            document.body.classList.add('specModalBlackout', 'maps-page')
        })
    }
}