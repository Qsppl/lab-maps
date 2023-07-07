import { ISelectableFeathureJson, ISelectableFeathureJsonOptions } from "./object.js"

// this type is placed in a separate declaration so that it can be imported in other files
export type GroupFeathureOptions = ISelectableFeathureJsonOptions<ymaps.PlacemarkOptions> & {
    isFolderItem?: boolean | undefined
}

// this type is placed in a separate declaration so that it can be imported in other files
export type GroupFeathureProperties = {
    /** какая-то фигня (равно Id проекта) */
    clusterCaption: number
}

export type GroupFeathure = ISelectableFeathureJson<
    ymaps.geometry.json.Point,
    GroupFeathureOptions,
    GroupFeathureProperties
> & {
    /** Id отрасли */
    s: number
    /** Id региона */
    o: number | null
    /** Код страны */
    z: number
}

export type GroupsLoadingObjectManagerOptions = ymaps.LoadingObjectManagerOptions<GroupFeathureOptions, ymaps.geometryEditor.PointOptions>

export type GroupsLoadingObjectManager = ymaps.LoadingObjectManager<
    GroupFeathureOptions,
    GroupFeathure,
    ymaps.geometryEditor.PointOptions,
    ymaps.PlacemarkOptions
>