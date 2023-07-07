import { GroupsLoadingObjectManager, GroupsLoadingObjectManagerOptions } from "./dto/group.js";
export declare class GroupsManager {
    protected readonly _loadingManager: Promise<GroupsLoadingObjectManager>;
    constructor(urlTemplate: string, options?: GroupsLoadingObjectManagerOptions);
    private createLoaderManager;
    get loadingManager(): Promise<GroupsLoadingObjectManager>;
}
