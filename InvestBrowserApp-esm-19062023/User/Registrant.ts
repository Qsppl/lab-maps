import { IUser } from "../Browser/interfaces/IUser"
import { FreeRestrictedUser } from "./FreeRestrictedUser/FreeRestrictedUser"

export class Registrant extends FreeRestrictedUser implements IUser {
    /** Пользователь не зарегистрирован */
    readonly isGuest = false

    /** пользователь зарегистрирован, но не имеет подписки */
    readonly isRegistrant = true
}