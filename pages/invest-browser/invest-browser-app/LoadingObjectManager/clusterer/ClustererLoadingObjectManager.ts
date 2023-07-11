"use strict"

import { IObjectManager } from "../../Browser/interfaces/IObjectManager.js"
import { IUserFocusEmmiter } from "../../UserInterface/interfaces/IUserFocusEmmiter.js"
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


export class ClustererLoadingObjectManager implements IObjectManager, IUserFocusEmmiter {
    protected readonly clustererOptionsAsset: ProjectsLoadingObjectManagerOptions = {
        clusterize: true,
        gridSize: 36,
        clusterDisableClickZoom: true
    }

    public readonly _loadingManager: Promise<LoadingObjectManager>

    protected readonly _placemarksDecorator: Promise<SelectablePlacemarksDecorator>

    protected readonly _clustersDecorator: Promise<SelectableClustersDecorator>

    constructor(urlTemplate: string) {
        this._loadingManager = ymaps.ready().then(() => new ymaps.LoadingObjectManager(urlTemplate, this.clustererOptionsAsset))

        this._placemarksDecorator = this.decoratePlacemarks()
        this._clustersDecorator = this.decorateClusters()

        Promise.all([this._placemarksDecorator, this._clustersDecorator])
            .then(([placemarksDecorator, clustersDecorator]) => this.syncObjectCollections(placemarksDecorator, clustersDecorator))
    }

    public onFocus: () => {}

    public async defocus() {
        const [placemarksDecorator, clustersDecorator] = await Promise.all([this._placemarksDecorator, this._clustersDecorator])
        placemarksDecorator.unselectAll()
        clustersDecorator.unselectAll()
    }

    protected async decoratePlacemarks() {
        const loadingManager = await this._loadingManager
        return new SelectablePlacemarksDecorator(loadingManager.objects)
    }

    protected async decorateClusters() {
        const loadingManager = await this._loadingManager
        return new SelectableClustersDecorator(loadingManager.clusters)
    }

    protected syncObjectCollections(placemarksDecorator: SelectablePlacemarksDecorator, clustersDecorator: SelectableClustersDecorator) {
        placemarksDecorator.selectSingleObjectHook = (placemark) => {
            clustersDecorator.unselectAll()
            this.onFocus()

            return true
        }

        clustersDecorator.selectSingleObjectHook = (cluster) => {
            placemarksDecorator.unselectAll()
            this.onFocus()

            // select всех проектов в кластере
            cluster.properties.geoObjects.map(placemark => placemarksDecorator.selectObject(placemark))
            return true
        }
    }
}