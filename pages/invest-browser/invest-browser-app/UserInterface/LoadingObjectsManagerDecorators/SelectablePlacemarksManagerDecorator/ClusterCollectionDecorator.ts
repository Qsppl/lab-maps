import { ISelectableClusterJson, ISelectableClusterJsonOptions, ISelectableFeathureJson, ISelectableFeathureJsonOptions } from "../../../Browser/LoadingObjectsManager/dto/object.js"
import { ObjectOptionsAssetKey, ObjectOptionsModifierKey, SelectableCollectionDecorator } from "./SelectableCollectionDecorator.js"

const ymaps = globalThis.ymaps

type ClusterLayout = ymaps.IClassConstructor<ymaps.layout.templateBased.Base>

type ChildFeathureOptions = ISelectableFeathureJsonOptions<{}>
type ChildFeathure = ISelectableFeathureJson<any, ChildFeathureOptions, any>

type ClusterOptions = ISelectableClusterJsonOptions<ymaps.ClusterPlacemarkOptions>
type Cluster = ISelectableClusterJson<ymaps.geometry.json.Point, ClusterOptions, {}, ChildFeathure>

type ClusterCollectionOptions = ymaps.objectManager.ClusterCollectionOptions<ChildFeathureOptions, ClusterOptions> & {
    __proto__?: ClusterCollectionOptions
}
type ClusterCollection = ymaps.objectManager.ClusterCollection<
    ChildFeathureOptions,
    ChildFeathure,
    ymaps.LoadingObjectManager<any, any, any, any>,

    ClusterOptions,
    Cluster
>

/** Это декоратор коллекции кластеров класса LoadingObjectsManager - у него кластеры могут быть только Placemark'ами. Содержимое кластеров - любое. */
export class ClusterCollectionDecorator extends SelectableCollectionDecorator<
    ClusterOptions,
    Cluster,
    ClusterCollectionOptions,
    ClusterCollection
> {
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

    constructor(collection: ClusterCollection) {
        super(collection)

        this._Layout = this.getLayout()

        this._LayoutHover = this.getLayoutHover()

        collection.options.set({
            hasBalloon: false,
            hasHint: false
        })
    }

    /** Восстанавливает актуальный набор опций объекта */
    protected resetObjectOptionsAsset(targetObject: Cluster, modifier: ObjectOptionsModifierKey = "normal") {
        const someChildsIsSelected = targetObject.properties.geoObjects.some((feathure) => feathure.options.isSelected)
        if (!!targetObject.options.isSelected || someChildsIsSelected) this.setObjectOptionsAsset(targetObject, "select", modifier)
        else this.resetUnselectedObjectOptionsAsset(targetObject, modifier)
    }

    /** Восстанавливает актуальный набор опций объекта не являющийся "select" */
    protected resetUnselectedObjectOptionsAsset(targetObject: Cluster, modifier: ObjectOptionsModifierKey = "normal") {
        const allChildsIsVisited = targetObject.properties.geoObjects.every((feathure) => feathure.options.isVisited)
        if (!!targetObject.options.isVisited || allChildsIsVisited) this.setObjectOptionsAsset(targetObject, "visited", modifier)
        else this.setObjectOptionsAsset(targetObject, "default", modifier)
    }

    protected async createAsset(targetObject: Cluster, assetKey: ObjectOptionsAssetKey, modifier: ObjectOptionsModifierKey = "normal"): Promise<ClusterCollectionOptions> {
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
}