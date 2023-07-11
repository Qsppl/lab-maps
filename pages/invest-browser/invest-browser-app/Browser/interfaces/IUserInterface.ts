"use strict"

export type ZoomRestrictionPresetKeys = "for-guest" | "for-registrant" | "for-subscriber"

export interface IUserInterface {
    /** Ограничить зум карты в соответствии с предустановленным в классе набором параметров */
    setZoomRestriction(presetKey: ZoomRestrictionPresetKeys): void
}