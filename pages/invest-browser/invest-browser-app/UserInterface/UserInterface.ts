"use strict"

import { GroupsLoadingObjectManager } from "../Browser/LoadingObjectsManager/dto/group.js"
import { ProjectsLoadingObjectManager } from "../Browser/LoadingObjectsManager/dto/project.js"
import { IUserInterface, ZoomRestrictionPresetKeys } from "../Browser/interfaces/IUserInterface.js"
import { GroupClustersDecorator } from "./LoadingObjectsManagerDecorators/groups/GroupClustersDecorator.js"
import { GroupObjectsDecorator } from "./LoadingObjectsManagerDecorators/groups/GroupObjectsDecorator.js"
import { ProjectObjectsDecorator } from "./LoadingObjectsManagerDecorators/projects/ProjectObjectsDecorator.js"
import { BaseSelectableCollection } from "./LoadingObjectsManagerDecorators/selectable/BaseSelectableCollection.js"
import { SelectableClustersDecorator } from "./LoadingObjectsManagerDecorators/selectable/SelectableClustersDecorator.js"
import { ModalRestrictionNotice } from "./ModalRestrictionNotice.js"
import { IMap } from "./interfaces/IMap.js"
import { IPlace } from "./interfaces/IPlace.js"

type ZoomRestrictionPresetData = { baseZoom?: number, zoomInLimit: number, zoomInMessageKey: string, zoomOutLimit: number, zoomOutMessageKey: string }

/** Класс реализующий работу пользовательского интерфейса управления браузером проектов Investproject */
export class UserInterface implements IUserInterface {
    private readonly restrictionPresets = new Map<ZoomRestrictionPresetKeys, ZoomRestrictionPresetData>([
        ["for-guest", { baseZoom: 7, zoomInLimit: 10, zoomInMessageKey: "zoom-restriction-guest", zoomOutLimit: 4, zoomOutMessageKey: "zoom-out-limit" }],
        ["for-registrant", { baseZoom: 7, zoomInLimit: 10, zoomInMessageKey: "zoom-in-restriction-registrant", zoomOutLimit: 4, zoomOutMessageKey: "zoom-out-limit" }],
    ])

    private readonly localizationAssets = {
        ru: {
            'zoom-in-limit': 'Это максимальное приближение карты',
            'zoom-out-limit': 'Это максимальное отдаление карты',
            'zoom-restriction-guest': 'Масштабирование ограничено для незарегистрированных пользователей',
            'zoom-in-restriction-registrant': 'Для большего увеличения карты оформите подписку или получите демо-доступ',
        },
        en: {
            'zoom-in-limit': 'This is the maximum zoom of the map',
            'zoom-out-limit': 'This is the maximum distance of the map',
            'zoom-restriction-guest': 'Zoom is limited to unregistered users',
            'zoom-in-restriction-registrant': 'For a larger map, subscribe or get demo access',
        }
    }

    private readonly _map: IMap

    private readonly _place: IPlace

    private readonly _localizationAsset

    /** Модальное окно уведомляющее пользователя о том что у него есть какое-либо ограничение использования приложения */
    private readonly _modalRestrictionNotice: Promise<ModalRestrictionNotice>

    private _zoomInMessage: string

    private _zoomOutMessage: string

    private readonly SelectableCollectionsOfMap: Set<BaseSelectableCollection<any, any, any, any>> = new Set()

    constructor(map: IMap, place: IPlace, languageLocale: "ru" | "en") {
        this._map = map
        this._place = place
        this._localizationAsset = this.localizationAssets[languageLocale]

        this._modalRestrictionNotice = app.querySelectorPromise('#no-access').then((element: HTMLElement | null) => {
            if (!element) throw new Error('Could not find element by id="no-access"')
            return new ModalRestrictionNotice(element)
        })

        // Ymaps по умолчанию имеет ограничение на зум.
        // Будем выводить сообщения при попытке выкрутить масштабирование за границы ограничения.
        this.setMapZoomBoundsingNotions(this._localizationAsset["zoom-in-limit"], this._localizationAsset["zoom-out-limit"])
        this._map.onZoomInBoundsing = (() => { this.showWarningNotice(this._zoomInMessage, "map-zoom-boundsing-notions") }).bind(this)
        this._map.onZoomOutBoundsing = (() => { this.showWarningNotice(this._zoomOutMessage, "map-zoom-boundsing-notions") }).bind(this)
    }

