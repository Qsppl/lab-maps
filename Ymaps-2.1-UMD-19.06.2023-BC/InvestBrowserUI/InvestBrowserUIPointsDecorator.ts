class InvestBrowserUIPointsDecorator implements IPointsLoaderDecorator {
    protected static mapPointIconUrl = "web/img/map/icons/svg/few_normal.svg"
    protected static projectIconSize = [24, 24]
    protected static clusterIconSize = [24, 24]
    protected static clusterIconOffset = [-12, -12]
    protected static clusterFontSize = '7px'

    readonly _pointsLoader: ymaps.objectManager.LoadingObjectManager<ymaps.IGeometry>

    constructor(pointsLoader: ymaps.objectManager.LoadingObjectManager<ymaps.IGeometry>) {
        this._pointsLoader = pointsLoader
    }

    asProjects(): ymaps.objectManager.LoadingObjectManager<ymaps.IGeometry> {
        const { mapPointIconUrl, clusterIconSize, clusterFontSize, clusterIconOffset, projectIconSize }
            = InvestBrowserUIPointsDecorator

        // Для каждого 
        this._pointsLoader.clusters.options.set({
            clusterIcons: [{
                href: mapPointIconUrl,
                size: clusterIconSize,
                fontSize: clusterFontSize,
                font: clusterFontSize,
                offset: clusterIconOffset,
            }],
            clusterIconContentLayout: MyClusterIconContentLayout
        })

        this._pointsLoader.objects.options.set({
            'iconLayout': 'default#image',
            'iconImageSize': projectIconSize
        })

        return this._pointsLoader
    }
}