// this type is placed in a separate declaration so that it can be imported in other files
export type IFeatureJsonOptions = ymaps.PlacemarkOptions & {
    isVisited?: boolean | undefined
    isSelected?: boolean | undefined
}

// this type is placed in a separate declaration so that it can be imported in other files
export type IFeatureJsonProperties = {
    /** какая-то фигня (равно Id проекта) */
    clusterCaption: number
}

export type IFeatureJson = ymaps.geometry.json.IFeatureJson<
    ymaps.geometry.json.Point,
    IFeatureJsonOptions,
    IFeatureJsonProperties
> & {
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

export type LoadingObjectManager = ymaps.LoadingObjectManager<
    IFeatureJson,
    IFeatureJsonOptions,
    ymaps.geometryEditor.PointOptions
>