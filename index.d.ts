declare var isZoomRestricted: boolean

declare var isAdmin: boolean

declare var get_searchword: undefined | string

declare var gos_global: [{ id: string, name: string }]

type EconomicZones = {
    id: string;
    name: string;
    company_id: string;
    project_id: string;
    adress: string;
}

/**
 * @typedef {object} CompanyProdAddressType
 * @property {number} id
 * @property {number} company_id
 * @property {string} name
 */

type IEconomicZonesCollection<TObj extends EconomicZones> = {
    [k in TObj['id']]: TObj
}

declare var industrial_global: IEconomicZonesCollection<EconomicZones>;

declare namespace YmapsExtendedNS {
    interface LoadingObjectManagerOptions {
        /** Флаг, показывающий, нужно ли кластеризовать объекты. Обратите внимание, что на данный момент кластеризация работает только для точечных объектов. При включенном режиме кластеризации все неточечные объекты будут игнорироваться. */
        clusterize: boolean | undefined,
        /** Размер тайла для загрузки данных. */
        loadTileSize: number | undefined,
        /** Имя GET-параметра, который содержит значение jsonp-колбека. */
        paddingParamName: boolean | undefined,
        /**
         * Шаблон для jsonp-колбека. Поддерживает те же подстановки, что и urlTemplate. Все символы, не являющиеся буквой или цифрой, будут заменены на '_'. Если параметр не задан, то имя jsonp-колбека будет сгенерировано автоматически. Примеры преобразований при tileNumber=[3, 1], zoom=9:
         * - 'myCallback=%x' => 'myCallback_3'
         * - '%c' => 'x_3_y_1_z_9'
         * - 'callback2_%c' => 'callback2_x_3_y_1_z_9'
         * - 'callback%test' => 'callback_test'
         * - 'callback_%b' => 'callback_85_0841__180_0000_85_0841_180_0000'
         * 
         * Обратите внимание, что если не использовать в значении опции подстановки, то это может привести к ошибке. Все запросы будут обращаться к одной callback-функции.
         */
        paddingTemplate: string | undefined,
        /** Разделять запросы за данными на запросы за одиночными тайлами. По умолчанию запросы делаются за данными для прямоугольной области, содержащей несколько тайлов. */
        splitRequests: boolean | undefined,
        /** Флаг, разрешающий создавать оверлеи для объектов синхронно. Обратите внимание, что при синхронном создании оверлея нужно самостоятельно обеспечить загрузку нужного класса, реализующего интерфейс {@link ymaps.IOverlay}. По умолчанию оверлеи создаются асинхронно, при этом класс оверлея загружается по требованию. */
        syncOverlayInit: boolean | undefined,
        /** Отступ для области, в которой показываются объекты. С помощью данной опции область показа объектов расширяется по отношению к видимой области карты. */
        viewportMargin: number | number[] | undefined
    }

    class LoadingObjectManager<T extends ymaps.IGeometry> implements ymaps.ICustomizable, ymaps.IEventEmitter, ymaps.IGeoObject, ymaps.IParentOnMap {
        /**
         * 
         * @param urlTemplate шаблон URL данных. Поддерживаются специальные конструкции по аналогии с {@link ymaps.Layer}. Также поддерживаются подстановки:
         * - `%b` заменяется на массив географических координат, описывающих прямоугольную область, для которой требуется загрузить данные.
         * - `%t` заменяется на массив номеров тайлов, описывающих прямоугольную область, для которой требуется загрузить данные.
         * @param options Опции.
         * - Можно задавать все опции, указанные в описании {@link ymaps.Clusterer}, за исключением опций `hasBalloon` и `hasHint`.
         * - Опции для кластеров задаются с префиксом `cluster`. Список опций указан в описании класса {@link ymaps.ClusterPlacemark};
         * - Опции для одиночных объектов задаются с префиксом `geoObject`. Список опций определен в классе {@link ymaps.GeoObject}. Обратите внимание, менеджер не учитывает опцию `'visible'`.
         */
        constructor(urlTemplate: string, options: LoadingObjectManagerOptions | undefined)

        options: ymaps.IOptionManager;

        events: ymaps.IEventManager;

        geometry: T | null;

        properties: ymaps.IDataManager;

        state: ymaps.IDataManager;

        getOverlay(): Promise<ymaps.IOverlay | null>;

        getOverlaySync(): ymaps.IOverlay | null;

        getParent(): object | null;

        setParent(parent: object | null): this;

        getMap(): ymaps.Map;

        clusters: ymaps.objectManager.ClusterCollection;

        objects: ymaps.objectManager.ObjectCollection;

        getBounds(): number[][]|null;

        getObjectState(id: any): any

        getPixelBounds(): number[][]|null

        getTileUrl(): string|null

        getUrlTemplate(): string

        reloadData(): void

        setParent(parent: any): ymaps.IChildOnMap

        setUrlTemplate(urlTemplate: any): any
    }
}

declare const ymapsExtended: (typeof YmapsExtendedNS & typeof ymaps)