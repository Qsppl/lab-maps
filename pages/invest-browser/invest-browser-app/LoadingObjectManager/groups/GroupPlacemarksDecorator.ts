"use strict"

import { ObjectOptionsAssetKey, ObjectOptionsModifierKey } from "../clusterer/SelectableCollectionDecorator.js"
import { PlacemarkCollectionOptions, SelectablePlacemarksDecorator } from "../clusterer/SelectablePlacemarksDecorator.js"
import { GroupFeathure, GroupFeathureProperties } from "./LoadingGroupsManager.js"

export class GroupPlacemarksDecorator extends SelectablePlacemarksDecorator {
    protected readonly _focusListeners: Set<(placemark: GroupFeathure) => Promise<boolean>> = new Set()


    public addFocusFistener(f: (placemark: GroupFeathure) => Promise<boolean>): void {
        return super.addFocusFistener(f)
    }

    public deleteFocusFistener(f: (placemark: GroupFeathure) => Promise<boolean>): void {
        return super.deleteFocusFistener(f)
    }

    protected async callFocusListeners(placemark: GroupFeathure) {
        return super.callFocusListeners(placemark)
    }

    public setBalloonData(targetObject: GroupFeathure, { clusterCaption, balloonContent, balloonContentHeader }: GroupFeathureProperties) {
        this.updateObjectProperties(targetObject, { clusterCaption, balloonContent, balloonContentHeader })
        const properties = targetObject.properties
        if (properties.clusterCaption && properties.balloonContentHeader && properties.balloonContent) {
            this.updateObjectProperties(targetObject, { hasBalloonData: true })
        }
    }

    public updateObjectProperties(targetObject: GroupFeathure, properties: GroupFeathureProperties) {
        targetObject.properties = { ...targetObject.properties, ...properties }
    }

    protected async selectSingleObject(targetObject: GroupFeathure): Promise<void> {
        // если хук родителя на это действие вернет false, то прерываем действие
        if (await this.callFocusListeners(targetObject) === false) return

        // Родитель мог что-нибудь поменять в данных, поэтому открываем балун даже если он уже был открыт.
        if (targetObject.properties.hasBalloonData) {
            this._collection.balloon.open(targetObject.id)
        }

        // переводим все объекты кроме целевого в любое состояние кроме select
        for (const feathure of this.getSelectedObjects()) {
            if (feathure === targetObject) continue
            this.resetUnselectedObjectOptionsAsset(feathure)
        }

        // Применить селект если нужно
        if (!!targetObject.options.isSelected) return
        this.setObjectOptionsAsset(targetObject, "select")
    }

    protected async getDefaultAsset(): Promise<PlacemarkCollectionOptions> {
        return {
            iconImageSize: [24, 24],
            iconImageOffset: [-12, -12],
            iconImageHref: "resources/few_group_of_projects_normal.svg",
            iconLayout: 'default#image'
        }
    }

    protected async createAsset(targetObject: GroupFeathure, assetKey: ObjectOptionsAssetKey, modifier: ObjectOptionsModifierKey = "normal"): Promise<PlacemarkCollectionOptions> {
        const asset: PlacemarkCollectionOptions = await this.getDefaultAsset()

        if (assetKey === "default") {
            // nothing
        } else if (assetKey === "select") {
            asset.iconImageHref = "resources/few_group_of_projects_active.svg"
        } else if (assetKey === "visited") {
            asset.iconImageHref = "resources/few_group_of_projects_visited.svg"
        } else throw new TypeError("")


        if (modifier === "normal") {
            // nothing
        } else if (modifier === "hover") {
            asset.iconImageSize = [32, 32]
            asset.iconImageOffset = [-16, -16]
        }

        return asset
    }
}