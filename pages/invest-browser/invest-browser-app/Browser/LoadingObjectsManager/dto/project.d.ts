import { ISelectableFeathureJson, ISelectableFeathureJsonOptions } from "./object.js"

// this type is placed in a separate declaration so that it can be imported in other files
export type ProjectFeathureOptions = ISelectableFeathureJsonOptions<ymaps.PlacemarkOptions> & {
    isFolderItem?: boolean | undefined
}

// this type is placed in a separate declaration so that it can be imported in other files
export type ProjectFeathureProperties = {
    /** какая-то фигня (равно Id проекта) */
    clusterCaption: number
}

export type ProjectFeathure = ISelectableFeathureJson<
    ymaps.geometry.json.Point,
    ProjectFeathureOptions,
    ProjectFeathureProperties
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

export type ProjectsLoadingObjectManagerOptions = ymaps.LoadingObjectManagerOptions<ProjectFeathureOptions, ymaps.geometryEditor.PointOptions>

export type ProjectsLoadingObjectManager = ymaps.LoadingObjectManager<
    ProjectFeathureOptions,
    ProjectFeathure,
    ymaps.geometryEditor.PointOptions,
    ymaps.PlacemarkOptions
>