"use strict"

export class ModalRestrictionNotice {
    _element: HTMLElement

    constructor(element: HTMLElement) {
        this._element = element
    }

    get isShow() {
        return this._element.classList.contains('show')
    }
}