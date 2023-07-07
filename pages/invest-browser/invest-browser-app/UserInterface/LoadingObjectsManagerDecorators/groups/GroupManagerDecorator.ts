"use strict"

import { GroupsLoadingObjectManagerOptions } from "../../../Browser/LoadingObjectsManager/dto/group.js"

export class GroupManagerDecorator {
    public static clustererOptionsAsset: GroupsLoadingObjectManagerOptions = {
        clusterize: true,
        gridSize: 36,
        clusterDisableClickZoom: true
    }
}