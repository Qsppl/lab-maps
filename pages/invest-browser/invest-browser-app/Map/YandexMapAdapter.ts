"use strict"

import { IMap as IBrowserMap } from "../Browser/interfaces/IMap.js"
import { IMap as IUserInterfaceMap } from "../UserInterface/interfaces/IMap.js"
import { IPlace as IUserInterfacePlace } from "../UserInterface/interfaces/IPlace.js"
import { ProjectsLoadingObjectManager } from "../Browser/LoadingObjectsManager/dto/project.js"
import { GroupsLoadingObjectManager } from "../Browser/LoadingObjectsManager/dto/group.js"

const ymaps = globalThis.ymaps

/** Класс инкапсулирующий логику управления картой. */
export class YandexMapAdapter implements IBrowserMap, IUserInterfacePlace, IUserInterfaceMap {
    private readonly center: [number, number] = [59.92, 30.3413]

    private readonly zoom = 7

    private readonly zoomRange = { minZoom: 4, maxZoom: 18 }


    private readonly controls: (ymaps.IControl | ymaps.ControlKey)[] = ['rulerControl']

    private readonly searchControlParameters: ymaps.control.ISearchControlParameters = { options: { provider: 'yandex#search' } }


    private _onZoomInBoundsing?: CallableFunction

    private _onZoomOutBoundsing?: CallableFunction


    public readonly _yandexMap: Promise<ymaps.Map>


    constructor(containerElement: HTMLElement | string) {
        const { center, zoom } = this
        const { minZoom, maxZoom } = this.zoomRange

        const containerElementPromise = typeof containerElement === "string" ? app.querySelectorPromise(containerElement) : Promise.resolve(containerElement)
        this._yandexMap = containerElementPromise.then(async (element) => {
            await ymaps.ready()
            return new ymaps.Map(element, { controls: [], center, zoom }, { minZoom, maxZoom })
        })

        this._yandexMap.then(map => {
            this.controls.push(new ymaps.control.SearchControl(this.searchControlParameters))
            this.controls.push(new ymaps.control.ZoomControl({ options: { size: 'small', position: { right: 10, top: 200 } } }))
            this.controls.map(control => map.controls.add(control))
        })

        this._yandexMap.then(map => map.events.add("wheel", this._callZoomBoundsingHandlers.bind(this)))
    }

    public async panTo([x, y]: number[], zoom?: number): Promise<void> {
        const map = await this._yandexMap

        if (!zoom) return map.panTo([x, y])

        throw new Error("Эта функция еще не реализована")

        // promise.then(() => { map.events.fire('actionend') })
    }

    public async setCenter([x, y]: number[], zoom?: number): Promise<void> {
        const map = await this._yandexMap

        if (!zoom) return map.panTo([x, y])

        const [minZoom, maxZoom] = map.zoomRange.getCurrent()

        if (zoom >= maxZoom) zoom = maxZoom
        if (zoom <= minZoom) zoom = minZoom

        return map.setCenter([x, y], zoom, {
            checkZoomRange: true
        })
        // promise.then(() => { map.events.fire('actionend') })
    }

    public async setZoom(zoom: number): Promise<void> {
        const map = await this._yandexMap
        map.setZoom(zoom, { checkZoomRange: true })
    }

    /**
     * @param minZoom zoomOut limit
     * @param maxZoom zoomIn limit
     */
    public async setZoomRange(minZoom: number, maxZoom: number): Promise<void> {
        if (minZoom < 0 || maxZoom < minZoom) throw new Error();

        (await this._yandexMap).options.set({ minZoom, maxZoom })
    }

    public async addObjectsManager(objectManager: ymaps.LoadingObjectManager<any, any, any, any> | ymaps.ObjectManager<any, any, any>) {
        const map = await this._yandexMap
        map.geoObjects.add(objectManager)
    }

    /** Обработчик выхода за пределы масштабирования карты. Сообщает пользователю о блокировке масштабирования, если она сработала. */
    private async _callZoomBoundsingHandlers(event: ymaps.IEvent<WheelEvent, {}>) {
        const wheelEvent = event.getSourceEvent()?.originalEvent?.domEvent?.originalEvent // я искринне ненавижу разработчиков яндекс-карт
        if (wheelEvent === undefined) {
            console.warn("corrupted event in _callZoomBoundsingHandlers: ", event)
            return
        }

        const map = await this._yandexMap
        const zoom = map.getZoom()
        const [minZoom, maxZoom] = map.zoomRange.getCurrent()

        /** Пользователь приблизил карту? */
        const isMapZoomedIn = wheelEvent.deltaY < 0 // В ymaps используется "масштаб приближения", значит если дельта скролла отрицательная, то пользователь приближает карту.

        if (isMapZoomedIn && zoom >= maxZoom && this._onZoomInBoundsing) this._onZoomInBoundsing()

        /** Пользователь отдалил карту? */
        const isMapZoomedOut = !isMapZoomedIn

        if (isMapZoomedOut && zoom <= minZoom && this._onZoomOutBoundsing) this._onZoomOutBoundsing()
    }

    public set onZoomInBoundsing(callback: CallableFunction) {
        if (this._onZoomInBoundsing) throw new Error("")
        this._onZoomInBoundsing = callback
    }

    public set onZoomOutBoundsing(callback: CallableFunction) {
        if (this._onZoomOutBoundsing) throw new Error("")
        this._onZoomOutBoundsing = callback
    }
}