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
    constructor(urlTemplate: string = "/pages/invest-browser/ambiance/jsonp-load-project-groups.js") {
        super(urlTemplate)
    }
    
    protected async decoratePlacemarks() {
        const loadingManager = await this._loadingManager
        return new GroupPlacemarksDecorator(loadingManager.objects)
    }

    protected async decorateClusters() {
        const loadingManager = await this._loadingManager
        return new GroupClustersDecorator(loadingManager.clusters)
    }
}