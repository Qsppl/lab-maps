"use strict"

import { ProjectFeathure } from "../../../Browser/LoadingObjectsManager/dto/project.js"
import { ObjectOptionsAssetKey, ObjectOptionsModifierKey } from "../selectable/BaseSelectableCollection.js"
import { SelectableObjectsDecorator } from "../selectable/SelectableObjectsDecorator.js"
import { resolveProjectIconUri } from "./resolveProjectIconUri.js"

export class ProjectObjectsDecorator extends SelectableObjectsDecorator {
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