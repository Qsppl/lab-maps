"use strict"

import { ProjectFeathure, ProjectFeathureOptions } from "../../../Browser/LoadingObjectsManager/dto/project.js"
import { PlacemarkCollectionDecorator as SelectableCollection, OptionsAssetKey } from "../SelectablePlacemarksManagerDecorator/PlacemarkCollectionDecorator.js"
import { resolveProjectIconUri } from "./resolveProjectIconUri.js"

type FeathureOptions = ProjectFeathureOptions
type Feathure = ProjectFeathure

type ObjectCollection = ymaps.objectManager.ObjectCollection<Feathure, FeathureOptions, ymaps.PlacemarkOptions>
type ObjectCollectionOptions = ymaps.objectManager.ObjectCollectionOptions<FeathureOptions, ymaps.PlacemarkOptions>

export class PlacemarkCollectionDecorator extends SelectableCollection {
    constructor(collection: ObjectCollection) {
        super(collection)

        collection.events.add(['add'], (event: ymaps.IEvent<MouseEvent>) => {
            const targetObject: Feathure = event.get("child")
            this.setPlacemarkDesign(targetObject, "default")
        })
    }

    protected getAssetForPlacemark(targetObject: Feathure, assetKey: OptionsAssetKey): ObjectCollectionOptions {
        const isVisited = !!targetObject.options.isVisited
        const stage: number = targetObject.t
        const isForeign = targetObject.o && (targetObject.o == 89)
        const isFolderItem = !!targetObject.options.isFolderItem

        // Посещенная метка не может принять внешний вид "default", вместо этого принимает "visited"
        if (isVisited && assetKey === "default") assetKey = "visited"

        // need clone asset!
        return { ...this.optionsAssets[assetKey], iconImageHref: resolveProjectIconUri(stage, isForeign, isVisited, isFolderItem) }
    }
}