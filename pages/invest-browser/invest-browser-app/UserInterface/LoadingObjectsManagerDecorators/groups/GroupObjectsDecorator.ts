"use strict"

import { GroupFeathure, GroupFeathureOptions } from "../../../Browser/LoadingObjectsManager/dto/group.js"
import { ObjectOptionsAssetKey, ObjectOptionsModifierKey } from "../selectable/BaseSelectableCollection.js"
import { SelectableObjectsDecorator } from "../selectable/SelectableObjectsDecorator.js"

type ObjectCollectionOptions = ymaps.objectManager.ObjectCollectionOptions<GroupFeathureOptions, ymaps.PlacemarkOptions> & {
    __proto__?: ObjectCollectionOptions | undefined
}

export class GroupObjectsDecorator extends SelectableObjectsDecorator {
    protected async getDefaultAsset(): Promise<ObjectCollectionOptions> {
        return {
            iconImageSize: [24, 24],
            iconImageOffset: [-12, -12],
            iconImageHref: "resources/few_group_of_projects_normal.svg",
            iconLayout: 'default#image'
        }
    }
    
    protected async createAsset(targetObject: GroupFeathure, assetKey: ObjectOptionsAssetKey, modifier: ObjectOptionsModifierKey = "normal"): Promise<ObjectCollectionOptions> {
        const asset: ObjectCollectionOptions = await this.getDefaultAsset()

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