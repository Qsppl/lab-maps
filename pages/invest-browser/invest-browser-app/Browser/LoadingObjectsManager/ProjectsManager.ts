"use strict"

import { ProjectsLoadingObjectManager, ProjectsLoadingObjectManagerOptions } from "./dto/project.js"

const ymaps = globalThis.ymaps

export class ProjectsManager {
    protected readonly _loadingManager: Promise<ProjectsLoadingObjectManager>

    constructor(urlTemplate: string, options?: ProjectsLoadingObjectManagerOptions) {
        this._loadingManager = this.createLoaderManager(urlTemplate, options)
    }

    private async createLoaderManager(urlTemplate: string, options?: ProjectsLoadingObjectManagerOptions): Promise<ProjectsLoadingObjectManager> {
        await ymaps.ready()
        return new ymaps.LoadingObjectManager(urlTemplate, options)
    }

    get loadingManager(): Promise<ProjectsLoadingObjectManager> {
        return this._loadingManager
    }
}