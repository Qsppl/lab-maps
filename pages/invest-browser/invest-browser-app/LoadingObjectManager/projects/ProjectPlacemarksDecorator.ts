"use strict"

import { SelectablePlacemarkJson } from "../clusterer/ClustererLoadingObjectManager.js"
import { ObjectOptionsAssetKey, ObjectOptionsModifierKey } from "../clusterer/SelectableCollectionDecorator.js"
import { PlacemarkCollection, PlacemarkCollectionOptions, SelectablePlacemarksDecorator } from "../clusterer/SelectablePlacemarksDecorator.js"
import { ProjectFeathure } from "./LoadingProjectsManager.js"
import { resolveProjectIconUri } from "./resolveProjectIconUri.js"

export class ProjectPlacemarksDecorator extends SelectablePlacemarksDecorator {
    constructor(collection: PlacemarkCollection) {
        super(collection)

        collection.events.add('add', (event: ymaps.IEvent<MouseEvent>) => {
            const targetObject = event.get("child")

            globalThis.app.querySelectorPromise('[data-component="projects-list"]').then((listElement: HTMLUListElement) => {
                const itemInput = document.createElement('input')
                itemInput.type = "checkbox"
                if (targetObject?.options?.isSelected) itemInput.checked = true

                const projectInfo = document.createElement('span')
                projectInfo.innerText = `project id: ${targetObject.id}`

                const itemLabel = document.createElement('label')
                itemLabel.style.display = "block"
                itemLabel.style.backgroundColor = "#31708f"

                itemLabel.appendChild(itemInput)
                itemLabel.appendChild(projectInfo)

                const listItem = document.createElement('li')
                listItem.style.marginBlock = ".25em"
                listItem.appendChild(itemLabel)

                listElement.appendChild(listItem)


                itemInput.addEventListener("change", (event) => {
                    itemInput.checked ? this.selectObject(targetObject) : this.resetUnselectedObjectOptionsAsset(targetObject)
                })
            })
        })
    }
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