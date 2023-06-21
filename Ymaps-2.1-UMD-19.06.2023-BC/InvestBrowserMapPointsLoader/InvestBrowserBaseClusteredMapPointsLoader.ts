class InvestBrowserBaseClusteredMapPointsLoader<T extends ymaps.IFeatureData> extends InvestBrowserBaseMapPointsLoader<T> {
    protected static iconUrlOfCluster = "web/img/map/icons/svg/few_normal.svg"

    protected static sizeOfCluster = [24, 24]
    protected static sizeOFBigCluster = [32, 32]
    protected static sizeOFBigHoveredCluster = [40, 40]

    protected static offsetOfCluster = [-12, -12]
    protected static offsetOfBigCluster = [-16, -16]
    protected static offsetOfBigHoveredCluster = [-20, -20]

    protected static fontsizeOfCluster = '7px'
    
    _myClusterIconContentLayout: ymaps.IClassConstructor<ymaps.layout.templateBased.Base>
    get MyClusterIconContentLayout() {
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
    get MyClusterIconContentLayoutHover() {
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

        const clusters = this._loadingObjectManager.clusters
        const clustersEventManager = clusters.events

        this.setDefaultClustersDesign(clusters)
        this.addHoverEffectOnClusters(clustersEventManager)
        this.addClickEffectOnClusters(clustersEventManager)

        this.clustersEventManager = clustersEventManager
    }

    protected setDefaultClustersDesign(clusters: ymaps.objectManager.ClusterCollection): void {
        const { iconUrlOfCluster, sizeOfCluster, offsetOfCluster, fontsizeOfCluster }
            = InvestBrowserBaseClusteredMapPointsLoader
        clusters.options.set({
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

    protected addHoverEffectOnClusters(events: ymaps.IEventManager<{}>): void {
        events.add('mouseenter', this.handleHoverOnCluster.bind(this))
        events.add('mouseleave', this.handleUnhoverFromCluster.bind(this))
    }

    public handleHoverOnCluster(event: ymaps.IEvent<MouseEvent>, { }): void {
        if (event.get('objectId') == clickedObjectId) return
        let cl = objectManager.clusters.getById(event.get('objectId'))

        if (cl) objectManager.clusters.setClusterOptions(cl.id, {
            clusterIcons: [{
                href: cl.options.clusterIcons[0].href,
                size: clusterIconSizeBig,
                offset: clusterIconOffsetBig
            }],
            clusterIconContentLayout: MyClusterIconContentLayoutHover
        })
    }

    public handleUnhoverFromCluster(event: ymaps.IEvent<MouseEvent>, { }): void {
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

    protected addClickEffectOnClusters(events: ymaps.IEventManager<{}>): void {
        events.add('click', this.handleClickOnCluster.bind(this))
    }

    public handleClickOnCluster(event: ymaps.IEvent<MouseEvent, {}>): void {

    }
}