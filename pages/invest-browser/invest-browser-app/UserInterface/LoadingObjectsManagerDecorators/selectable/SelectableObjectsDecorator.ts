"use strict"

import { ISelectableFeathureJson, ISelectableFeathureJsonOptions } from "../../../Browser/LoadingObjectsManager/dto/object.js"
import { BaseSelectableCollection, ObjectOptionsAssetKey, ObjectOptionsModifierKey } from "./BaseSelectableCollection.js"

const ymaps = globalThis.ymaps

type FeathureOptions = ISelectableFeathureJsonOptions<{}>
type Feathure = ISelectableFeathureJson<ymaps.geometry.json.Point, FeathureOptions, {}>

type ObjectCollectionOptions = ymaps.objectManager.ObjectCollectionOptions<FeathureOptions, ymaps.PlacemarkOptions> & {
    __proto__?: ObjectCollectionOptions | undefined
}
type ObjectCollection = ymaps.objectManager.ObjectCollection<FeathureOptions, Feathure, ymaps.PlacemarkOptions>

export class SelectableObjectsDecorator extends BaseSelectableCollection<
    FeathureOptions,
    Feathure,
    ObjectCollectionOptions,
    ObjectCollection
> {
    protected async getDefaultAsset(): Promise<ObjectCollectionOptions> {
        return {
            iconImageSize: [24, 24],
            iconImageOffset: [-12, -12],
            iconImageHref: "https://investprojects.info/web/img/map/icons/svg/few_normal.svg",
            iconLayout: 'default#image'
        }
    }

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
    protected async createAsset(targetObject: Feathure, assetKey: ObjectOptionsAssetKey, modifier: ObjectOptionsModifierKey = "normal"): Promise<ObjectCollectionOptions> {
        const asset: ObjectCollectionOptions = await this.getDefaultAsset()

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
}