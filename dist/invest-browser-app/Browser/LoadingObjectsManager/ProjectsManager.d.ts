import { ProjectsLoadingObjectManager, ProjectsLoadingObjectManagerOptions } from "./dto/project.js";
export declare class ProjectsManager {
    protected readonly _loadingManager: Promise<ProjectsLoadingObjectManager>;
    constructor(urlTemplate: string, options?: ProjectsLoadingObjectManagerOptions);
    private createLoaderManager;
    get loadingManager(): Promise<ProjectsLoadingObjectManager>;
}
