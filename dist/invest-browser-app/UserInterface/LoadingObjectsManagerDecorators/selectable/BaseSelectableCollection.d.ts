/// <reference types="yandex-maps" />
import { ISelectableClusterJson, ISelectableClusterJsonOptions, ISelectableFeathureJson, ISelectableFeathureJsonOptions } from "../../../Browser/LoadingObjectsManager/dto/object.js";
export type ObjectOptionsAssetKey = "default" | "select" | "visited";
export type ObjectOptionsModifierKey = "normal" | "hover";
export declare abstract class BaseSelectableCollection<FeathureOptions extends ISelectableFeathureJsonOptions<ymaps.IOptionManagerData> | ISelectableClusterJsonOptions<ymaps.IOptionManagerData>, Feathure extends ISelectableFeathureJson<any, any, any> | ISelectableClusterJson<any, any, any, any>, ObjectCollectionOptions extends ymaps.objectManager.ObjectCollectionOptions<FeathureOptions, ymaps.PlacemarkOptions>, ObjectCollection extends ymaps.objectManager.ObjectCollection<any, any, any> | ymaps.objectManager.ClusterCollection<any, any, any>> {
    protected readonly _collection: ObjectCollection;
    readonly ready: Promise<void>;
    protected getDefaultAsset(): Promise<ObjectCollectionOptions>;
    constructor(collection: ObjectCollection);
    protected setDefaultPlacemarksOptions(): Promise<void>;
    /** Хук вызываемый при событии select-single-object. Прерывает обработку события декоратором если хук вернет false */
    selectSingleObjectHook: (placemark: Feathure) => boolean;
    selectObject(targetObject: Feathure): boolean;
    unselectAll(): void;
    protected selectSingleObject(targetObject: Feathure): void;
    protected getSelectedObjects(): Feathure[];
    /** Восстанавливает актуальный набор опций объекта */
    protected resetObjectOptionsAsset(targetObject: Feathure, modifier?: ObjectOptionsModifierKey): void;
    /** Восстанавливает актуальный набор опций объекта не являющийся "select" */
    protected resetUnselectedObjectOptionsAsset(targetObject: Feathure, modifier?: ObjectOptionsModifierKey): void;
    /** Метод должен содержать только логику СМЕНЫ СОСТОЯНИЯ */
    protected setObjectOptionsAsset(targetObject: Feathure, assetKey: ObjectOptionsAssetKey, modifier?: ObjectOptionsModifierKey): Promise<void>;
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
    protected createAsset(targetObject: Feathure, assetKey: ObjectOptionsAssetKey, modifier: ObjectOptionsModifierKey): Promise<ObjectCollectionOptions>;
}
