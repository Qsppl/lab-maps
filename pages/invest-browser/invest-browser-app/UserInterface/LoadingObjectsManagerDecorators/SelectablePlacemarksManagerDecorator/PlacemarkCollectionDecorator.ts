"use strict"

import { ISelectableFeathureJson, ISelectableFeathureJsonOptions } from "../../../Browser/LoadingObjectsManager/dto/object.js"

const ymaps = globalThis.ymaps

export type OptionsAssetKey = "default" | "hover" | "select" | "visited"

export type FeathureOptions = ISelectableFeathureJsonOptions<{}>
export type FeathureProperties = {}
export type Feathure = ISelectableFeathureJson<ymaps.geometry.json.Point, FeathureOptions, FeathureProperties>

export type ObjectCollection = ymaps.objectManager.ObjectCollection<Feathure, FeathureOptions, ymaps.PlacemarkOptions>
export type ObjectCollectionOptions = ymaps.objectManager.ObjectCollectionOptions<FeathureOptions, ymaps.PlacemarkOptions>

export class PlacemarkCollectionDecorator {
    protected readonly optionsAssets: { [k in OptionsAssetKey]: ObjectCollectionOptions } = {
        default: {
            iconImageSize: [24, 24],
            iconImageOffset: [-12, -12],
            iconImageHref: "https://investprojects.info/web/img/map/icons/svg/few_normal.svg",
            iconLayout: 'default#image'
        },
        visited: {
            iconImageSize: [24, 24],
            iconImageOffset: [-12, -12],
            iconImageHref: "https://investprojects.info/web/img/map/icons/svg/few_visited.svg",
            iconLayout: 'default#image'
        },
        hover: {
            iconImageSize: [32, 32],
            iconImageOffset: [-16, -16],
            iconImageHref: "https://investprojects.info/web/img/map/icons/svg/few_normal.svg",
            iconLayout: 'default#image'
        },
        select: {
            iconImageSize: [32, 32],
            iconImageOffset: [-16, -16],
            iconImageHref: "https://investprojects.info/web/img/map/icons/svg/few_active.svg",
            iconLayout: 'default#image'
        }
    }

    protected readonly _collection: ObjectCollection

    // shortcut to selected elements
    protected readonly _selectedObjects: Set<Feathure> = new Set()

    constructor(collection: ObjectCollection) {
        this._collection = collection

        this.applyDefaultDesignOfCollection(collection)

        this.applyHoverDesignOfCollection(collection)

        this.applySelectDesignOfCollection(collection)
    }

    protected applyDefaultDesignOfCollection(collection: ObjectCollection) {
        collection.options.set(this.optionsAssets["default"])
    }

    protected applyHoverDesignOfCollection(collection: ObjectCollection) {
        collection.events.add('mouseenter', (event: ymaps.IEvent<MouseEvent>) => {
            const targetObject: Feathure = event.get("child")
            const currentlySelected = !!targetObject.options.isSelected

            // block hover when checkbox is selected
            if (currentlySelected) return

            this.setPlacemarkDesign(targetObject, "hover")
        })

        collection.events.add('mouseleave', (event: ymaps.IEvent<MouseEvent>) => {
            const targetObject: Feathure = event.get("child")
            const currentlySelected = !!targetObject.options.isSelected

            // block hover when checkbox is selected
            if (currentlySelected) return

            this.setPlacemarkDesign(targetObject, "default")
        })
    }

    protected applySelectDesignOfCollection(collection: ObjectCollection) {
        collection.events.add('click', (event: ymaps.IEvent<MouseEvent>) => {
            const targetObject: Feathure = event.get("child")
            const currentlySelected = !!targetObject.options.isSelected

            // already selected
            if (currentlySelected) return

            for (const placemark of this._selectedObjects.values()) this.setPlacemarkDesign(placemark, "default")

            this.setPlacemarkDesign(targetObject, "select")
        })
    }

    protected getAssetForPlacemark(targetObject: Feathure, assetKey: OptionsAssetKey): ObjectCollectionOptions {
        // Посещенная метка не может принять внешний вид "default", вместо этого принимает "visited"
        if (targetObject.options.isVisited && assetKey === "default") assetKey = "visited"

        // need clone asset!
        return { ...this.optionsAssets[assetKey] }
    }

    protected setPlacemarkDesign(targetObject: Feathure, assetKey: OptionsAssetKey) {
        const asset = this.getAssetForPlacemark(targetObject, assetKey)

        const targetIsSelected = !!asset.isSelected

        // [select > !select] list needs to be updated
        if (targetIsSelected && assetKey !== "select") {
            this._selectedObjects.delete(targetObject)
            asset.isSelected = false
        }

        // [any > select] list needs to be updated
        if (assetKey === "select") {
            this._selectedObjects.add(targetObject)
            asset.isSelected = true
            asset.isVisited = true
        }
        this._collection.setObjectOptions(targetObject.id, asset)
    }
}