class ModalRestrictionNotice {
    _element: HTMLElement

    constructor(element: HTMLElement) {
        this._element = element
    }

    get isShow() {
        return this._element.classList.contains('show')
    }
}

/** Класс реализующий работу пользовательского интерфейса управления браузером проектов Investproject */
class InvestBrowserUI implements IInvestBrowserUI {
    private static localizationAssets = {
        ru: {
            'zoom-in-limit': 'Увеличение ограничено из-за окончания лимитов работы с картой',
            'zoom-out-limit': 'Максимальное отдаление карты',
            'zoom-restriction-registrant': 'Для большего увеличения оформите подписку или получите демо-доступ',
            'zoom-restriction-guest': 'Масштабирование ограничено для незарегистрированных пользователей',
        },
        en: {
            'zoom-in-limit': 'Zooming is limited due to the end of the limits of working with the card',
            'zoom-out-limit': 'Maximum map distance',
            'zoom-restriction-registrant': 'For a bigger zoom, subscribe or get demo access',
            'zoom-restriction-guest': 'Zooming is limited for unregistered users',
        }
    }

    private readonly _map: IInvestBrowserUIMap
    private _localizationAsset
    /** Модальное окно уведомляющее пользователя о том что у него есть какое-либо ограничение использования приложения */
    private _modalRestrictionNotice: Promise<ModalRestrictionNotice>

    constructor(map: IInvestBrowserUIMap, languageLocale: string) {
        this._localizationAsset = InvestBrowserUI.localizationAssets[languageLocale]

        this._map = map

        InvestBrowserUI.doSomething1()

        this._modalRestrictionNotice = app.querySelectorPromise('#no-access').then((element: HTMLElement | null) => {
            if (!element) throw new Error('Could not find element by id="no-access"')
            return new ModalRestrictionNotice(element)
        })
    }

    doSomething2() {
        $('header').hover(function () { $('body').removeClass('modal-open') })
        $('.form-control--search').click(function () { $(this).trigger("focus") })
        $('header').addClass('position-relative')
        $('header').css('z-index', '1060')
    }

    limitMapZoom() {

    }

    async showRestrictionNotice() {
        //     const restrictionNotice = await this._modalRestrictionNotice

        //     if (restrictionNotice.isShow) {
        //         // Зачем? Что тут, блин, происходит?
        //         setTimeout(this._showRestrictionNotice.bind(this), 3000)
        //     } else {
        //         localStorage.setItem('gsp', '11')
        //         $('#no-access-guest-map').modal({
        //             keyboard: false,
        //             backdrop: 'static'
        //         })
        //     }

        //     if (isFpOK) {
        //         $.post('/ajax/ymaps/set-map-block', {
        //             fpOurId: fpOurId,
        //         })
        //             .done(function (res) {
        //                 res = JSON.parse(res).data
        //                 fpOurId = res.userFpId
        //                 isFpOK = res.isMapLimited
        //             })
        //             .fail(function () { console.log('fail ajax fp') })
        //     }
    }

    decoratePointsLoader(pointsLoader: ymaps.objectManager.LoadingObjectManager<ymaps.IGeometry>) {
        return new InvestBrowserUIPointsDecorator(pointsLoader)
    }

    addPointsLoaderToMap(pointsLoader: ymaps.objectManager.LoadingObjectManager<ymaps.IGeometry>): void {
        this._map.addPointsLoader(pointsLoader)
    }

    static doSomething1() {
        document.addEventListener('DOMContentLoaded', () => {
            document.body.classList.add('specModalBlackout', 'maps-page')
        })
    }
}