"use strict"

import { LoadingObjectManager } from "./dto/projects.js"

const ymaps = globalThis.ymaps

export class ProjectsLoader {
    protected readonly _loadingManager: Promise<LoadingObjectManager>

    constructor(urlTemplate: string) {
        this._loadingManager = this.createLoaderManager(urlTemplate)
    }

    private async createLoaderManager(urlTemplate: string): Promise<LoadingObjectManager> {
        await ymaps.ready()
        return new ymaps.LoadingObjectManager(
            urlTemplate,
            { clusterize: true, gridSize: 36 }
        )
    }

    get loadingManager(): Promise<LoadingObjectManager> {
        return this._loadingManager
    }
}