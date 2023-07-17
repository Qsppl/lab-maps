"use strict"

import { ClusterCollectionOptions, SelectableClustersDecorator } from "../clusterer/SelectableClustersDecorator.js"
import { ObjectOptionsAssetKey, ObjectOptionsModifierKey } from "../clusterer/SelectableCollectionDecorator.js"
import { GroupsClusterJson } from "./LoadingGroupsManager.js"

export class GroupClustersDecorator extends SelectableClustersDecorator<GroupsClusterJson> {
    protected readonly _focusListeners: Set<(cluster: GroupsClusterJson) => Promise<boolean>> = new Set()


    public addFocusFistener(f: (cluster: GroupsClusterJson) => Promise<boolean>): void {
        return super.addFocusFistener(f)
    }

    public deleteFocusFistener(f: (cluster: GroupsClusterJson) => Promise<boolean>): void {
        return super.deleteFocusFistener(f)
    }

    protected async callFocusListeners(cluster: GroupsClusterJson) {
        return super.callFocusListeners(cluster)
    }

    protected async selectSingleObject(targetObject: GroupsClusterJson): Promise<void> {
        // если хук родителя на это действие вернет false, то прерываем действие
        if (await this.callFocusListeners(targetObject) === false) return

        // Родитель мог что-нибудь поменять в данных, поэтому открываем балун даже если он уже был открыт.
        if (targetObject.properties.geoObjects.some(feathure => feathure.properties.hasBalloonData)) {
            const balloon = this._collection.balloon

            const closeBalloonHandler = () => {
                this.defocus()
                balloon.events.remove("close", closeBalloonHandler)
            }

            (await balloon.open(targetObject.id)) && balloon.events.add("close", closeBalloonHandler)
        }

        // переводим все объекты кроме целевого в любое состояние кроме select
        for (const feathure of this.getSelectedObjects()) {
            if (feathure === targetObject) continue
            this.resetUnselectedObjectOptionsAsset(feathure)
        }

        // Применить селект если нужно
        if (!!targetObject.options.isSelected) return
        this.setObjectOptionsAsset(targetObject, "select")
    }

    protected async getDefaultAsset(): Promise<ClusterCollectionOptions> {
        const Layout = await this._Layout
        return {
            clusterBalloonPanelMaxMapArea: 0,
            clusterIcons: [{
                href: "/web/img/map/icons/svg/few_cluster_of_group.svg",
                size: [24, 24],
                offset: [-12, -12]
            }],
            clusterIconContentLayout: Layout
        }
    }

    protected async createAsset(targetObject: GroupsClusterJson, assetKey: ObjectOptionsAssetKey, modifier: ObjectOptionsModifierKey = "normal"): Promise<ClusterCollectionOptions> {
        const asset: ClusterCollectionOptions = await this.getDefaultAsset()

        if (assetKey === "default") {
            // nothing
        } else if (assetKey === "select") {
            asset.clusterIcons[0].href = "/web/img/map/icons/svg/few_group_of_projects_active.svg"
            asset.clusterIcons[0].size = [32, 32]
            asset.clusterIcons[0].offset = [-16, -16]
        } else if (assetKey === "visited") {
            asset.clusterIcons[0].href = "/web/img/map/icons/svg/few_group_of_projects_visited.svg"
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