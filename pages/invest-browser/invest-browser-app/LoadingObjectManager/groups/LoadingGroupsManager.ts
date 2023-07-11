"use strict"

import { ClustererLoadingObjectManager, SelectableObjectJsonOptions, SelectablePlacemarkJson } from "../clusterer/ClustererLoadingObjectManager.js"
import { GroupClustersDecorator } from "./GroupClustersDecorator.js"
import { GroupPlacemarksDecorator } from "./GroupPlacemarksDecorator.js"

const ymaps = globalThis.ymaps

type GroupFeathureProperties = {
    /** какая-то фигня (равно Id проекта) */
    clusterCaption: number
}

export type GroupFeathure = SelectablePlacemarkJson<SelectableObjectJsonOptions, GroupFeathureProperties> & {
    /** Id отрасли */
    s: number
    /** Id региона */
    o: number | null
    /** Код страны */
    z: number
}

export class LoadingGroupsManager extends ClustererLoadingObjectManager {
    protected async decorate() {
        const loadingManager = await this._loadingManager
        const placemarksDecorator = new GroupPlacemarksDecorator(loadingManager.objects)
        const clustersDecorator = new GroupClustersDecorator(loadingManager.clusters)
        this.syncObjectCollections(placemarksDecorator, clustersDecorator)
    }
}