import { IMapOptions } from "yandex-maps"
import { IMap as IBrowserMap } from "../Browser/interfaces/IMap.js"
import { IMap as IUserInterfaceMap } from "../UserInterface/interfaces/IMap.js"
import { IPlace as IUserInterfacePlace } from "../UserInterface/interfaces/IPlace.js"

const ymaps = globalThis.ymaps

/** Класс инкапсулирующий логику управления картой. */
export class YandexMapAdapter implements IBrowserMap, IUserInterfacePlace, IUserInterfaceMap {
    private readonly center: [number, number] = [59.92, 30.3413]
    private readonly zoom = 7
    private readonly zoomRange = { minZoom: 4, maxZoom: 18 }

    private readonly controls: (ymaps.IControl | ymaps.ControlKey)[] = ['rulerControl']
    private readonly searchControlParameters: ymaps.control.ISearchControlParameters = { options: { provider: 'yandex#search' } }

    _yandexMap: Promise<ymaps.Map>

    constructor(containerElement: HTMLElement | string) {
        const { controls, center, zoom } = this
        const { minZoom, maxZoom } = this.zoomRange
        this._yandexMap = app.querySelectorPromise(containerElement).then(element => {
            return this._createMapInstance(element, { controls: [], center, zoom }, { minZoom, maxZoom })
        })
        this._yandexMap.then(map => {
            this.controls.map(control => map.controls.add(control))
            map.controls.add(new ymaps.control.SearchControl(this.searchControlParameters))
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

    private _onZoomInBoundsing?: CallableFunction
    set onZoomInBoundsing(callback: CallableFunction) {
        if (this._onZoomInBoundsing) throw new Error("")
        this._onZoomInBoundsing = callback
    }

    private _onZoomOutBoundsing?: CallableFunction
    set onZoomOutBoundsing(callback: CallableFunction) {
        if (this._onZoomOutBoundsing) throw new Error("")
        this._onZoomOutBoundsing = callback
    }

    /** Обертка для типизации и асинхронности. */
    private async _createMapInstance(containerElement: HTMLElement, state: ymaps.IMapState, options: IMapOptions): Promise<ymaps.Map> {
        await ymaps.ready()
        return new ymaps.Map(containerElement, state, options)
    }
}