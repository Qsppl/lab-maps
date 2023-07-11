"use strict"

import { SelectableClustersDecorator } from "./SelectableClustersDecorator.js"
import { SelectablePlacemarksDecorator } from "./SelectablePlacemarksDecorator.js"

const ymaps = globalThis.ymaps


// ##################################################################
// GeoJsonObjecs

export type SelectableObjectJsonOptions = {
    isVisited?: boolean | undefined
    isSelected?: boolean | undefined
}

export type SelectablePlacemarkJson<
    Options extends ymaps.IOptionManagerData & SelectableObjectJsonOptions = SelectableObjectJsonOptions,
    Properties extends ymaps.IDataManagerData = {}
> = ymaps.geometry.json.IFeatureJson<ymaps.geometry.json.Point, Options, Properties>

export type SelectableClusterJsonOptions = SelectableObjectJsonOptions & ymaps.ClusterPlacemarkOptions

export type SelectableClusterJson<
    ChildFeathureJson extends SelectablePlacemarkJson = SelectablePlacemarkJson,
    Options extends ymaps.IOptionManagerData & SelectableClusterJsonOptions = SelectableClusterJsonOptions,
    Properties extends ymaps.IDataManagerData = {},
> = ymaps.geometry.json.IClusterJson<ymaps.geometry.json.Point, Options, Properties, ChildFeathureJson>


// ################################################################
// Yandex-Maps classes

export type ProjectsLoadingObjectManagerOptions = ymaps.LoadingObjectManagerOptions<SelectableObjectJsonOptions, ymaps.geometryEditor.PointOptions>

export type LoadingObjectManager = ymaps.LoadingObjectManager<
    // Все объекты карты в итоге отображаются как GeoObject'ы, при генерации учитываются соответствующие опции (Placemark Polyline Polygon Circle Rectangle)
    SelectableObjectJsonOptions,
    // LoadingObjectManager загружает по ссылке данные об объектах карты которые после генерирует на карте. Это тип загружаемых объедков
    SelectablePlacemarkJson,
    // алиасы в опциях на опции своего Editor'а (geometryEditor.LineString, geometryEditor.Polygon, geometryEditor.Point)
    ymaps.geometryEditor.PointOptions,
    // если Feathure.geometry.type === "Point", то это PlacemarkOptioms; Дальше по аналогии
    ymaps.PlacemarkOptions,
    SelectableClusterJsonOptions,
    SelectableClusterJson
>


export class ClustererLoadingObjectManager {
    // ##################################
    // base functionality

    protected readonly _loadingManager: Promise<LoadingObjectManager>

    constructor(urlTemplate: string) {
        // ##################################
        // base functionality

        this._loadingManager = this.createLoadingManager(urlTemplate)


        // ##################################
        // decorate functionality

        this.decorate()
    }

    protected async createLoadingManager(urlTemplate: string): Promise<LoadingObjectManager> {
        await ymaps.ready()


        // ##################################
        // decorate functionality

        return new ymaps.LoadingObjectManager(urlTemplate, this.clustererOptionsAsset)
    }


    // ##################################
    // decorate functionality

    protected readonly clustererOptionsAsset: ProjectsLoadingObjectManagerOptions = {
        clusterize: true,
        gridSize: 36,
        clusterDisableClickZoom: true
    }

    protected async decorate() {
        const loadingManager = await this._loadingManager
        const placemarksDecorator = new SelectablePlacemarksDecorator(loadingManager.objects)
        const clustersDecorator = new SelectableClustersDecorator(loadingManager.clusters)
        this.syncObjectCollections(placemarksDecorator, clustersDecorator)
    }

    protected syncObjectCollections(placemarksDecorator: SelectablePlacemarksDecorator, clustersDecorator: SelectableClustersDecorator) {
        placemarksDecorator.selectSingleObjectHook = (placemark) => {
            clustersDecorator.unselectAll()
            return true
        }

        clustersDecorator.selectSingleObjectHook = (cluster) => {
            placemarksDecorator.unselectAll()

            // select всех проектов в кластере
            cluster.properties.geoObjects.map(placemark => placemarksDecorator.selectObject(placemark))
            return true
        }
    }
}