"use strict"

import { GroupsLoadingObjectManager } from "../LoadingObjectsManager/dto/group.js"
import { ProjectsLoadingObjectManager } from "../LoadingObjectsManager/dto/project.js"

export type ZoomRestrictionPresetKeys = "for-guest" | "for-registrant" | "for-subscriber"

export interface IUserInterface {
    /** Ограничить зум карты в соответствии с предустановленным в классе набором параметров */
    setZoomRestriction(presetKey: ZoomRestrictionPresetKeys): void

    addProjectsManager(loadingManager: ProjectsLoadingObjectManager): Promise<void>

    addGroupsManager(loadingManager: GroupsLoadingObjectManager): Promise<void>
}