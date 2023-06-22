/** Класс инкапсулирующий логику управления картой. */
export class YandexMapAdapter implements IInvestBrowserMap, IInvestBrowserUIMap {
    private static center = [59.92, 30.3413]

    static zoomConfigs: { [k in 'default' | 'restricted' | 'region']: { minZoom: number, middleZoom: number, maxZoom: number } } = {
        default: { minZoom: 4, middleZoom: 7, maxZoom: 18 },
        restricted: { minZoom: 4, middleZoom: 7, maxZoom: 10 },
        region: { minZoom: 4, middleZoom: 6, maxZoom: 18 }
    }

    static controls: (string | ymaps.control.ZoomControl | ymaps.control.RulerControl | ymaps.control.TypeSelector)[] = ['rulerControl']
    static searchControlParameters: ymaps.control.ISearchControlParameters = { options: { provider: 'yandex#search' } }

    _yandexMap: Promise<ymaps.Map>

    _localizationAsset

    constructor(containerElement: HTMLElement | string) {
        this._localizationAsset = YandexMapAdapter.localizationAssets['']

        this._yandexMap = findElementAfterDocumentLoad(containerElement)
            .then(element => { return YandexMapAdapter._createMapInstance(element, { controls: YandexMapAdapter.controls }) })

        this._yandexMap.then(map => map.events.add("wheel", this._handleZoomOutRange.bind(this)))

        // Finish card configuration after initialization:

        const zoomConfig = isZoomRestricted ? YandexMapAdapter.zoomConfigs.restricted : YandexMapAdapter.zoomConfigs.default

        // 1. Set map state after initaliazation
        this.moveTo(YandexMapAdapter.center, zoomConfig.middleZoom)

        // 2. Set map options after initaliazation
        const { minZoom, maxZoom } = zoomConfig
        this.setZoomRange({
            zoomIn: { limit: maxZoom, warningMessage: this._localizationAsset["zoom-in-is-limited"] },
            zoomOut: { limit: minZoom, warningMessage: this._localizationAsset["zoom-out-is-limited"] }
        })
        this._yandexMap.then(yandexMap => {
            // Будет производиться поиск по топонимам и организациям.
            yandexMap.controls.add(new ymaps.control.SearchControl(YandexMapAdapter.searchControlParameters))
        })
    }

    async moveTo([x, y]: number[], zoom: number): Promise<any> {
        const map = await this._yandexMap
        const [minZoom, maxZoom] = map.zoomRange.getCurrent()
        if (zoom >= maxZoom) zoom = maxZoom
        if (zoom <= minZoom) zoom = minZoom
        const promise = map.setCenter(x, y, zoom)
        promise.then(() => { map.events.fire('actionend') })
        return promise
    }

    async moveToAnotherCenter() {
        console.table('fire actionend 1')
        return this.moveTo(YandexMapAdapter.anotherCenter, 0)
    }

    async moveMapToRegion([x, y]) {
        console.table('fire actionend 2')
        return this.moveTo([x, y], YandexMapAdapter.zoomConfigs.region.middleZoom)
    }

    async setZoomRange({ zoomIn, zoomOut }: { zoomIn?: { limit?: number, warningMessage?: string }, zoomOut?: { limit?: number, warningMessage?: string } }) {
        if (zoomIn && zoomIn.limit && zoomIn.warningMessage) this._localizationAsset['zoom-in-is-limited'] = zoomIn.warningMessage
        if (zoomOut && zoomOut.limit && zoomOut.warningMessage) this._localizationAsset['zoom-out-is-limited'] = zoomOut.warningMessage

        const map = await this._yandexMap
        if (zoomIn && zoomIn.limit) map.options.set({ maxZoom: zoomIn.limit })
        if (zoomOut && zoomOut.limit) map.options.set({ minZoom: zoomOut.limit })
    }

    /** Обработчик выхода за пределы масштабирования карты. Сообщает пользователю о блокировке масштабирования, если она сработала. */
    async _handleZoomOutRange(event: ymaps.IEvent<WheelEvent, {}>) {
        const wheelEvent = event.getSourceEvent()?.originalEvent?.domEvent?.originalEvent // я искринне ненавижу разработчиков яндекс-карт
        if (wheelEvent === undefined) {
            console.warn("corrupted event in _handleZoomOutRange: ", event)
            return
        }

        const map = await this._yandexMap
        const zoom = map.getZoom()
        const [minZoom, maxZoom] = map.zoomRange.getCurrent()

        /** Пользователь приблизил карту? */
        const isMapZoomedIn = wheelEvent.deltaY < 0 // В ymaps используется "масштаб приближения", значит если дельта скролла отрицательная, то пользователь приближает карту.

        if (isMapZoomedIn && zoom >= maxZoom) {
            app.showToast(this._localizationAsset['zoom-in-is-limited'], null, 'error', 'bottom-right')
        }

        /** Пользователь отдалил карту? */
        const isMapZoomedOut = !isMapZoomedIn

        if (isMapZoomedOut && zoom <= minZoom) {
            app.showToast(this._localizationAsset['zoom-out-is-limited'], null, 'error', 'bottom-right')
        }
    }

    /** Обертка для типизации и асинхронности. */
    static async _createMapInstance(containerElement: HTMLElement, state: IMapState): Promise<ymaps.Map> {
        await ymaps.ready()
        return new ymaps.Map(containerElement, state)
    }
}