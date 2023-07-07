/// <reference types="yandex-maps" />
import { GroupFeathure, GroupFeathureOptions } from "../../../Browser/LoadingObjectsManager/dto/group.js";
import { ISelectableClusterJson, ISelectableClusterJsonOptions } from "../../../Browser/LoadingObjectsManager/dto/object.js";
import { ObjectOptionsAssetKey, ObjectOptionsModifierKey } from "../selectable/BaseSelectableCollection.js";
import { SelectableClustersDecorator } from "../selectable/SelectableClustersDecorator.js";
type ClusterOptions = ISelectableClusterJsonOptions<ymaps.ClusterPlacemarkOptions>;
type Cluster = ISelectableClusterJson<ymaps.geometry.json.Point, ClusterOptions, {}, GroupFeathure>;
type ClusterCollectionOptions = ymaps.objectManager.ClusterCollectionOptions<GroupFeathureOptions, ClusterOptions> & {
    __proto__?: ClusterCollectionOptions;
};
export declare class GroupClustersDecorator extends SelectableClustersDecorator {
    protected getDefaultAsset(): Promise<ClusterCollectionOptions>;
    protected createAsset(targetObject: Cluster, assetKey: ObjectOptionsAssetKey, modifier?: ObjectOptionsModifierKey): Promise<ClusterCollectionOptions>;
}
export {};
