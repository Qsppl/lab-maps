import { IUser } from "./IUser.js";
export interface IFreeUserWithRestrictions extends IUser {
    /** Пользователь потратил дневной лимит просмотра проектов */
    isSpentDailyLimit: Promise<boolean>;
    fingerPrintIdentity: Promise<string>;
    investProjectIdentity: Promise<number>;
}
