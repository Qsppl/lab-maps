export type ZoomRestrictionPresetKeys = "for-guest" | "for-registrant" | "for-subscriber"

export interface IUserInterface {
    setZoomRestriction(presetKey: ZoomRestrictionPresetKeys): void

    doSomething2(): void

    // decoratePointsLoader(pointsLoader: ymaps.objectManager.LoadingObjectManager<ymaps.IGeometry>): IPointsLoaderDecorator
    // addPointsLoaderToMap(pointsLoader: ymaps.objectManager.LoadingObjectManager<ymaps.IGeometry>): void
}