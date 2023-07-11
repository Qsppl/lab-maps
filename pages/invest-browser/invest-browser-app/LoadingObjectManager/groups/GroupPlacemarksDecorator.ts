"use strict"

import { SelectablePlacemarkJson } from "../clusterer/ClustererLoadingObjectManager.js"
import { ObjectOptionsAssetKey, ObjectOptionsModifierKey } from "../clusterer/SelectableCollectionDecorator.js"
import { PlacemarkCollectionOptions, SelectablePlacemarksDecorator } from "../clusterer/SelectablePlacemarksDecorator.js"

export class GroupPlacemarksDecorator extends SelectablePlacemarksDecorator {
    protected async getDefaultAsset(): Promise<PlacemarkCollectionOptions> {
        return {
            iconImageSize: [24, 24],
            iconImageOffset: [-12, -12],
            iconImageHref: "resources/few_group_of_projects_normal.svg",
            iconLayout: 'default#image'
        }
    }

    protected async createAsset(targetObject: SelectablePlacemarkJson, assetKey: ObjectOptionsAssetKey, modifier: ObjectOptionsModifierKey = "normal"): Promise<PlacemarkCollectionOptions> {
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