"use strict"

const ymaps = globalThis.ymaps

type Options = ymaps.objectManager.ObjectCollectionOptions<
    ymaps.PlacemarkOptions & objectsLoader.IFeatureJsonOptions
>

type OptionsAssetIndex = "default" | "hover" | "select" | "visited"

type Collection = ymaps.objectManager.ObjectCollection<any, Options>

export class PlacemarkDesign<
FeathureOptions extends GeoObjects.json.IFeatureJsonOptions & ymaps.PlacemarkOptions,
Feathure = GeoObjects.json.IFeatureJson<any, any, any>
> {
    protected readonly optionsAssets: { [k in OptionsAssetIndex]: Options } = {
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

    protected readonly personalOptionsAssets: { [k in OptionsAssetIndex]: Map<string, Options> } = {
        default: new Map(),
        visited: new Map(),
        hover: new Map(),
        select: new Map(),
    }

    protected readonly _collection: Collection

    // shortcut to selected elements
    protected readonly _selectedObjects: Set<string> = new Set()
    protected readonly _visitedObjects: Set<string> = new Set()

    constructor(collection: Collection) {
        this._collection = collection

        this.applyDefaultDesignOfCollection(collection)

        this.applyHoverDesignOfCollection(collection)

        this.applySelectDesignOfCollection(collection)
    }

    protected applyDefaultDesignOfCollection(collection: Collection) {
        collection.options.set(this.optionsAssets["default"])
    }

    protected applyHoverDesignOfCollection(collection: Collection) {
        collection.events.add('mouseenter', (event: ymaps.IEvent<MouseEvent>) => {
            const targetObjectId = event.get("objectId")
            const currentlySelected = this._selectedObjects.has(targetObjectId)
            if (currentlySelected) return // block hover when checkbox is selected
            this.setPlacemarkDesign(targetObjectId, "hover")
        })

        collection.events.add('mouseleave', (event: ymaps.IEvent<MouseEvent>) => {
            const targetObjectId = event.get("objectId")
            const currentlySelected = this._selectedObjects.has(targetObjectId)
            if (currentlySelected) return // block hover when checkbox is selected
            this.setPlacemarkDesign(targetObjectId, "default")
        })
    }

    protected applySelectDesignOfCollection(collection: Collection) {
        collection.events.add('click', (event: ymaps.IEvent<MouseEvent>) => {
            const targetObjectId = event.get("objectId")
            const currentlySelected = this._selectedObjects.has(targetObjectId)
            if (currentlySelected) return // already selected
            this.unselectAllPlcemarks()
            this.setPlacemarkDesign(targetObjectId, "select")
        })
    }

    public unselectAllPlcemarks(): void {
        for (let placemarkId of this._selectedObjects.values()) this.setPlacemarkDesign(placemarkId, "default")
    }

    protected getAssetForPlacemark(placemarkId: string, assetKey: OptionsAssetIndex): Options {
        const isTargetVisited = this._visitedObjects.has(placemarkId)

        // Посещенная метка не может принять внешний вид "default", вместо этого принимает "visited"
        if (isTargetVisited && assetKey === "default") assetKey = "visited"

        // Ищем персональный ассет собранный для этой метки или берем ассет по умолчанию
        return this.getPersonalOptionsAsset(placemarkId, assetKey) || this.optionsAssets[assetKey]
    }

    protected getPersonalOptionsAsset(placemarkId: string, assetKey: OptionsAssetIndex): Options | undefined {
        return this.personalOptionsAssets[assetKey].get(placemarkId)
    }

    protected setPersonalOptionsAsset(placemarkId: string, assetKey: OptionsAssetIndex, optionsAsset: Options) {
        this.personalOptionsAssets[assetKey].set(placemarkId, optionsAsset)
    }

    protected setPlacemarkDesign(placemarkId: string, assetKey: OptionsAssetIndex) {
        const asset = this.getAssetForPlacemark(placemarkId, assetKey)

        const targetSelected = !!asset.isSelected

        // [select > !select] list needs to be updated
        if (targetSelected && assetKey !== "select") {
            this._selectedObjects.delete(placemarkId)
            asset.isSelected = false
        }

        // [any > select] list needs to be updated
        if (assetKey === "select") {
            this._selectedObjects.add(placemarkId)
            asset.isSelected = true
            asset.isVisited = true
        }
        this._collection.setObjectOptions(placemarkId, asset)
    }
}