interface IInvestBrowserUI {
    limitMapZoom(): void

    doSomething2(): void

    decoratePointsLoader(pointsLoader: ymaps.objectManager.LoadingObjectManager<ymaps.IGeometry>): IPointsLoaderDecorator
    addPointsLoaderToMap(pointsLoader: ymaps.objectManager.LoadingObjectManager<ymaps.IGeometry>): void
}

interface IPointsLoaderDecorator {
    asProjects(): ymaps.objectManager.LoadingObjectManager<ymaps.IGeometry>
}