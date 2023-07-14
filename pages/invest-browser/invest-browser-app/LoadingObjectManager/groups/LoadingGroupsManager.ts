"use strict"

import { ClustererLoadingObjectManager, SelectableClusterJson, SelectableClusterJsonOptions, SelectableObjectJsonOptions, SelectablePlacemarkJson } from "../clusterer/ClustererLoadingObjectManager.js"
import { GroupClustersDecorator } from "./GroupClustersDecorator.js"
import { GroupPlacemarksDecorator } from "./GroupPlacemarksDecorator.js"

const ymaps = globalThis.ymaps

type GroupFeathureOptions = {}

export type GroupFeathureProperties = {
    /** Имеет все нужные данные для отображения в балуне */
    hasBalloonData?: boolean
    /** какая-то фигня (равно Id проекта) */
    clusterCaption?: string
    balloonContent?: string,
    balloonContentHeader?: string,
}

export type GroupFeathure = SelectablePlacemarkJson<SelectableObjectJsonOptions & GroupFeathureOptions, GroupFeathureProperties> & {
    /** Id отрасли */
    s: number
    /** Id региона */
    o: number | null
    /** Код страны */
    z: number
}

export type GroupsClusterJson = SelectableClusterJson<GroupFeathure>

type LoadingObjectManager = ymaps.LoadingObjectManager<
    // Все объекты карты в итоге отображаются как GeoObject'ы, при генерации учитываются соответствующие опции (Placemark Polyline Polygon Circle Rectangle)
    SelectableObjectJsonOptions & GroupFeathureOptions,
    // LoadingObjectManager загружает по ссылке данные об объектах карты которые после генерирует на карте. Это тип загружаемых объедков
    GroupFeathure,
    // алиасы в опциях на опции своего Editor'а (geometryEditor.LineString, geometryEditor.Polygon, geometryEditor.Point)
    ymaps.geometryEditor.PointOptions,
    // если Feathure.geometry.type === "Point", то это PlacemarkOptioms; Дальше по аналогии
    ymaps.PlacemarkOptions,
    SelectableClusterJsonOptions,
    SelectableClusterJson<GroupFeathure>
>

export class LoadingGroupsManager extends ClustererLoadingObjectManager {
    public readonly _loadingManager: Promise<LoadingObjectManager>

    protected readonly _placemarksDecorator: Promise<GroupPlacemarksDecorator>

    protected readonly _clustersDecorator: Promise<GroupClustersDecorator>

    constructor(urlTemplate: string, languageLocale: "ru" | "en") {
        super(urlTemplate, languageLocale)

        this.attachGroupsDataLoader()
    }

    protected async attachGroupsDataLoader() {
        const placemarksDecorator = await this._placemarksDecorator
        placemarksDecorator.addFocusFistener(async (feathure) => {
            if (!feathure.properties.hasBalloonData) await this.updateFeathureBalloon(feathure)
            return true
        })

        const clustersDecorator = await this._clustersDecorator
        clustersDecorator.addFocusFistener(async (cluster) => {
            const unfilledItems = cluster.properties.geoObjects
                .filter(feathure => !feathure.properties.hasBalloonData)
            if (unfilledItems.length) await Promise.all(unfilledItems.map((f) => this.updateFeathureBalloon(f)));
            return true
        })
    }

    protected async updateFeathureBalloon(feathure: GroupFeathure) {
        const placemarksDecorator = await this._placemarksDecorator
        const rawHtmlButton = `<a class="btn btn-primary" href="/project-groups/${feathure.id}" target="_blank">Открыть</a>`
        const balloonData = {
            caption: String(feathure.id),
            sectorName: "Отрасль не определена",
            description: `Описание группы отсутствует`,
            header: `(id: ${feathure.id}) Название отсутствует`
        }

        try {
            const groupData = await this.loadGroupData(feathure)
            
            const groupName = this._languageLocale === "ru"
                ? groupData.name || groupData.name_en
                : groupData.name_en || groupData.name
    
            if (groupName) balloonData.caption = groupName
            if (groupName) balloonData.header = groupName

            const sectorName = this._languageLocale === "ru"
                ? groupData.sector_name || groupData.sector_name_en
                : groupData.sector_name_en || groupData.sector_name

            if (sectorName) balloonData.sectorName = sectorName

            if (groupData.description) balloonData.description = groupData.description
        } catch (error) {
            console.warn(error);
        }

        placemarksDecorator.setBalloonData(feathure, {
            clusterCaption: balloonData.caption,
            balloonContentHeader: balloonData.header,
            balloonContent: [`<b>Сектор:</b> ${balloonData.sectorName}`, balloonData.description, rawHtmlButton].join("<br><br>")
        })
    }

    protected async loadGroupData(feathure: GroupFeathure): Promise<{ name: string, name_en: string, description: string } | JQuery.jqXHR<any>> {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'POST',
                url: `/ajax/ymaps/group?id=${feathure.id}`,
                success(response) { resolve(JSON.parse(response).data) },
                error(error, errorName, ) { reject(error) }
            })
        })
    }

    protected async decoratePlacemarks() {
        const loadingManager = await this._loadingManager
        return new GroupPlacemarksDecorator(loadingManager.objects)
    }

    protected async decorateClusters() {
        const loadingManager = await this._loadingManager
        return new GroupClustersDecorator(loadingManager.clusters)
    }
}