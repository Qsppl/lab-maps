export class ProjectsLoader<FeathureType extends ymaps.IFeatureData> extends InvestBrowserClusteredMapPointsLoader<FeathureType> {
    constructor(urlTemplate: string, options?: ymaps.objectManager.LoadingObjectManagerOptions) {
        super(urlTemplate, options)

        this.addHandlerOnAddingPoint(this.pointsEventManager)
    }

    protected addHandlerOnAddingPoint(events: ymaps.IEventManager<{}>): void {
        events.add(['add'], InvestBrowserProjectsMapPointsLoader.setPersonalPointerDesign.bind(this))
    }

    public static setPersonalPointerDesign(event: ymaps.IEvent<MouseEvent>, { }): void {
        const point: ProjectsData = event.get('child')

        objectManager.objects.setObjectOptions(point.id, {
            iconImageHref: this.getIconUriForPoint(point)
        })
    }

    private static getIconUriForPoint(projectData: ProjectsData): string {
        const stage: number = projectData.t
        const isVisited: boolean = projectData.properties.isVisited || false
        const { isFolderItem, isForeign } = projectData.properties
        return ProjectIconUrlCreator.projectIconsUrl
            + ProjectIconUrlCreator.createFileNameByProjectProperties(stage, isForeign, isVisited, isFolderItem)
    }
}