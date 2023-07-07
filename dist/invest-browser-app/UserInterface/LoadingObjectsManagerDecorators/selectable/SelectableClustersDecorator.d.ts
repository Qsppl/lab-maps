/// <reference types="yandex-maps" />
import { ISelectableClusterJson, ISelectableClusterJsonOptions, ISelectableFeathureJson, ISelectableFeathureJsonOptions } from "../../../Browser/LoadingObjectsManager/dto/object.js";
import { ObjectOptionsAssetKey, ObjectOptionsModifierKey, BaseSelectableCollection } from "./BaseSelectableCollection.js";
type ClusterLayout = ymaps.IClassConstructor<ymaps.layout.templateBased.Base>;
type ChildFeathureOptions = ISelectableFeathureJsonOptions<{}>;
type ChildFeathure = ISelectableFeathureJson<any, ChildFeathureOptions, any>;
type ClusterOptions = ISelectableClusterJsonOptions<ymaps.ClusterPlacemarkOptions>;
type Cluster = ISelectableClusterJson<ymaps.geometry.json.Point, ClusterOptions, {}, ChildFeathure>;
type ClusterCollectionOptions = ymaps.objectManager.ClusterCollectionOptions<ChildFeathureOptions, ClusterOptions> & {
    __proto__?: ClusterCollectionOptions;
};
type ClusterCollection = ymaps.objectManager.ClusterCollection<ChildFeathureOptions, ChildFeathure, ymaps.LoadingObjectManager<any, any, any, any>, ClusterOptions, Cluster>;
/** Это декоратор коллекции кластеров класса LoadingObjectsManager - у него кластеры могут быть только Placemark'ами. Содержимое кластеров - любое. */
export declare class SelectableClustersDecorator extends BaseSelectableCollection<ClusterOptions, Cluster, ClusterCollectionOptions, ClusterCollection> {
    protected readonly _Layout: Promise<ClusterLayout>;
    protected readonly _LayoutHover: Promise<ClusterLayout>;
    protected getLayout(): Promise<ClusterLayout>;
    protected getLayoutHover(): Promise<ClusterLayout>;
    protected getDefaultAsset(): Promise<ClusterCollectionOptions>;
    constructor(collection: ClusterCollection);
    /** Восстанавливает актуальный набор опций объекта */
    protected resetObjectOptionsAsset(targetObject: Cluster, modifier?: ObjectOptionsModifierKey): void;
    /** Восстанавливает актуальный набор опций объекта не являющийся "select" */
    protected resetUnselectedObjectOptionsAsset(targetObject: Cluster, modifier?: ObjectOptionsModifierKey): void;
    protected createAsset(targetObject: Cluster, assetKey: ObjectOptionsAssetKey, modifier?: ObjectOptionsModifierKey): Promise<ClusterCollectionOptions>;
}
export {};
