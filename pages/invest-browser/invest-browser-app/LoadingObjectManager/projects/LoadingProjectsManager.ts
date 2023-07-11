"use strict"

import { IFolderItemsManager } from "../../Browser/interfaces/IFolderItemsManager.js"
import { ClustererLoadingObjectManager, SelectableClusterJson, SelectableClusterJsonOptions, SelectableObjectJsonOptions, SelectablePlacemarkJson } from "../clusterer/ClustererLoadingObjectManager.js"
import { SelectableClustersDecorator } from "../clusterer/SelectableClustersDecorator.js"
import { ProjectPlacemarksDecorator } from "./ProjectPlacemarksDecorator.js"

const ymaps = globalThis.ymaps

type ProjectObjectJsonOptions = { isFolderItem?: boolean | undefined }

type ProjectFeathureProperties = {
    /** какая-то фигня (равно Id проекта) */
    clusterCaption: number
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

export class LoadingProjectsManager extends ClustererLoadingObjectManager implements IFolderItemsManager {
    public readonly hasFolderItems: true

    public readonly _loadingManager: Promise<LoadingObjectManager>

    protected _checkIsFolderItemHook

    public set checkIsFolderItemHook(f: (feathure: ymaps.geometry.json.IFeatureJson<any, any, any>) => boolean) {
        this._checkIsFolderItemHook = f
        this.actualizeFeathures()
    }

    public get checkIsFolderItemHook() {
        return this._checkIsFolderItemHook
    }

    constructor(urlTemplate: string = "/pages/invest-browser/ambiance/jsonp-projects.js") {
        super(urlTemplate)
        this._loadingManager.then(loadingManager => loadingManager.objects.events.add("add", (event: ymaps.IEvent<MouseEvent>) => {
            const targetObject = event.get("child")
            targetObject && this.onLoadProject(targetObject)
        }))
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

    public onLoadProject: (feathure: ProjectFeathure) => void = () => { }
}