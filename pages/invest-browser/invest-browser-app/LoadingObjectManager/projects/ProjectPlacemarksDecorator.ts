"use strict"

import { SelectablePlacemarkJson } from "../clusterer/ClustererLoadingObjectManager.js"
import { ObjectOptionsAssetKey, ObjectOptionsModifierKey } from "../clusterer/SelectableCollectionDecorator.js"
import { PlacemarkCollectionOptions, SelectablePlacemarksDecorator } from "../clusterer/SelectablePlacemarksDecorator.js"
import { ProjectFeathure } from "./LoadingProjectsManager.js"
import { resolveProjectIconUri } from "./resolveProjectIconUri.js"

export class ProjectPlacemarksDecorator extends SelectablePlacemarksDecorator {
    protected async createAsset(targetObject: SelectablePlacemarkJson & ProjectFeathure, assetKey: ObjectOptionsAssetKey, modifier: ObjectOptionsModifierKey = "normal"): Promise<PlacemarkCollectionOptions> {
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