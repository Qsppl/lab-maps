import { IUser } from "../Browser/interfaces/IUser.js"
import { FreeRestrictedUser } from "./FreeRestrictedUser/FreeRestrictedUser.js"

export class Registrant extends FreeRestrictedUser implements IUser {
    /** Пользователь не зарегистрирован */
    readonly isGuest = false

    /** пользователь зарегистрирован, но не имеет подписки */
    readonly isRegistrant = true
}