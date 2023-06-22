import { IUser } from "../Browser/interfaces/IUser"
import { FreeRestrictedUser } from "./FreeRestrictedUser/FreeRestrictedUser"

export class Guest extends FreeRestrictedUser implements IUser {
    /** Пользователь не зарегистрирован */
    readonly isGuest = true

    /** пользователь зарегистрирован, но не имеет подписки */
    readonly isRegistrant = false
}