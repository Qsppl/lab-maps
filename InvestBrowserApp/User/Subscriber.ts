import { IUser } from "../Browser/interfaces/IUser.js"
import { BaseUser } from "./BaseUser.js"

export class Subscriber extends BaseUser implements IUser {
    /** Пользователь не зарегистрирован */
    isGuest: boolean = false
    /** пользователь зарегистрирован, но не имеет подписки */
    isRegistrant: boolean = false
    /** Пользователь потратил дневной лимит просмотра проектов */
    isSpentDailyLimit: boolean = false
}