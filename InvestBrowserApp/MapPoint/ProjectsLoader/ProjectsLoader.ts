import * as ymaps from "yandex-maps"
import { ClusteredLoader } from "../ClusteredLoader.js"
import { IconUrlCreator } from "./IconUrlCreator.js"
import { ProjectData } from "./dto/ProjectData.js"

export class ProjectsLoader<FeathureType extends ymaps.IFeatureData> extends ClusteredLoader<FeathureType> {
    constructor(urlTemplate: string, options?: ymaps.objectManager.LoadingObjectManagerOptions) {
        super(urlTemplate, options)

        this.addHandlerOnAddingPoint(this.pointsEventManager)
    }

    protected addHandlerOnAddingPoint(events: ymaps.IEventManager<{}>): void {
        events.add(['add'], InvestBrowserProjectsMapPointsLoader.setPersonalPointerDesign.bind(this))
    }

    public static setPersonalPointerDesign(event: ymaps.IEvent<MouseEvent>, { }): void {
        const point: ProjectData = event.get('child')

        objectManager.objects.setObjectOptions(point.id, {
            iconImageHref: this.getIconUriForPoint(point)
        })
    }

    private static getIconUriForPoint(projectData: ProjectData): string {
        const stage: number = projectData.t
        const isVisited: boolean = projectData.properties.isVisited || false
        const { isFolderItem, isForeign } = projectData.properties
        return IconUrlCreator.projectIconsUrl
            + IconUrlCreator.createFileNameByProjectProperties(stage, isForeign, isVisited, isFolderItem)
    }
}