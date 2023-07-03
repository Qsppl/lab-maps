import { PlacemarkDesign } from "./PlacemarkDesign.js"
import { resolveProjectIconUri } from "./Projects/IconUrlCreator.js"

const ymaps = globalThis.ymaps

type Options = ymaps.PlacemarkOptions

type Collection = ymaps.objectManager.ObjectCollection<any, Options>

export class ProjectsPlacemarkDesign extends PlacemarkDesign {
    private readonly _personalPlacemarksOptions: Map<string, Options>

    constructor(collection: Collection) {
        super(collection)

        this._personalPlacemarksOptions = new Map()

        this.applyPersonalDefaultDesignForPlacemark(collection)
    }

    private applyPersonalDefaultDesignForPlacemark(collection: Collection) {
        collection.events.add(['add'], (event: ymaps.IEvent<MouseEvent>) => {
            const targetObjectId = event.get("objectId")
            const feathure: projectsLoader.Feathure = event.get('child')
            this.setPersonalPlacemarkDesign(targetObjectId, feathure)
        })
    }

    private setPersonalPlacemarkDesign(placemarkId: string, feathure: projectsLoader.Feathure) {
        const stage: number = feathure.t
        const isVisited: boolean = this._selectedObjects.has(placemarkId)
        const { isFolderItem, isForeign } = feathure.properties

        const placemarkOptions = {
            __proto__: this.optionsAssets.default,
            iconImageHref: resolveProjectIconUri()
        }
        objectManager.objects.setObjectOptions(placemarkId, {
            iconImageHref: this.getIconUriForPoint(point)
        })
    }
}