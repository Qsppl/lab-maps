import { ISelectableFeathureJson, ISelectableFeathureJsonOptions } from "../../../Browser/LoadingObjectsManager/dto/object.js"

const ymaps = globalThis.ymaps

type ClusterLayout = ymaps.IClassConstructor<ymaps.layout.templateBased.Base>

type OptionsAssetKey = "default" | "visited" | "hover" | "select"
type ClusterCollectionOptions = ymaps.objectManager.ClusterCollectionOptions
type ChildFeathure = ISelectableFeathureJson<any, ChildFeathureOptions, any>
type ChildFeathureOptions = ISelectableFeathureJsonOptions<{}>
type ClusterCollection = ymaps.objectManager.ClusterCollection<ChildFeathure, ymaps.LoadingObjectManager<any, any, any>>
type IClusterJson = ymaps.geometry.json.IClusterJson<ymaps.geometry.json.circle, {}, {}, ChildFeathure>

/** Это декоратор коллекции кластеров класса LoadingObjectsManager - у него кластеры могут быть только Placemark'ами. Содержимое кластеров - любое. */
export class ClusterCollectionDecorator {
    protected readonly _collection: ClusterCollection

    protected readonly _selectedObjects: Set<IClusterJson> = new Set()

    _Layout: Promise<ClusterLayout>
    _LayoutHover: Promise<ClusterLayout>

    constructor(collection: ClusterCollection) {
        this._collection = collection

        this._Layout = this.getLayout()

        this._LayoutHover = this.getLayoutHover()

        this.applyDefaultDesignOfCollection(collection)

        this.applyHoverDesignOfCollection(collection)

        this.applySelectDesignOfCollection(collection)

        collection.events.add(['add'], (event: ymaps.IEvent<MouseEvent>) => {
            const clusterJson: IClusterJson = event.get("child")
            this.restoreActulaPlacemarkState(clusterJson)
        })
    }

    /** Хук вызываемый при событии unselect. Прерывает обработку события декоратором если хук вернет false */
    public unselectHook: (cluster: IClusterJson) => boolean = (cluster: IClusterJson) => true

    /** Хук вызываемый при событии select. Прерывает обработку события декоратором если хук вернет false */
    public selectHook: (cluster: IClusterJson) => boolean = (cluster: IClusterJson) => true

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

    protected async getOptionsAssets(): Promise<{ [k in OptionsAssetKey]: ClusterCollectionOptions }> {
        const Layout = await this._Layout
        const LayuotHover = await this._LayoutHover

        return {
            default: {
                clusterIcons: [{
                    href: "https://investprojects.info/web/img/map/icons/svg/few_normal.svg",
                    size: [24, 24],
                    offset: [-12, -12]
                }],
                clusterIconContentLayout: Layout
            },
            visited: {
                clusterIcons: [{
                    href: "https://investprojects.info/web/img/map/icons/svg/few_visited.svg",
                    size: [24, 24],
                    offset: [-12, -12]
                }],
                clusterIconContentLayout: Layout
            },
            hover: {
                clusterIcons: [{
                    href: "https://investprojects.info/web/img/map/icons/svg/few_normal.svg",
                    size: [32, 32],
                    offset: [-16, -16]
                }],
                clusterIconContentLayout: LayuotHover
            },
            select: {
                clusterIcons: [{
                    href: "https://investprojects.info/web/img/map/icons/svg/few_active.svg",
                    size: [32, 32],
                    offset: [-16, -16]
                }],
                clusterIconContentLayout: Layout
            }
        }
    }

    protected async applyDefaultDesignOfCollection(collection: ClusterCollection) {
        const optionsAssets = await this.getOptionsAssets()
        collection.options.set(optionsAssets["default"])
    }

    protected applyHoverDesignOfCollection(collection: ClusterCollection) {
        collection.events.add('mouseenter', (event: ymaps.IEvent<MouseEvent>) => {
            const clusterJson: IClusterJson = event.get("child")
            const isTargetSelected = this.checkIsPlacemarkSelected(clusterJson)

            // block hover when checkbox is selected
            if (isTargetSelected) return

            this.setPlacemarkDesign(clusterJson, "hover")
        })

        collection.events.add('mouseleave', (event: ymaps.IEvent<MouseEvent>) => {
            const clusterJson: IClusterJson = event.get("child")
            const isTargetSelected = this.checkIsPlacemarkSelected(clusterJson)

            // block hover when checkbox is selected
            if (isTargetSelected) return

            this.setPlacemarkDesign(clusterJson, "default")
        })
    }

    protected applySelectDesignOfCollection(collection: ClusterCollection) {
        collection.events.add('click', (event: ymaps.IEvent<MouseEvent>) => {
            const clusterJson: IClusterJson = event.get("child")
            const isTargetSelected = this.checkIsPlacemarkSelected(clusterJson)

            // already selected
            if (isTargetSelected) return

            // unselect all
            for (const cluster of this._selectedObjects) this.setPlacemarkDesign(cluster, "default")

            this.setPlacemarkDesign(clusterJson, "select")
        })
    }

    protected restoreActulaPlacemarkState(clusterJson: IClusterJson) {
        const isSelected = clusterJson.properties.geoObjects.some((feathure) => feathure.options.isSelected)

        if (isSelected) this.setPlacemarkDesign(clusterJson, "select")
        else this.setPlacemarkDesign(clusterJson, "default")
    }

    protected async getAssetForPlacemark(clusterJson: IClusterJson, assetKey: OptionsAssetKey): Promise<ClusterCollectionOptions> {
        const isTargetVisited = this.checkIsPlacemarkVisited(clusterJson)
        // const isTargetVisited1 = 

        // Посещенная метка не может принять внешний вид "default", вместо этого принимает "visited"
        if (isTargetVisited && assetKey === "default") assetKey = "visited"

        const optionsAssets = await this.getOptionsAssets()
        return optionsAssets[assetKey]
    }

    protected async setPlacemarkDesign(clusterJson: IClusterJson, assetKey: OptionsAssetKey) {
        const isTargetSelected = this.checkIsPlacemarkSelected(clusterJson)

        // [select > !select] list needs to be updated
        if (isTargetSelected && assetKey !== "select") {
            if (this.unselectHook(clusterJson) === false) return
            this._selectedObjects.delete(clusterJson)
        }

        // [any > select] list needs to be updated
        if (assetKey === "select") {
            if (this.selectHook(clusterJson) === false) return
            this._selectedObjects.add(clusterJson)
        }

        const asset = await this.getAssetForPlacemark(clusterJson, assetKey)
        this._collection.setClusterOptions(clusterJson.id, asset)
    }

    protected checkIsPlacemarkSelected(clusterJson: IClusterJson): boolean {
        return clusterJson.properties.geoObjects.some((feathure) => feathure.options.isSelected)
    }

    protected checkIsPlacemarkVisited(clusterJson: IClusterJson): boolean {
        return clusterJson.properties.geoObjects.every((feathure) => feathure.options.isVisited)
    }
}