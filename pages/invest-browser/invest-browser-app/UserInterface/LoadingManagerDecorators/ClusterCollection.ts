const ymaps = globalThis.ymaps

type Options = ymaps.objectManager.ClusterCollectionOptions

type OptionsAssetIndex = "default" | "hover" | "select" | "visited"

type Collection = ymaps.objectManager.ClusterCollection<any, any, Options>

type Layout = ymaps.IClassConstructor<ymaps.layout.templateBased.Base>

type ClusterJson = ymaps.geometry.json.IClusterJson<
    ymaps.geometry.json.Point,
    ymaps.PlacemarkOptions,
    {},
    ymaps.geometry.json.IFeatureJson<any, any, any>
>

export class PlacemarkDesign {
    protected readonly _collection: Collection

    protected readonly _selectedObjects: Set<string> = new Set()
    protected readonly _visitedObjects: Set<string> = new Set()

    _Layout: Promise<Layout>
    _LayoutHover: Promise<Layout>

    constructor(collection: Collection) {
        this._collection = collection

        this._Layout = this.getLayout()

        this._LayoutHover = this.getLayoutHover()

        this.applyDefaultDesignOfCollection(collection)

        this.applyHoverDesignOfCollection(collection)

        this.applySelectDesignOfCollection(collection)
        collection.events.add(['add'], (event: ymaps.IEvent<MouseEvent>) => {
            const clusterJson: ClusterJson = event.get("child")
            const clusterItems = clusterJson.properties.geoObjects
            console.log(clusterItems)
        })
    }

    protected async getLayout(): Promise<Layout> {
        await ymaps.ready()
        return ymaps.templateLayoutFactory.createClass(
            '{% if properties.geoObjects.length > 100 %}'
            + '<div style="color:FF00FF;font-size:10px;">99+</div>'
            + '{% else %}'
            + '<div style="color:FF00FF;font-size:11px;">{{ properties.geoObjects.length }}</div>'
            + '{% endif %}'
        )
    }

    protected async getLayoutHover(): Promise<Layout> {
        await ymaps.ready()
        return ymaps.templateLayoutFactory.createClass(
            '{% if properties.geoObjects.length > 100 %}'
            + '<div style="color:FF00FF;font-size:14px;">99+</div>'
            + '{% else %}'
            + '<div style="color:FF00FF;font-size:15px;">{{ properties.geoObjects.length }}</div>'
            + '{% endif %}'
        )
    }

    protected async getOptionsAssets(): Promise<{ [k in OptionsAssetIndex]: Options }> {
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

    protected async applyDefaultDesignOfCollection(collection: Collection) {
        const optionsAssets = await this.getOptionsAssets()
        collection.options.set(optionsAssets["default"])
    }

    protected applyHoverDesignOfCollection(collection: Collection) {
        collection.events.add('mouseenter', (event: ymaps.IEvent<MouseEvent>) => {
            const targetObjectId = event.get("objectId")
            const isTargetSelected = this._selectedObjects.has(targetObjectId)
            if (isTargetSelected) return // block hover when checkbox is selected
            this.setPlacemarkDesign(targetObjectId, "hover")
        })

        collection.events.add('mouseleave', (event: ymaps.IEvent<MouseEvent>) => {
            const targetObjectId = event.get("objectId")
            const isTargetSelected = this._selectedObjects.has(targetObjectId)
            if (isTargetSelected) return // block hover when checkbox is selected
            this.setPlacemarkDesign(targetObjectId, "default")
        })
    }

    protected applySelectDesignOfCollection(collection: Collection) {
        collection.events.add('click', (event: ymaps.IEvent<MouseEvent>) => {
            const targetObjectId = event.get("objectId")
            const currentlySelected = this._selectedObjects.has(targetObjectId)
            if (currentlySelected) return // already selected
            this.unselectAllPlcemarks()
            this.setPlacemarkDesign(targetObjectId, "select")
        })
    }

    public unselectAllPlcemarks(): void {
        for (let placemarkId of this._selectedObjects.values()) this.setPlacemarkDesign(placemarkId, "default")
    }

    protected async getAssetForPlacemark(placemarkId: string, assetKey: OptionsAssetIndex): Promise<Options> {
        const isTargetVisited = this._visitedObjects.has(placemarkId)
        // const isTargetVisited1 = 

        // Посещенная метка не может принять внешний вид "default", вместо этого принимает "visited"
        if (isTargetVisited && assetKey === "default") assetKey = "visited"

        const optionsAssets = await this.getOptionsAssets()
        return optionsAssets[assetKey]
    }

    protected async setPlacemarkDesign(placemarkId: string, assetKey: OptionsAssetIndex) {
        const isTargetSelected = this._selectedObjects.has(placemarkId)

        // [select > !select] list needs to be updated
        if (isTargetSelected && assetKey !== "select") this._selectedObjects.delete(placemarkId)

        // [any > select] list needs to be updated
        if (assetKey === "select") {
            this._selectedObjects.add(placemarkId)
            this._visitedObjects.add(placemarkId)
        }

        const asset = await this.getAssetForPlacemark(placemarkId, assetKey)
        this._collection.setClusterOptions(placemarkId, asset)
    }
}