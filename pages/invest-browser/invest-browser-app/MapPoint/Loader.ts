import * as ymaps from "yandex-maps"

export class Loader<FeathureType extends ymaps.IFeatureData> {
    protected readonly iconUrlOfPointer = "/web/img/map/icons/svg/few_normal.svg"
    protected readonly iconUrlOfActivePointer = "/web/img/map/icons/svg/few_active.svg"

    protected readonly sizeOfPointer = [24, 24]
    protected readonly sizeOfBigPointer = [32, 32]

    protected readonly offsetOfPointer = [-12, -12]
    protected readonly offsetOfBigPointer = [-16, -16]

    protected readonly _loadingObjectManager: ymaps.objectManager.LoadingObjectManager<FeathureType>

    public readonly pointsEventManager: ymaps.IEventManager<{}>

    constructor(urlTemplate: string, options?: ymaps.objectManager.LoadingObjectManagerOptions) {
        this._loadingObjectManager = new ymaps.objectManager.LoadingObjectManager<FeathureType>(urlTemplate, options || {})
        this.setDefaultPointerDesign()
        
        this.pointsEventManager = this._loadingObjectManager.objects.events
        this.addHoverEffectOnPoints()
        this.addClickEffectOnPoints()
    }

    /** Установить дефолтный дизайн поинтов в загрузчике */
    protected setDefaultPointerDesign(): void {
        this._loadingObjectManager.objects.options.set({
            iconImageSize: this.sizeOfPointer,
            iconImageOffset: this.offsetOfPointer,
            iconImageHref: this.iconUrlOfPointer,
            iconLayout: 'default#image',
        })
    }

    protected addHoverEffectOnPoints(): void {
        this._loadingObjectManager.objects.events.add('mouseenter', this.hoverOnPointEffect.bind(this))
        this._loadingObjectManager.objects.events.add('mouseleave', this.unhoverFromPointEffect.bind(this))
    }

    /** Обработать ховер на отдельном поинте */
    public hoverOnPointEffect(event: ymaps.IEvent<MouseEvent, FeathureType>): void {
        const targetObjectId = event.get("objectId")
        if (targetObjectId == clickedObjectId) return

        this._loadingObjectManager.objects.setObjectOptions(targetObjectId, {
            iconImageSize: projectIconSizeBig,
            iconImageOffset: projectIconOffsetBig
        })
    }

    /** Обработать снятие ховера на отдельном поинте */
    public unhoverFromPointEffect(event: ymaps.IEvent<MouseEvent, FeathureType>): void {
        const targetObjectId = event.get('objectId')

        if (targetObjectId == +clickedObjectId) return

        this._loadingObjectManager.objects.setObjectOptions(targetObjectId, {
            iconImageSize: projectIconSize,
            iconImageOffset: projectIconOffset
        })
    }

    protected addClickEffectOnPoints(): void {
        this._loadingObjectManager.objects.events.add('click', this.clickOnPointEffect.bind(this))
    }

    /** Сменить состояние поинта на активное. */
    public clickOnPointEffect(event: ymaps.IEvent<MouseEvent, FeathureType>): void {
        const targetObjectId = event.get('objectId')
        objectManager.objects.setObjectOptions(targetObjectId, {
            iconImageSize: projectIconSizeBig,
            iconImageOffset: projectIconOffsetBig,
            iconImageHref: this.iconUrlOfActivePointer
        })
    }
}