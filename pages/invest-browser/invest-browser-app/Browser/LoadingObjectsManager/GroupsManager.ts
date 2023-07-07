"use strict"

import { GroupsLoadingObjectManager, GroupsLoadingObjectManagerOptions } from "./dto/group.js"

const ymaps = globalThis.ymaps

export class GroupsManager {
    protected readonly _loadingManager: Promise<GroupsLoadingObjectManager>

    constructor(urlTemplate: string, options?: GroupsLoadingObjectManagerOptions) {
        this._loadingManager = this.createLoaderManager(urlTemplate, options)
    }

    private async createLoaderManager(urlTemplate: string, options?: GroupsLoadingObjectManagerOptions): Promise<GroupsLoadingObjectManager> {
        await ymaps.ready()
        return new ymaps.LoadingObjectManager(urlTemplate, options)
    }

    get loadingManager(): Promise<GroupsLoadingObjectManager> {
        return this._loadingManager
    }
}