class InvestBrowserBaseMapPointsLoader<T extends ymaps.IFeatureData> {
    protected static iconUrlOfPointer = "web/img/map/icons/svg/few_normal.svg"

    protected static sizeOfPointer = [24, 24]
    protected static sizeOfBigPointer = [32, 32]

    protected static offsetOfPointer = [-12, -12]
    protected static offsetOfBigPointer = [-16, -16]

    protected readonly _loadingObjectManager: ymaps.objectManager.LoadingObjectManager<ymaps.IGeometry>

    public readonly pointsEventManager: ymaps.IEventManager<{}>

    constructor(urlTemplate: string, options?: ymaps.objectManager.LoadingObjectManagerOptions) {
        this._loadingObjectManager = new ymaps.objectManager.LoadingObjectManager(urlTemplate, options || {})
        const points = this._loadingObjectManager.objects
        const pointsEventManager = points.events

        this.setDefaultPointerDesign(points)
        this.addHoverEffectOnPoints(pointsEventManager)
        this.addClickEffectOnPoints(pointsEventManager)

        this.pointsEventManager = pointsEventManager
    }

    protected setDefaultPointerDesign(points: ymaps.objectManager.ObjectCollection): void {
        const { iconUrlOfPointer, sizeOfPointer, offsetOfPointer } = InvestBrowserBaseMapPointsLoader
        
        points.options.set({
            iconImageHref: iconUrlOfPointer,
            iconImageSize: sizeOfPointer,
            iconImageOffset: offsetOfPointer,
            iconLayout: 'default#image',
        })
    }

    protected addHoverEffectOnPoints(events: ymaps.IEventManager<{}>): void {
        events.add('mouseenter', this.hoverOnPointEffect.bind(this))
        events.add('mouseleave', this.unhoverFromPointEffect.bind(this))
    }

    public hoverOnPointEffect(event: ymaps.IEvent<MouseEvent>, { }): void {
        if (event.get('objectId') == clickedObjectId) return

        objectManager.objects.setObjectOptions(event.get('objectId'), {
            iconImageSize: projectIconSizeBig,
            iconImageOffset: projectIconOffsetBig
        })
    }

    public unhoverFromPointEffect(event: ymaps.IEvent<MouseEvent>, { }): void {
        if (event.get('objectId') == clickedObjectId) return

        objectManager.objects.setObjectOptions(event.get('objectId'), {
            iconImageSize: projectIconSize,
            iconImageOffset: projectIconOffset
        })
    }

    protected addClickEffectOnPoints(events: ymaps.IEventManager<{}>): void {
        events.add('click', this.clickOnPointEffect.bind(this))
    }

    public clickOnPointEffect(event: ymaps.IEvent<MouseEvent>, { }): void {
        const targetObjectId = event.get('objectId')
        objectManager.objects.setObjectOptions(targetObjectId, {
            iconImageSize: projectIconSizeBig,
            iconImageOffset: projectIconOffsetBig,
            iconImageHref: getIconPath('p', object.t, 'active', object, isProjectInAnyFolder(object.id))
        })
    }
}