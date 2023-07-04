"use strict"

import { ProjectsLoadingObjectManager } from "./dto/project.js"

const ymaps = globalThis.ymaps

export class ProjectsManager {
    protected readonly _loadingManager: Promise<ProjectsLoadingObjectManager>

    constructor(urlTemplate: string) {
        this._loadingManager = this.createLoaderManager(urlTemplate)
    }

    private async createLoaderManager(urlTemplate: string): Promise<ProjectsLoadingObjectManager> {
        await ymaps.ready()
        return new ymaps.LoadingObjectManager(
            urlTemplate,
            { clusterize: true, gridSize: 36 }
        )
    }

    get loadingManager(): Promise<ProjectsLoadingObjectManager> {
        return this._loadingManager
    }
}