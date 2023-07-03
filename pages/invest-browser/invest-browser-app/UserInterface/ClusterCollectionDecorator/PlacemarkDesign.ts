const ymaps = globalThis.ymaps

type Options = ymaps.objectManager.ClusterCollectionOptions

type OptionsAssetIndex = "default" | "hover" | "select"

type OptionsAssets = { [k in OptionsAssetIndex]: Options }

type Collection = ymaps.objectManager.ClusterCollection<any, any, Options>

type Layout = ymaps.IClassConstructor<ymaps.layout.templateBased.Base>

export class PlacemarkDesign {
    protected readonly _collection: Collection

    protected readonly _selectedObjects: Set<string>

    _Layout: Promise<Layout>
    _LayoutHover: Promise<Layout>

    constructor(collection: Collection) {
        this._collection = collection

        this._Layout = this.getLayout()

        this._LayoutHover = this.getLayoutHover()

        this.applyDefaultDesignOfCollection(collection)

        this.applyHoverDesignOfCollection(collection)

        this.applySelectDesignOfCollection(collection)
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

    protected async getOptionsAssets(): Promise<OptionsAssets> {
        const Layout = await this._Layout
        const LayuotHover = await this._LayoutHover

        return {
            default: {
                clusterIcons: [{
                    href: "/web/img/map/icons/svg/few_normal.svg",
                    size: [24, 24],
                    offset: [-12, -12]
                }],
                clusterIconContentLayout: Layout
            },
            hover: {
                clusterIcons: [{
                    href: "/web/img/map/icons/svg/few_normal.svg",
                    size: [32, 32],
                    offset: [-16, -16]
                }],
                clusterIconContentLayout: LayuotHover
            },
            select: {
                clusterIcons: [{
                    href: "/web/img/map/icons/svg/few_visited.svg",
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
            this.setPlacemarkDesign(targetObjectId, "hover")
        })

        collection.events.add('mouseleave', (event: ymaps.IEvent<MouseEvent>) => {
            const targetObjectId = event.get("objectId")
            this.setPlacemarkDesign(targetObjectId, "default")
        })
    }

    protected applySelectDesignOfCollection(collection: Collection) {
        collection.events.add('click', (event: ymaps.IEvent<MouseEvent>) => {
            const targetObjectId = event.get("objectId")
            this.setPlacemarkDesign(targetObjectId, "select")
        })
    }

    protected async setPlacemarkDesign(placemarkId: string, assetKey: OptionsAssetIndex) {
        const currentlySelected = this._selectedObjects.has(placemarkId)
        // [select > !default] is blocked
        if (currentlySelected && assetKey !== "default") return

        // [select > !select] list needs to be updated
        if (currentlySelected && assetKey !== "select") this._selectedObjects.delete(placemarkId)

        // [any > select] list needs to be updated
        if (assetKey === "select") this._selectedObjects.add(placemarkId)

        const optionsAssets = await this.getOptionsAssets()
        this._collection.setClusterOptions(placemarkId, optionsAssets[assetKey])
    }
}