import { ProjectsLoadingObjectManagerOptions } from "../../../Browser/LoadingObjectsManager/dto/project.js"

export class ProjectsManagerDecorator {
    public static clustererOptionsAsset: ProjectsLoadingObjectManagerOptions = {
        clusterize: true,
        gridSize: 36,
        clusterDisableClickZoom: true
    }
}