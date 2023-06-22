interface ProjectsDataDTO extends ymaps.IFeatureData {
    /** Поле должно всегда иметь значение "Feature". */
    type: "Feature"
    /** Уникальный идентификатор объекта. Разработчик должен сформировать идентификаторы объектов самостоятельно. (равно Id проекта) */
    id: string
    /** Геометрия объекта. */
    geometry: {
        /** Тип геометрии объекта. */
        type: "Point"
        /** Координаты проекта */
        coordinates: [number, number]
    }
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
        /** какая-то фигня (равно Id проекта) */
        clusterCaption: number
    }
    /** Стадия проекта */
    t: number
    /** Id отрасли */
    s: number
    /** Id региона */
    o: number | null
    /** Номер типа гос-компании */
    g: number
    /** неизвестный параметр */
    c: number
    /** Код страны */
    z: number
    /** неизвестный параметр */
    l: number | null
    /** неизвестный параметр */
    u: number | null
    /** Номер типа работ */
    wt: number
    /** Id экономической зоны */
    iz: number | null
}

interface ProjectsData extends ProjectsDataDTO {
    properties: {
        /** какая-то фигня (равно Id проекта) */
        clusterCaption: number

        // Динамические данные

        /** Проект состоят в какой-либо папке */
        isFolderItem?: boolean

        /** Это иностранный проект */
        isForeign?: boolean

        /** Пользователь уже нажимал на этот поинт? */
        isVisited?: boolean
    }
}

class ProjectIconUrlCreator {
    public static projectIconsUrl = '/web/img/map/icons/svg/'

    private static stageToToken = new Map<number, string>([
        [17, "st_1"], [2, "st_2"], [3, "st_3"], [7, "st_4"], [4, "st_5"], [5, "st_6"], [8, "st_upgrade"], [6, "st_pause"], [10, "st_stop"]
    ])

    private static isForeignToToken = new Map<boolean, string>([[false, ""], [true, "eaeu"]])

    private static isVisitedToToken = new Map<boolean, string>([[false, "normal"], [true, "visited"]])

    private static isFolderItemToToken = new Map<boolean, string>([[false, ""], [true, "f"]])

    public static createFileNameByProjectProperties(stage: number, isForeign: boolean, isVisited: boolean, isFolderItem: boolean): string {
        const tokens = [
            // first: /stage_...
            this.stageToToken.get(stage),
            // then: ...foreign_...
            this.isForeignToToken.get(isForeign),
            // and then: ...visited_...
            this.isVisitedToToken.get(isVisited),
            // finnaly: ...folder_...
            this.isFolderItemToToken.get(isFolderItem)
        ].filter((value) => value.length)
        return `${tokens.join("_")}.svg`
    }
}

class InvestBrowserProjectsMapPointsLoader<FeathureType extends ymaps.IFeatureData> extends InvestBrowserClusteredMapPointsLoader<FeathureType> {
    constructor(urlTemplate: string, options?: ymaps.objectManager.LoadingObjectManagerOptions) {
        super(urlTemplate, options)

        this.addHandlerOnAddingPoint(this.pointsEventManager)
    }

    protected addHandlerOnAddingPoint(events: ymaps.IEventManager<{}>): void {
        events.add(['add'], InvestBrowserProjectsMapPointsLoader.setPersonalPointerDesign.bind(this))
    }

    public static setPersonalPointerDesign(event: ymaps.IEvent<MouseEvent>, { }): void {
        const point: ProjectsData = event.get('child')

        objectManager.objects.setObjectOptions(point.id, {
            iconImageHref: this.getIconUriForPoint(point)
        })
    }

    private static getIconUriForPoint(projectData: ProjectsData): string {
        const stage: number = projectData.t
        const isVisited: boolean = projectData.properties.isVisited || false
        const { isFolderItem, isForeign } = projectData.properties
        return ProjectIconUrlCreator.projectIconsUrl
            + ProjectIconUrlCreator.createFileNameByProjectProperties(stage, isForeign, isVisited, isFolderItem)
    }
}