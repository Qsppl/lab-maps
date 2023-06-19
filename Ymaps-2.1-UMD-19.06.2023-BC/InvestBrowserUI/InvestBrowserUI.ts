import { IBrowserUI } from "../InvestprojectsBrowser/IBrowserUI";
import { findElementAfterDocumentLoad } from "../lib/asyncTools";
import { IMapPlace } from "./IMapPlace";

class ModalRestrictionNotice {
    _element: HTMLElement;

    constructor(element: HTMLElement) {
        this._element = element;
    }

    get isShow() {
        return this._element.classList.contains('show');
    }
}

/** Класс реализующий работу пользовательского интерфейса управления браузером проектов Investproject */
export class InvestprojectsBrowserUI implements IBrowserUI {
    _modalRestrictionNotice: Promise<ModalRestrictionNotice>

    constructor(map: IMapPlace) {
        InvestprojectsBrowserUI.doSomethingWeird();

        this._modalRestrictionNotice = findElementAfterDocumentLoad('#no-access')
            .then(element => { return new ModalRestrictionNotice(element) })
    }

    prepareUIForGuestUse() {
        $('header').hover(function () { $('body').removeClass('modal-open') })
        $('.form-control--search').click(function () { $(this).trigger("focus") })
        $('header').addClass('position-relative')
        $('header').css('z-index', '1060')
    }

    showRestrictionNotice(): void {
        this._showRestrictionNotice();
    }

    async _showRestrictionNotice() {
        const restrictionNotice = await this._modalRestrictionNotice;

        if (restrictionNotice.isShow) {
            // Зачем? Что тут, блин, происходит?
            setTimeout(this._showRestrictionNotice.bind(this), 3000)
        } else {
            localStorage.setItem('gsp', '11')
            $('#no-access-guest-map').modal({
                keyboard: false,
                backdrop: 'static'
            })
        }
        
        if (isFpOK) {
            $.post('/ajax/ymaps/set-map-block', {
                fpOurId: fpOurId,
            })
                .done(function (res) {
                    res = JSON.parse(res).data
                    fpOurId = res.userFpId
                    isFpOK = res.isMapLimited
                })
                .fail(function () { console.log('fail ajax fp'); })
        }
    }

    static doSomethingWeird() {
        document.addEventListener('DOMContentLoaded', () => {
            document.body.classList.add('specModalBlackout', 'maps-page')
        })
    }
}