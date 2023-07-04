// this type is placed in a separate declaration so that it can be imported in other files
export type ISelectableFeathureJsonOptions<Options extends ymaps.IOptionManagerData> = Options & {
    isVisited?: boolean | undefined
    isSelected?: boolean | undefined
}

export type ISelectableFeathureJson<
    GeometryJson extends ymaps.geometry.json.YmapsGeometryJsonIndex | ymaps.geometry.json.IGeometryJson,
    Options extends ISelectableFeathureJsonOptions<ymaps.IOptionManagerData>,
    Properties extends ymaps.IDataManagerData
> = ymaps.geometry.json.IFeatureJson<GeometryJson, Options, Properties>