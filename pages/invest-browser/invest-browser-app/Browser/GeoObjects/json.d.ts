declare namespace GeoObjects.json {
    // this type is placed in a separate declaration so that it can be imported in other files
    type IFeatureJsonOptions = ymaps.IOptionManagerData & {
        isVisited?: boolean | undefined
        isSelected?: boolean | undefined
    }
    
    type IFeatureJson<
        GeometryJson extends ymaps.geometry.json.YmapsGeometryJsonIndex | ymaps.geometry.json.IGeometryJson,
        Options extends IFeatureJsonOptions,
        Properties extends ymaps.IDataManagerData
    > = ymaps.geometry.json.IFeatureJson<GeometryJson, IFeatureJsonOptions & Options, Properties>
}