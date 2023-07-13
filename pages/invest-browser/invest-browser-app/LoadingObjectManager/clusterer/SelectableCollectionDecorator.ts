"use strict"

import { IUserFocusEmmiter } from "../../UserInterface/interfaces/IUserFocusEmmiter.js"

export type ObjectOptionsAssetKey = "default" | "select" | "visited"
export type ObjectOptionsModifierKey = "normal" | "hover"

export abstract class SelectableCollectionDecorator<
    Feathure extends ymaps.geometry.json.IObjectJson & {
        options: { isVisited?: boolean | undefined, isSelected?: boolean | undefined }
    },
    Collection extends ymaps.objectManager.ClusterCollection<any, any, any, any, any> | ymaps.objectManager.ObjectCollection<any, any, any>
> implements IUserFocusEmmiter {
    protected readonly _collection: Collection

    protected readonly _focusListeners: Set<(feathure: Feathure) => Promise<boolean>> = new Set()

    public readonly ready: Promise<void>

    constructor(collection: Collection) {
        this._collection = collection
        this.ready = this.setDefaultPlacemarksOptions()

        collection.events.add('mouseenter', (event: ymaps.IEvent<MouseEvent>) => {
            const targetId: string = event.get("objectId")
            const targetObject = this._collection.getById(targetId)

            if (targetObject === null) {
                console.warn("target not defined", event)
                return
            }

            // block hover when checkbox is selected
            if (!!targetObject.options.isSelected) return

            this.resetObjectOptionsAsset(targetObject, "hover")
        })

        collection.events.add('mouseleave', (event: ymaps.IEvent<MouseEvent>) => {
            const targetId: string = event.get("objectId")
            const targetObject = this._collection.getById(targetId)

            if (targetObject === null) {
                console.warn("target not defined", event)
                return
            }

            // block hover when checkbox is selected
            if (!!targetObject.options.isSelected) return

            this.resetObjectOptionsAsset(targetObject)
        })

        collection.events.add('click', (event: ymaps.IEvent<MouseEvent>) => {
            const targetId: string = event.get("objectId")
            const targetObject = this._collection.getById(targetId)

            if (targetObject === null) {
                console.warn("target not defined", event)
                return
            }

            this.selectSingleObject(targetObject)
        })

        collection.events.add('add', (event: ymaps.IEvent<MouseEvent>) => {
            const targetObject = event.get("child")

            if (targetObject === null) {
                console.warn("target not defined", event)
                return
            }

            this.resetObjectOptionsAsset(targetObject)
        })
    }

    public defocus(): void {
        for (const feathure of this.getSelectedObjects()) this.resetUnselectedObjectOptionsAsset(feathure)
    }

    public selectObject(targetObject: Feathure): boolean {
        if (!!targetObject.options.isSelected) return false
        this.setObjectOptionsAsset(targetObject, "select")
        return true
    }

    public addFocusFistener(f: (feathure: Feathure) => Promise<boolean>): void {
        this._focusListeners.add(f)
    }
    
    public deleteFocusFistener(f: (feathure: Feathure) => Promise<boolean>): void {
        this._focusListeners.delete(f)
    }

    protected async callFocusListeners(feathure: Feathure) {
        const results = await Promise.all([...this._focusListeners].map(f => f(feathure)))
        return results.every(result => result)
    }

    protected async getDefaultAsset(): Promise<any> {
        throw new Error("Methood should be implemented!")
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
    protected createAsset(targetObject: Feathure, assetKey: ObjectOptionsAssetKey, modifier: ObjectOptionsModifierKey): Promise<any> {
        throw new Error("Methood should be implemented!")
    }

    /** дизайн меток по умолчанию */
    protected async setDefaultPlacemarksOptions(): Promise<void> {
        throw new Error("Methood should be implemented!")
    }

    protected getSelectedObjects(): Feathure[] {
        throw new Error("Methood should be implemented!")
    }

    protected setObjectOptions(targetObject: Feathure, optionsAsset: any) {
        throw new Error("Methood should be implemented!")
    }


    protected async selectSingleObject(targetObject: Feathure): Promise<void> {
        // если хук родителя на это действие вернет false, то прерываем действие
        if (await this.callFocusListeners(targetObject) === false) return

        // переводим все объекты кроме целевого в любое состояние кроме select
        for (const feathure of this.getSelectedObjects()) {
            if (feathure === targetObject) continue
            this.resetUnselectedObjectOptionsAsset(feathure)
        }

        // Применить селект если нужно
        if (!!targetObject.options.isSelected) return
        this.setObjectOptionsAsset(targetObject, "select")
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

        this.setObjectOptions(targetObject, asset)
    }
}