"use strict"

import { SelectableClusterJson } from "../clusterer/ClustererLoadingObjectManager.js"
import { ClusterCollectionOptions, SelectableClustersDecorator } from "../clusterer/SelectableClustersDecorator.js"
import { ObjectOptionsAssetKey, ObjectOptionsModifierKey } from "../clusterer/SelectableCollectionDecorator.js"

export class GroupClustersDecorator extends SelectableClustersDecorator<SelectableClusterJson> {
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

    protected async createAsset(targetObject: SelectableClusterJson, assetKey: ObjectOptionsAssetKey, modifier: ObjectOptionsModifierKey = "normal"): Promise<ClusterCollectionOptions> {
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