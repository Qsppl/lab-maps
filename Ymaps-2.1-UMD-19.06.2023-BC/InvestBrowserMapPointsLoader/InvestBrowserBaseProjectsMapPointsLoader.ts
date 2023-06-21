interface ProjectsData extends ymaps.IFeatureData {
    /** Поле должно всегда иметь значение "Feature". */
    type: "Feature"
    /** Уникальный идентификатор объекта. Разработчик должен сформировать идентификаторы объектов самостоятельно. (Id проекта) */
    id: number,
    /** Геометрия объекта. */
    geometry: {
        /** Тип геометрии объекта. */
        type: "Point"
        /** Координаты проекта */
        coordinates: [number, number]
    },
    /**
     * Свойства объекта (например, содержимое балуна или метки). Список доступных свойств описан в классе {@link GeoObject}. Кроме того, в свойствах могут быть указаны произвольные поля.
     * @example "properties": {
     *      "balloonContent": "Текст балуна",
     *      "clusterCaption": "Метка 1",
     *      "hintContent": "Текст подсказки",
     *      "myDescription": "Произвольное описание"
     * }
     */
    properties: {
        /** какая-то фигня (Id проекта) */
        clusterCaption: number
    },
    /** Стадия проекта */
    t: number,
    /** Id отрасли */
    s: number,
    /** Id региона */
    o: number | null,
    /** Номер типа гос-компании */
    g: number,
    /** неизвестный параметр */
    c: number,
    /** Код страны */
    z: number,
    /** неизвестный параметр */
    l: number | null,
    /** неизвестный параметр */
    u: number | null,
    /** Номер типа работ */
    wt: number,
    /** Id экономической зоны */
    iz: number | null,
}

class InvestBrowserBaseProjectsMapPointsLoader<T = ProjectsData> extends InvestBrowserBaseClusteredMapPointsLoader<T extends ymaps.IFeatureData> {
    protected static iconUrlsOfPointer = {
        "planning-stage": '/web/img/map/icons/svg/st_1_normal.svg',
        "pre-project-stage": '/web/img/map/icons/svg/st_2_normal.svg',
        "design-stage": '/web/img/map/icons/svg/st_3_normal.svg',
        "pre-construction-stage": '/web/img/map/icons/svg/st_4_normal.svg',
        "construction-stage": '/web/img/map/icons/svg/st_5_normal.svg',
        "operational-stage": '/web/img/map/icons/svg/st_6_normal.svg',
        "modernization-stage": '/web/img/map/icons/svg/st_upgrade_normal.svg',
        "temporary-shutdown-stage": '/web/img/map/icons/svg/st_pause_normal.svg',
        "shutdown-stage": '/web/img/map/icons/svg/st_stop_normal.svg',
    }
    constructor(urlTemplate: string, options?: ymaps.objectManager.LoadingObjectManagerOptions) {
        super(urlTemplate, options)

        this.addHandlerOnAddingPoint(this.pointsEventManager)
    }

    protected addHandlerOnAddingPoint(events: ymaps.IEventManager<{}>): void {
        events.add(['add'], this.setPersonalPointerDesign.bind(this))
    }

    public setPersonalPointerDesign(event: ymaps.IEvent<MouseEvent>, { }): void {
        const point: ProjectsData = event.get('child')

        const iconUrl: string = InvestBrowserBaseProjectsMapPointsLoader.getIconForPoint(point)

        objectManager.objects.setObjectOptions(point.id, { iconImageHref: iconUrl })
    }

    static getIconForPoint(pointData: ProjectsData): string {
        const { iconUrlsOfPointer } = InvestBrowserBaseProjectsMapPointsLoader
        if (pointData.t === 17) return iconUrlsOfPointer["planning-stage"]
        if (pointData.t === 2) return iconUrlsOfPointer["pre-project-stage"]
        if (pointData.t === 3) return iconUrlsOfPointer["design-stage"]
        if (pointData.t === 7) return iconUrlsOfPointer["pre-construction-stage"]
        if (pointData.t === 4) return iconUrlsOfPointer["construction-stage"]
        if (pointData.t === 5) return iconUrlsOfPointer["operational-stage"]
        if (pointData.t === 8) return iconUrlsOfPointer["modernization-stage"]
        if (pointData.t === 10) return iconUrlsOfPointer["temporary-shutdown-stage"]
        if (pointData.t === 6) return iconUrlsOfPointer["shutdown-stage"]
        throw new TypeError()
    }

    static isProjectInAnyFolder()
}