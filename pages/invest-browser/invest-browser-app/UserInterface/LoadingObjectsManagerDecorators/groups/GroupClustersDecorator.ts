"use strict"

import { GroupFeathure, GroupFeathureOptions } from "../../../Browser/LoadingObjectsManager/dto/group.js"
import { ISelectableClusterJson, ISelectableClusterJsonOptions } from "../../../Browser/LoadingObjectsManager/dto/object.js"
import { ObjectOptionsAssetKey, ObjectOptionsModifierKey } from "../selectable/BaseSelectableCollection.js"
import { SelectableClustersDecorator } from "../selectable/SelectableClustersDecorator.js"

type ClusterOptions = ISelectableClusterJsonOptions<ymaps.ClusterPlacemarkOptions>
type Cluster = ISelectableClusterJson<ymaps.geometry.json.Point, ClusterOptions, {}, GroupFeathure>

type ClusterCollectionOptions = ymaps.objectManager.ClusterCollectionOptions<GroupFeathureOptions, ClusterOptions> & {
    __proto__?: ClusterCollectionOptions
}

export class GroupClustersDecorator extends SelectableClustersDecorator {
    protected async getDefaultAsset(): Promise<ClusterCollectionOptions> {
        const Layout = await this._Layout
        return {
            clusterIcons: [{
                href: "resources/few_cluster_of_group.svg",
                size: [24, 24],
                offset: [-12, -12]
            }],
            clusterIconContentLayout: Layout
        }
    }

    protected async createAsset(targetObject: Cluster, assetKey: ObjectOptionsAssetKey, modifier: ObjectOptionsModifierKey = "normal"): Promise<ClusterCollectionOptions> {
        const asset: ClusterCollectionOptions = await this.getDefaultAsset()

        if (assetKey === "default") {
            // nothing
        } else if (assetKey === "select") {
            asset.clusterIcons[0].href = "resources/few_group_of_projects_active.svg"
            asset.clusterIcons[0].size = [32, 32]
            asset.clusterIcons[0].offset = [-16, -16]
        } else if (assetKey === "visited") {
            asset.clusterIcons[0].href = "resources/few_group_of_projects_visited.svg"
        } else throw new TypeError("")


        if (modifier === "normal") {
            // nothing
        } else if (modifier === "hover") {
            asset.clusterIcons[0].size = [32, 32]
            asset.clusterIcons[0].offset = [-16, -16]
        }

        return asset
    }
}