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

    protected readonly _languageLocale: "ru" | "en"

    protected readonly _placemarksDecorator: Promise<SelectablePlacemarksDecorator>

    protected readonly _clustersDecorator: Promise<SelectableClustersDecorator>

    protected readonly _focusListeners: Set<(feathure: SelectablePlacemarkJson) => Promise<boolean>> = new Set()

    constructor(urlTemplate: string, languageLocale: "ru" | "en") {
        this._languageLocale = languageLocale
        this._loadingManager = ymaps.ready().then(() => new ymaps.LoadingObjectManager(urlTemplate, this.clustererOptionsAsset))

        this._placemarksDecorator = this.decoratePlacemarks()
        this._clustersDecorator = this.decorateClusters()

        Promise.all([this._placemarksDecorator, this._clustersDecorator])
            .then(([placemarksDecorator, clustersDecorator]) => this.syncObjectCollections(placemarksDecorator, clustersDecorator))
    }

    addFocusFistener(f: (feathure: SelectablePlacemarkJson) => Promise<boolean>): void {
        this._focusListeners.add(f)
    }
    
    public deleteFocusFistener(f: (feathure: SelectablePlacemarkJson) => Promise<boolean>): void {
        this._focusListeners.delete(f)
    }

    public async defocus() {
        const [placemarksDecorator, clustersDecorator] = await Promise.all([this._placemarksDecorator, this._clustersDecorator])
        placemarksDecorator.defocus()
        clustersDecorator.defocus()
    }

    protected async callFocusListeners(feathure: SelectablePlacemarkJson) {
        const results = await Promise.all([...this._focusListeners].map(f => f(feathure)))
        return results.every(result => result)
    }

    protected async decoratePlacemarks() {
        const loadingManager = await this._loadingManager
        return new SelectablePlacemarksDecorator(loadingManager.objects)
    }

    protected async decorateClusters() {
        const loadingManager = await this._loadingManager
        return new SelectableClustersDecorator(loadingManager.clusters)
    }

    /** @todo объекты могут быть открыты как напрямую, так и через кластер. Это событие сейчас не реализовано, вместо него это поведение частично реализуестся событием focus */
    protected syncObjectCollections(placemarksDecorator: SelectablePlacemarksDecorator, clustersDecorator: SelectableClustersDecorator) {
        placemarksDecorator.addFocusFistener(async (placemark) => {
            clustersDecorator.defocus()
            this.callFocusListeners(placemark)

            return true
        })

        clustersDecorator.addFocusFistener(async (cluster) => {
            placemarksDecorator.defocus()
            this.callFocusListeners(cluster.properties.geoObjects[0])

            // select всех проектов в кластере
            cluster.properties.geoObjects.map(placemark => placemarksDecorator.selectObject(placemark))
            return true
        })
    }
}