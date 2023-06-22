export class ClusteredLoader<FeathureType extends ymaps.IFeatureData> extends InvestBrowserMapPointsLoader<FeathureType> {
    protected iconUrlOfCluster = "/web/img/map/icons/svg/few_normal.svg"
    protected iconUrlOfVisetedCluster = "/web/img/map/icons/svg/few_visited.svg"

    protected sizeOfCluster = [24, 24]
    protected sizeOFBigCluster = [32, 32]
    protected sizeOFBigHoveredCluster = [40, 40]

    protected offsetOfCluster = [-12, -12]
    protected offsetOfBigCluster = [-16, -16]
    protected offsetOfBigHoveredCluster = [-20, -20]

    protected fontsizeOfCluster = '7px'

    _myClusterIconContentLayout: ymaps.IClassConstructor<ymaps.layout.templateBased.Base>
    protected get MyClusterIconContentLayout() {
        if (!this._myClusterIconContentLayout) this._myClusterIconContentLayout = ymaps.templateLayoutFactory.createClass(
            '{% if properties.geoObjects.length > 100 %}'
            + '<div style="color:FF00FF;font-size:10px;">99+</div>'
            + '{% else %}'
            + '<div style="color:FF00FF;font-size:11px;">{{ properties.geoObjects.length }}</div>'
            + '{% endif %}'
        )
        return this._myClusterIconContentLayout
    }

    _myClusterIconContentLayoutHover: ymaps.IClassConstructor<ymaps.layout.templateBased.Base>
    protected get MyClusterIconContentLayoutHover() {
        if (!this._myClusterIconContentLayoutHover) this._myClusterIconContentLayoutHover = ymaps.templateLayoutFactory.createClass(
            '{% if properties.geoObjects.length > 100 %}'
            + '<div style="color:FF00FF;font-size:14px;">99+</div>'
            + '{% else %}'
            + '<div style="color:FF00FF;font-size:15px;">{{ properties.geoObjects.length }}</div>'
            + '{% endif %}'
        )
        return this._myClusterIconContentLayoutHover
    }

    public readonly clustersEventManager: ymaps.IEventManager<{}>

    constructor(urlTemplate: string, options?: ymaps.objectManager.LoadingObjectManagerOptions) {
        options = options || {}
        options.clusterize = true
        options.gridSize = options.gridSize || 36
        super(urlTemplate, options)

        this.clustersEventManager = this._loadingObjectManager.clusters.events

        this.setDefaultClustersDesign()
        this.addHoverEffectOnClusters()
        this.addClickEffectOnClusters()
    }

    protected setDefaultClustersDesign(): void {
        const { iconUrlOfCluster, sizeOfCluster, offsetOfCluster, fontsizeOfCluster } = this
        this._loadingObjectManager.clusters.options.set({
            clusterIcons: [{
                href: iconUrlOfCluster,
                size: sizeOfCluster,
                offset: offsetOfCluster,
                fontSize: fontsizeOfCluster,
                font: fontsizeOfCluster,
            }],
            clusterIconContentLayout: this.MyClusterIconContentLayout
        })
    }

    protected addHoverEffectOnClusters(): void {
        this._loadingObjectManager.clusters.events.add('mouseenter', this.handleHoverOnCluster.bind(this))
        this._loadingObjectManager.clusters.events.add('mouseleave', this.handleUnhoverFromCluster.bind(this))
    }

    public handleHoverOnCluster(event: ymaps.IEvent<MouseEvent, FeathureType>): void {
        let cluster = objectManager.clusters.getById(event.get('objectId'))
        if (event.get('objectId') == clickedObjectId) return
        if (!cluster) return
        objectManager.clusters.setClusterOptions(cluster.id, {
            clusterIcons: [{
                href: cl.options.clusterIcons[0].href,
                size: clusterIconSizeBig,
                offset: clusterIconOffsetBig
            }],
            clusterIconContentLayout: MyClusterIconContentLayoutHover
        })
    }

    public handleUnhoverFromCluster(event: ymaps.IEvent<MouseEvent, FeathureType>): void {
        if (event.get('objectId') == clickedObjectId) return
        let cl = objectManager.clusters.getById(event.get('objectId'))

        if (cl) objectManager.clusters.setClusterOptions(cl.id, {
            clusterIcons: [{
                href: cl.options.clusterIcons[0].href,
                size: projectIconSize,
                offset: projectIconOffset
            }],
            clusterIconContentLayout: MyClusterIconContentLayout
        })
    }

    protected addClickEffectOnClusters(): void {
        this._loadingObjectManager.clusters.events.add('click', this.handleClickOnCluster.bind(this))
    }

    public handleClickOnCluster(event: ymaps.IEvent<MouseEvent, {}>): void {

    }
}