"use strict"

import { objectManager } from "yandex-maps"
import { IFolderItemsManager } from "../../Browser/interfaces/IFolderItemsManager.js"
import { ClustererLoadingObjectManager, SelectableClusterJson, SelectableClusterJsonOptions, SelectableObjectJsonOptions, SelectablePlacemarkJson } from "../clusterer/ClustererLoadingObjectManager.js"
import { ClusterCollection, SelectableClustersDecorator } from "../clusterer/SelectableClustersDecorator.js"
import { ProjectPlacemarksDecorator } from "./ProjectPlacemarksDecorator.js"
import { ProjectClustersDecorator } from "./ProjectClustersDecorator.js"

const ymaps = globalThis.ymaps

type ProjectObjectJsonOptions = { isFolderItem?: boolean | undefined }

type ProjectFeathureProperties = {
    /** какая-то фигня (равно Id проекта) */
    clusterCaption: string
}

export type ProjectFeathure = SelectablePlacemarkJson<ProjectObjectJsonOptions & SelectableObjectJsonOptions, ProjectFeathureProperties> & {
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

export type ProjectsClusterJson = SelectableClusterJson<ProjectFeathure>

type LoadingObjectManager = ymaps.LoadingObjectManager<
    // Все объекты карты в итоге отображаются как GeoObject'ы, при генерации учитываются соответствующие опции (Placemark Polyline Polygon Circle Rectangle)
    SelectableObjectJsonOptions & ProjectObjectJsonOptions,
    // LoadingObjectManager загружает по ссылке данные об объектах карты которые после генерирует на карте. Это тип загружаемых объедков
    ProjectFeathure,
    // алиасы в опциях на опции своего Editor'а (geometryEditor.LineString, geometryEditor.Polygon, geometryEditor.Point)
    ymaps.geometryEditor.PointOptions,
    // если Feathure.geometry.type === "Point", то это PlacemarkOptioms; Дальше по аналогии
    ymaps.PlacemarkOptions,
    SelectableClusterJsonOptions,
    SelectableClusterJson<ProjectFeathure>
>

export type ProjectClustersCollection = ClusterCollection<ProjectsClusterJson>

export class LoadingProjectsManager extends ClustererLoadingObjectManager implements IFolderItemsManager {
    protected _checkIsFolderItemHook

    public readonly hasFolderItems: true

    public readonly _loadingManager: Promise<LoadingObjectManager>

    protected _allObjects?: Promise<ProjectFeathure | null>

    public onLoadProject: (feathure: ProjectFeathure) => void = () => { }

    constructor(urlTemplate: string, languageLocale: "ru" | "en") {
        super(urlTemplate, languageLocale)
        this._loadingManager.then(loadingManager => loadingManager.objects.events.add("add", (event: ymaps.IEvent<MouseEvent>) => {
            const targetObject = event.get("child")
            targetObject && this.onLoadProject(targetObject)
        }))
    }

    public getAllObjects() {
        if (this._allObjects) return this._allObjects

        return this._allObjects = new Promise<ProjectFeathure | null>((resolve) => {
            $.ajax({
                url: '/ajax/ymaps/load-all-projects',
                type: "GET",
                success: (response) => {
                    const feathures = JSON.parse(response).data.features
                    resolve(feathures)
                },
                error: (error) => {
                    console.warn(error)

                    resolve(null)
                }
            })
        })
    }

    public set checkIsFolderItemHook(f: (feathure: ymaps.geometry.json.IFeatureJson<any, any, any>) => boolean) {
        this._checkIsFolderItemHook = f
        this.actualizeFeathures()
    }

    public get checkIsFolderItemHook() {
        return this._checkIsFolderItemHook
    }

    protected objectIsFolderItem(feathure: ymaps.geometry.json.IFeatureJson<any, any, any>) {
        if (this._checkIsFolderItemHook) return this._checkIsFolderItemHook(feathure)
        return false
    }

    private async actualizeFeathures() {
        const loadingManager = await this._loadingManager

        loadingManager.objects.getAll().map(feathure => {
            loadingManager.objects.setObjectOptions(feathure.id, { isFolderItem: this.objectIsFolderItem(feathure) })
        })
    }

    protected async decoratePlacemarks() {
        const loadingManager = await this._loadingManager
        return new ProjectPlacemarksDecorator(loadingManager.objects)
    }

    protected async decorateClusters() {
        const loadingManager = await this._loadingManager
        return new ProjectClustersDecorator(loadingManager.clusters)
    }
}