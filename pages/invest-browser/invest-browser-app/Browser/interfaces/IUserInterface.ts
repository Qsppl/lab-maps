"use strict"

import { IFocusEmmitersController } from "./IFocusEmmitersController.js"

export type ZoomRestrictionPresetKeys = "for-guest" | "for-registrant" | "for-subscriber"

export interface IUserInterface extends IFocusEmmitersController {
    /** Ограничить зум карты в соответствии с предустановленным в классе набором параметров */
    setZoomRestriction(presetKey: ZoomRestrictionPresetKeys): void
}