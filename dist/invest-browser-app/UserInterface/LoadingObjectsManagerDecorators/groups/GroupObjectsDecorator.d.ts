/// <reference types="yandex-maps" />
import { GroupFeathure, GroupFeathureOptions } from "../../../Browser/LoadingObjectsManager/dto/group.js";
import { ObjectOptionsAssetKey, ObjectOptionsModifierKey } from "../selectable/BaseSelectableCollection.js";
import { SelectableObjectsDecorator } from "../selectable/SelectableObjectsDecorator.js";
type ObjectCollectionOptions = ymaps.objectManager.ObjectCollectionOptions<GroupFeathureOptions, ymaps.PlacemarkOptions> & {
    __proto__?: ObjectCollectionOptions | undefined;
};
export declare class GroupObjectsDecorator extends SelectableObjectsDecorator {
    protected getDefaultAsset(): Promise<ObjectCollectionOptions>;
    protected createAsset(targetObject: GroupFeathure, assetKey: ObjectOptionsAssetKey, modifier?: ObjectOptionsModifierKey): Promise<ObjectCollectionOptions>;
}
export {};