    public async addProjectsManager(loadingManager: ProjectsLoadingObjectManager) {
        const placemarksDecorator = new ProjectObjectsDecorator(loadingManager.objects)
        this.SelectableCollectionsOfMap.add(placemarksDecorator)
        const clustersDecorator = new SelectableClustersDecorator(loadingManager.clusters)
        this.SelectableCollectionsOfMap.add(clustersDecorator)

        placemarksDecorator.selectSingleObjectHook = (placemark) => {
            const emmiter = placemarksDecorator
            for (const collection of this.SelectableCollectionsOfMap) if (collection !== emmiter) collection.unselectAll()
            return true
        }

        clustersDecorator.selectSingleObjectHook = (cluster) => {
            const emmiter = clustersDecorator
            for (const collection of this.SelectableCollectionsOfMap) if (collection !== emmiter) collection.unselectAll()

            // select всех проектов в кластере
            cluster.properties.geoObjects.map(placemark => placemarksDecorator.selectObject(placemark))

            return true
        }
    }

    public async addGroupsManager(loadingManager: GroupsLoadingObjectManager): Promise<void> {
        const placemarksDecorator = new GroupObjectsDecorator(loadingManager.objects)
        this.SelectableCollectionsOfMap.add(placemarksDecorator)
        const clustersDecorator = new GroupClustersDecorator(loadingManager.clusters)
        this.SelectableCollectionsOfMap.add(clustersDecorator)

        placemarksDecorator.selectSingleObjectHook = (placemark) => {
            const emmiter = placemarksDecorator
            for (const collection of this.SelectableCollectionsOfMap) if (collection !== emmiter) collection.unselectAll()
            return true
        }

        clustersDecorator.selectSingleObjectHook = (cluster) => {
            const emmiter = clustersDecorator
            for (const collection of this.SelectableCollectionsOfMap) if (collection !== emmiter) collection.unselectAll()

            // select всех проектов в кластере
            cluster.properties.geoObjects.map(placemark => placemarksDecorator.selectObject(placemark))

            return true
        }
    }

    public setZoomRestriction(presetKey: ZoomRestrictionPresetKeys): void {
        // extracting information from a preset
        const { baseZoom, zoomOutLimit, zoomInLimit, zoomInMessageKey, zoomOutMessageKey } = this.restrictionPresets.get(presetKey)
        const [zoomInMessage, zoomOutMessage] = [this._localizationAsset[zoomInMessageKey], this._localizationAsset[zoomOutMessageKey]]

        // apply
        if (baseZoom) this._map.setZoom(baseZoom)
        this._map.setZoomRange(zoomOutLimit, zoomInLimit)
        this.setMapZoomBoundsingNotions(zoomInMessage, zoomOutMessage)
    }

    private setMapZoomBoundsingNotions(zoomInMessage: string, zoomOutMessage: string) {
        this._zoomInMessage = zoomInMessage
        this._zoomOutMessage = zoomOutMessage
    }

    private showWarningNotice(message: string, debounceGroup: string) {
        this.showToast({ heading: message, text: "", icon: 'info', position: 'bottom-right' })
    }

    private showToast({ heading, icon, text = '', position = 'bottom-right' }: toastOptions) {
        $.toast({
            heading,
            text,
            showHideTransition: 'fade',
            icon,
            position,
            hideAfter: 3000,
            allowToastClose: false,
            loader: false,
            class: 'toast_larger-font toast_map_alert',
            stack: false
        })
    }
}