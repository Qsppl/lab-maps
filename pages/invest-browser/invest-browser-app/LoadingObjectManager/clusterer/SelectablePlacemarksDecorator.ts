"use strict"

import { SelectableObjectJsonOptions, SelectablePlacemarkJson } from "./ClustererLoadingObjectManager.js"
import { ObjectOptionsAssetKey, ObjectOptionsModifierKey, SelectableCollectionDecorator } from "./SelectableCollectionDecorator.js"

const ymaps = globalThis.ymaps

export type PlacemarkCollectionOptions = ymaps.objectManager.ObjectCollectionOptions<SelectableObjectJsonOptions, ymaps.PlacemarkOptions>
type PlacemarkCollection = ymaps.objectManager.ObjectCollection<SelectableObjectJsonOptions, SelectablePlacemarkJson, ymaps.PlacemarkOptions>

export class SelectablePlacemarksDecorator extends SelectableCollectionDecorator<SelectablePlacemarkJson, PlacemarkCollection> {
    protected async getDefaultAsset(): Promise<PlacemarkCollectionOptions> {
        return {
            iconImageSize: [24, 24],
            iconImageOffset: [-12, -12],
            iconImageHref: "https://investprojects.info/web/img/map/icons/svg/few_normal.svg",
            iconLayout: 'default#image',
            hasBalloon: false,
            hasHint: false
        }
    }

    constructor(collection: PlacemarkCollection) {
        super(collection)
    }

    // ###############################
    // Логика должна быть где-то в более базовом классе, но времени нет

    /** Добавляет свойства или заменяет старые */
    public updateObjectProperties(targetObject: SelectablePlacemarkJson, properties: {}) {
        targetObject.properties = {...targetObject.properties, ...properties}
    }

    // ########

    /**
     * Метод должен содержать логику вычисления набора опций по:
     * - комбинации ключей;
     * - параметрам целевого объекта.
     * 
     * Примерная таблица
     * @example
     * // normal   | hoverModifier
     * // -------------------------
     * // default  | defaultHovered
     * // select   | select
     * // visited  | visitedHovered
     */
    protected async createAsset(targetObject: SelectablePlacemarkJson, assetKey: ObjectOptionsAssetKey, modifier: ObjectOptionsModifierKey = "normal"): Promise<PlacemarkCollectionOptions> {
        const asset: PlacemarkCollectionOptions = await this.getDefaultAsset()

        if (assetKey === "default") {
            // nothing
        } else if (assetKey === "select") {
            asset.iconImageHref = "https://investprojects.info/web/img/map/icons/svg/few_active.svg"
        } else if (assetKey === "visited") {
            asset.iconImageHref = "https://investprojects.info/web/img/map/icons/svg/few_visited.svg"
        } else throw new TypeError("")


        if (modifier === "normal") {
            // nothing
        } else if (modifier === "hover") {
            asset.iconImageSize = [32, 32]
            asset.iconImageOffset = [-16, -16]
        }

        return asset
    }

    /** дизайн меток по умолчанию */
    protected async setDefaultPlacemarksOptions(): Promise<void> {
        const defaultAsset = await this.getDefaultAsset()
        this._collection.options.set(defaultAsset)
    }

    protected getSelectedObjects(): SelectablePlacemarkJson[] {
        return this._collection.getAll().filter(feathure => !!feathure.options.isSelected)
    }

    protected setObjectOptions(targetObject: SelectablePlacemarkJson, optionsAsset: PlacemarkCollectionOptions) {
        this._collection.setObjectOptions(targetObject.id, optionsAsset)
    }
}