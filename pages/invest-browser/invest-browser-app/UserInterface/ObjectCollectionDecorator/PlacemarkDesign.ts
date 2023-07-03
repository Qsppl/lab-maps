const ymaps = globalThis.ymaps

type Options = ymaps.PlacemarkOptions

type OptionsAssetIndex = "default" | "hover" | "select"

type OptionsAssets = { [k in OptionsAssetIndex]: Options }

type Collection = ymaps.objectManager.ObjectCollection<any, Options>

export class PlacemarkDesign {
    protected readonly optionsAssets: OptionsAssets = {
        default: {
            iconImageSize: [24, 24],
            iconImageOffset: [-12, -12],
            iconImageHref: "/web/img/map/icons/svg/few_normal.svg",
            iconLayout: 'default#image'
        },
        hover: {
            iconImageSize: [32, 32],
            iconImageOffset: [-16, -16],
            iconImageHref: "/web/img/map/icons/svg/few_normal.svg",
            iconLayout: 'default#image'
        },
        select: {
            iconImageSize: [32, 32],
            iconImageOffset: [-16, -16],
            iconImageHref: "/web/img/map/icons/svg/few_active.svg",
            iconLayout: 'default#image'
        }
    }

    protected readonly _collection: Collection

    protected readonly _selectedObjects: Set<string>

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
            this.setPlacemarkDesign(targetObjectId, "hover")
        })

        collection.events.add('mouseleave', (event: ymaps.IEvent<MouseEvent>) => {
            const targetObjectId = event.get("objectId")
            this.setPlacemarkDesign(targetObjectId, "default")
        })
    }

    protected applySelectDesignOfCollection(collection: Collection) {
        collection.events.add('click', (event: ymaps.IEvent<MouseEvent>) => {
            const targetObjectId = event.get("objectId")
            this.setPlacemarkDesign(targetObjectId, "select")
        })
    }

    protected setPlacemarkDesign(placemarkId: string, assetKey: OptionsAssetIndex) {
        const currentlySelected = this._selectedObjects.has(placemarkId)
        // [select > !default] is blocked
        if (currentlySelected && assetKey !== "default") return

        // [select > !select] list needs to be updated
        if (currentlySelected && assetKey !== "select") this._selectedObjects.delete(placemarkId)

        // [any > select] list needs to be updated
        if (assetKey === "select") this._selectedObjects.add(placemarkId)

        this._collection.setObjectOptions(placemarkId, this.optionsAssets[assetKey])
    }
}