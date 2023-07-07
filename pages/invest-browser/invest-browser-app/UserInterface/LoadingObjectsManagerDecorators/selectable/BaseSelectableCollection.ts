"use strict"

import { ISelectableClusterJson, ISelectableClusterJsonOptions, ISelectableFeathureJson, ISelectableFeathureJsonOptions } from "../../../Browser/LoadingObjectsManager/dto/object.js"

export type ObjectOptionsAssetKey = "default" | "select" | "visited"
export type ObjectOptionsModifierKey = "normal" | "hover"

export abstract class BaseSelectableCollection<
    FeathureOptions extends ISelectableFeathureJsonOptions<ymaps.IOptionManagerData> | ISelectableClusterJsonOptions<ymaps.IOptionManagerData>,
    Feathure extends ISelectableFeathureJson<any, any, any> | ISelectableClusterJson<any, any, any, any>,
    ObjectCollectionOptions extends ymaps.objectManager.ObjectCollectionOptions<FeathureOptions, ymaps.PlacemarkOptions>,
    ObjectCollection extends ymaps.objectManager.ObjectCollection<any, any, any> | ymaps.objectManager.ClusterCollection<any, any, any>,
> {
    protected readonly _collection: ObjectCollection

    public readonly ready: Promise<void>

    protected async getDefaultAsset(): Promise<ObjectCollectionOptions> {
        throw new Error("Methood should be implemented!")
    }

    constructor(collection: ObjectCollection) {
        this._collection = collection

        // дизайн меток по умолчанию
        this.ready = this.setDefaultPlacemarksOptions()

        collection.events.add('mouseenter', (event: ymaps.IEvent<MouseEvent>) => {
            const targetId: string = event.get("objectId")
            const targetObject: Feathure = this._collection.getById(targetId)

            // block hover when checkbox is selected
            if (!!targetObject.options.isSelected) return

            this.resetObjectOptionsAsset(targetObject, "hover")
        })

        collection.events.add('mouseleave', (event: ymaps.IEvent<MouseEvent>) => {
            const targetId: string = event.get("objectId")
            const targetObject: Feathure = this._collection.getById(targetId)

            // block hover when checkbox is selected
            if (!!targetObject.options.isSelected) return

            this.resetObjectOptionsAsset(targetObject)
        })

        collection.events.add('click', (event: ymaps.IEvent<MouseEvent>) => {
            const targetId: string = event.get("objectId")
            const targetObject: Feathure = this._collection.getById(targetId)
            this.selectSingleObject(targetObject)
        })

        collection.events.add('add', (event: ymaps.IEvent<MouseEvent>) => {
            const targetObject: Feathure = event.get("child")
            this.resetObjectOptionsAsset(targetObject)
        })
    }

    protected async setDefaultPlacemarksOptions(): Promise<void> {
        const defaultAsset = await this.getDefaultAsset()
        this._collection.options.set(this.getDefaultAsset())
    }

    /** Хук вызываемый при событии select-single-object. Прерывает обработку события декоратором если хук вернет false */
    public selectSingleObjectHook: (placemark: Feathure) => boolean = (placemark: Feathure) => true

    public selectObject(targetObject: Feathure): boolean {
        if (!!targetObject.options.isSelected) return false
        this.setObjectOptionsAsset(targetObject, "select")
        return true
    }

    public unselectAll(): void {
        for (const placemark of this.getSelectedObjects()) this.resetUnselectedObjectOptionsAsset(placemark)
    }


    protected selectSingleObject(targetObject: Feathure): void {
        // если хук родителя на это действие вернет false, то прерываем действие
        if (this.selectSingleObjectHook(targetObject) === false) return

        // переводим все объекты кроме целевого в любое состояние кроме select
        for (const placemark of this.getSelectedObjects()) {
            if (placemark === targetObject) continue
            this.resetUnselectedObjectOptionsAsset(placemark)
        }

        // Применить селект если нужно
        if (!!targetObject.options.isSelected) return
        this.setObjectOptionsAsset(targetObject, "select")
    }

    protected getSelectedObjects(): Feathure[] {
        return this._collection.getAll().filter(feathure => !!feathure.options.isSelected)
    }

    /** Восстанавливает актуальный набор опций объекта */
    protected resetObjectOptionsAsset(targetObject: Feathure, modifier: ObjectOptionsModifierKey = "normal") {
        if (!!targetObject.options.isSelected) this.setObjectOptionsAsset(targetObject, "select", modifier)
        else this.resetUnselectedObjectOptionsAsset(targetObject, modifier)
    }

    /** Восстанавливает актуальный набор опций объекта не являющийся "select" */
    protected resetUnselectedObjectOptionsAsset(targetObject: Feathure, modifier: ObjectOptionsModifierKey = "normal") {
        if (!!targetObject.options.isVisited) this.setObjectOptionsAsset(targetObject, "visited", modifier)
        else this.setObjectOptionsAsset(targetObject, "default", modifier)
    }

    /** Метод должен содержать только логику СМЕНЫ СОСТОЯНИЯ */
    protected async setObjectOptionsAsset(targetObject: Feathure, assetKey: ObjectOptionsAssetKey, modifier: ObjectOptionsModifierKey = "normal") {
        const asset = await this.createAsset(targetObject, assetKey, modifier)

        // [select > !select] => update Object isSelected state
        if (assetKey !== "select") asset.isSelected = false

        // [any > select] => update Object isSelected & isVisited states
        if (assetKey === "select") asset.isVisited = asset.isSelected = true

        if ("setObjectOptions" in this._collection) this._collection.setObjectOptions(targetObject.id, asset)
        else if ("setClusterOptions" in this._collection) this._collection.setClusterOptions(targetObject.id, asset)
        else throw new TypeError("")
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
    protected createAsset(targetObject: Feathure, assetKey: ObjectOptionsAssetKey, modifier: ObjectOptionsModifierKey): Promise<ObjectCollectionOptions> {
        throw new Error("Methood should be implemented!")
    }
}