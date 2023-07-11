"use strict"

import { SelectableClusterJson, SelectableClusterJsonOptions, SelectableObjectJsonOptions, SelectablePlacemarkJson } from "./ClustererLoadingObjectManager.js"
import { ObjectOptionsAssetKey, ObjectOptionsModifierKey, SelectableCollectionDecorator } from "./SelectableCollectionDecorator.js"

const ymaps = globalThis.ymaps

type ClusterLayout = ymaps.IClassConstructor<ymaps.layout.templateBased.Base>

export type ClusterCollectionOptions = ymaps.objectManager.ClusterCollectionOptions<
    SelectableObjectJsonOptions,
    SelectableClusterJsonOptions
>
type ClusterCollection<
    TCluster extends SelectableClusterJson
> = ymaps.objectManager.ClusterCollection<
    SelectableObjectJsonOptions,
    any,
    any,
    SelectableClusterJsonOptions,
    TCluster
>

export class SelectableClustersDecorator<
    TCluster extends SelectableClusterJson = SelectableClusterJson,
    TClusterCollection extends ClusterCollection<TCluster> = ClusterCollection<TCluster>
> extends SelectableCollectionDecorator<SelectableClusterJson, TClusterCollection> {
    protected readonly _Layout: Promise<ClusterLayout>

    protected readonly _LayoutHover: Promise<ClusterLayout>

    protected async getLayout(): Promise<ClusterLayout> {
        await ymaps.ready()
        return ymaps.templateLayoutFactory.createClass(
            '{% if properties.geoObjects.length > 100 %}'
            + '<div style="color:FF00FF;font-size:10px;">99+</div>'
            + '{% else %}'
            + '<div style="color:FF00FF;font-size:11px;">{{ properties.geoObjects.length }}</div>'
            + '{% endif %}'
        )
    }

    protected async getLayoutHover(): Promise<ClusterLayout> {
        await ymaps.ready()
        return ymaps.templateLayoutFactory.createClass(
            '{% if properties.geoObjects.length > 100 %}'
            + '<div style="color:FF00FF;font-size:14px;">99+</div>'
            + '{% else %}'
            + '<div style="color:FF00FF;font-size:15px;">{{ properties.geoObjects.length }}</div>'
            + '{% endif %}'
        )
    }

    protected async getDefaultAsset(): Promise<ClusterCollectionOptions> {
        const Layout = await this._Layout
        return {
            clusterIcons: [{
                href: "https://investprojects.info/web/img/map/icons/svg/few_normal.svg",
                size: [24, 24],
                offset: [-12, -12]
            }],
            clusterIconContentLayout: Layout
        }
    }

    constructor(collection: TClusterCollection) {
        super(collection)

        this._Layout = this.getLayout()

        this._LayoutHover = this.getLayoutHover()

        collection.options.set({
            hasBalloon: false,
            hasHint: false
        })
    }

    /** Восстанавливает актуальный набор опций объекта */
    protected resetObjectOptionsAsset(targetObject: TCluster, modifier: ObjectOptionsModifierKey = "normal") {
        const someChildsIsSelected = targetObject.properties.geoObjects.some((feathure) => feathure.options.isSelected)
        if (!!targetObject.options.isSelected || someChildsIsSelected) this.setObjectOptionsAsset(targetObject, "select", modifier)
        else this.resetUnselectedObjectOptionsAsset(targetObject, modifier)
    }

    /** Восстанавливает актуальный набор опций объекта не являющийся "select" */
    protected resetUnselectedObjectOptionsAsset(targetObject: TCluster, modifier: ObjectOptionsModifierKey = "normal") {
        const allChildsIsVisited = targetObject.properties.geoObjects.every((feathure) => feathure.options.isVisited)
        if (!!targetObject.options.isVisited || allChildsIsVisited) this.setObjectOptionsAsset(targetObject, "visited", modifier)
        else this.setObjectOptionsAsset(targetObject, "default", modifier)
    }

    protected async createAsset(targetObject: TCluster, assetKey: ObjectOptionsAssetKey, modifier: ObjectOptionsModifierKey = "normal"): Promise<ClusterCollectionOptions> {
        const asset: ClusterCollectionOptions = await this.getDefaultAsset()

        if (assetKey === "default") {
            // nothing
        } else if (assetKey === "select") {
            asset.clusterIcons[0].href = "https://investprojects.info/web/img/map/icons/svg/few_active.svg"
            asset.clusterIcons[0].size = [32, 32]
            asset.clusterIcons[0].offset = [-16, -16]
        } else if (assetKey === "visited") {
            asset.clusterIcons[0].href = "https://investprojects.info/web/img/map/icons/svg/few_visited.svg"
        } else throw new TypeError("")


        if (modifier === "normal") {
            // nothing
        } else if (modifier === "hover") {
            asset.clusterIcons[0].size = [32, 32]
            asset.clusterIcons[0].offset = [-16, -16]
        }

        return asset
    }

    protected async setObjectOptionsAsset(targetObject: TCluster, assetKey: ObjectOptionsAssetKey, modifier: ObjectOptionsModifierKey = "normal") {
        const asset = await this.createAsset(targetObject, assetKey, modifier)

        // [select > !select] => update Object isSelected state
        if (assetKey !== "select") asset.isSelected = false

        // [any > select] => update Object isSelected
        if (assetKey === "select") asset.isSelected = true

        // [any > select && childrens is visited] => update Object isVisited
        const allChildsIsVisited = targetObject.properties.geoObjects.every((feathure) => feathure.options.isVisited)
        if (assetKey === "select" && allChildsIsVisited) asset.isVisited = true

        this.setObjectOptions(targetObject, asset)
    }

    /** дизайн меток по умолчанию */
    protected async setDefaultPlacemarksOptions(): Promise<void> {
        const defaultAsset = await this.getDefaultAsset()
        this._collection.options.set(defaultAsset)
    }

    protected getSelectedObjects(): TCluster[] {
        return this._collection.getAll().filter(feathure => !!feathure.options.isSelected)
    }

    protected setObjectOptions(targetObject: TCluster, optionsAsset: ClusterCollectionOptions) {
        this._collection.setClusterOptions(targetObject.id, optionsAsset)
    }
}