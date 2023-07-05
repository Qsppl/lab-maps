"use strict"

import { ProjectFeathure } from "../../../Browser/LoadingObjectsManager/dto/project.js"
import { PlacemarkCollectionDecorator as SelectablePlacemarkCollectionDecorator, ObjectOptionsAssetKey, ObjectOptionsModifierKey } from "../SelectablePlacemarksManagerDecorator/PlacemarkCollectionDecorator.js"
import { resolveProjectIconUri } from "./resolveProjectIconUri.js"

export class PlacemarkCollectionDecorator extends SelectablePlacemarkCollectionDecorator {
    protected async createAsset(targetObject: ProjectFeathure, assetKey: ObjectOptionsAssetKey, modifier: ObjectOptionsModifierKey = "normal") {
        const asset = await super.createAsset(targetObject, assetKey, modifier)

        const isSelected = assetKey === "select"
        const isVisited = !!targetObject.options.isVisited
        const stage: number = targetObject.t
        const isForeign = targetObject.o && (targetObject.o == 89)
        const isFolderItem = !!targetObject.options.isFolderItem
        asset.iconImageHref = resolveProjectIconUri(stage, isForeign, isSelected, isVisited, isFolderItem)

        return asset
    }
}