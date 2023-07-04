"use strict"

import { PlacemarkDesign } from "../PlacemarkDesign.js"
import { resolveProjectIconUri } from "./resolveProjectIconUri.js"

const ymaps = globalThis.ymaps

type Options = ymaps.PlacemarkOptions

type Collection = ymaps.objectManager.ObjectCollection<any, Options>

export class ProjectsPlacemarkDesign extends PlacemarkDesign {
    private readonly _personalPlacemarksOptions: Map<string, Options>

    constructor(collection: Collection) {
        super(collection)

        this._personalPlacemarksOptions = new Map()

        this.applyPersonalDefaultDesignForPlacemark(collection)
    }

    private applyPersonalDefaultDesignForPlacemark(collection: Collection) {
        collection.events.add(['add'], (event: ymaps.IEvent<MouseEvent>) => {
            const targetObjectId = event.get("objectId")
            const feathure: projectsLoader.Feathure = event.get('child')
            this.setPersonalPlacemarkDesign(targetObjectId, feathure)
        })
    }

    private setPersonalPlacemarkDesign(placemarkId: string, feathure: projectsLoader.Feathure) {
        const stage: number = feathure.t
        const isForeign = feathure.o && (feathure.o == 89)
        const isFolderItem: boolean = !!(globalThis._folders && globalThis._folders.some(({ projects }) => { return projects[placemarkId] }))

        this.setPersonalOptionsAsset(placemarkId, "default", {
            ...this.optionsAssets.default,
            ...{ iconImageHref: resolveProjectIconUri(stage, isForeign, false, isFolderItem) }
        })

        this.setPersonalOptionsAsset(placemarkId, "visited", {
            ...this.optionsAssets.default,
            ...{ iconImageHref: resolveProjectIconUri(stage, isForeign, true, isFolderItem) }
        })
    }
}