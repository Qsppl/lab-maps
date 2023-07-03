export type ZoomRestrictionPresetKeys = "for-guest" | "for-registrant" | "for-subscriber"

export interface IUserInterface {
    /** Ограничить зум карты в соответствии с предустановленным в классе набором параметров */
    setZoomRestriction(presetKey: ZoomRestrictionPresetKeys): void

    /** Надо что-нибудь сделать эдакое, чтобы ничего не понятно и никак не узнать зачем. Это важно (наверное) */
    doSomething2(): void
}