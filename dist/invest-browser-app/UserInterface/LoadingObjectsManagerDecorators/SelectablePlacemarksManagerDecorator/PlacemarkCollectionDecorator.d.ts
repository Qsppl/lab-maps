/// <reference types="yandex-maps" />
import { ISelectableFeathureJson, ISelectableFeathureJsonOptions } from "../../../Browser/LoadingObjectsManager/dto/object.js";
import { SelectableCollectionDecorator } from "./SelectableCollectionDecorator.js";
export type ObjectOptionsAssetKey = "default" | "select" | "visited";
export type ObjectOptionsModifierKey = "normal" | "hover";
type FeathureOptions = ISelectableFeathureJsonOptions<{}>;
type Feathure = ISelectableFeathureJson<ymaps.geometry.json.Point, FeathureOptions, {}>;
type ObjectCollectionOptions = ymaps.objectManager.ObjectCollectionOptions<FeathureOptions, ymaps.PlacemarkOptions> & {
    __proto__?: ObjectCollectionOptions | undefined;
};
type ObjectCollection = ymaps.objectManager.ObjectCollection<FeathureOptions, Feathure, ymaps.PlacemarkOptions>;
export declare class PlacemarkCollectionDecorator extends SelectableCollectionDecorator<FeathureOptions, Feathure, ObjectCollectionOptions, ObjectCollection> {
    protected getDefaultAsset(): Promise<ObjectCollectionOptions>;
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
    protected createAsset(targetObject: Feathure, assetKey: ObjectOptionsAssetKey, modifier?: ObjectOptionsModifierKey): Promise<ObjectCollectionOptions>;
}
export {};
