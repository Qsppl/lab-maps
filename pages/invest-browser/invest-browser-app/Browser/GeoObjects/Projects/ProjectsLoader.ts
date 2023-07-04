"use strict"

const ymaps = globalThis.ymaps

type F = GeoObjects.Projects.json.IFeatureJson
type C = GeoObjects.Projects.json.IFeatureJsonOptions
type I = ymaps.geometryEditor.PointOptions

export default class ProjectsLoader {
    protected readonly _loadingManager: Promise<ymaps.LoadingObjectManager<F, C, I>>

    constructor(urlTemplate: string) {
        this._loadingManager = this.createLoaderManager(urlTemplate)
    }

    private async createLoaderManager(urlTemplate: string): Promise<ymaps.LoadingObjectManager<F, C, I>> {
        await ymaps.ready()
        return new ymaps.LoadingObjectManager<F, C, I>(
            urlTemplate,
            { clusterize: true, gridSize: 36 }
        )
    }

    get loadingManager() {
        return this._loadingManager
    }
}