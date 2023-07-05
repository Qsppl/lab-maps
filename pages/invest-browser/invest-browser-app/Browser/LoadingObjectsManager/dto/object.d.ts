type AnyGeometryJson = ymaps.geometry.json.YmapsGeometryJsonIndex | ymaps.geometry.json.IGeometryJson

// this type is placed in a separate declaration so that it can be imported in other files
export type ISelectableFeathureJsonOptions<Options extends ymaps.IOptionManagerData> = Options & {
    isVisited?: boolean | undefined
    isSelected?: boolean | undefined
}

export type ISelectableFeathureJson<
    GeometryJson extends AnyGeometryJson,
    Options extends ISelectableFeathureJsonOptions<ymaps.IOptionManagerData>,
    Properties extends ymaps.IDataManagerData
> = ymaps.geometry.json.IFeatureJson<GeometryJson, Options, Properties>

// this type is placed in a separate declaration so that it can be imported in other files
export type ISelectableClusterJsonOptions<Options extends ymaps.IOptionManagerData> = Options & {
    isVisited?: boolean | undefined
    isSelected?: boolean | undefined
}

export type ISelectableClusterJson<
    GeometryJson extends AnyGeometryJson,
    Options extends ISelectableClusterJsonOptions<ymaps.IOptionManagerData>,
    Properties extends ymaps.IDataManagerData,
    ChildFeathureJson extends ISelectableFeathureJson<any, any, any>
> = ymaps.geometry.json.IClusterJson<GeometryJson, Options, Properties, ChildFeathureJson>