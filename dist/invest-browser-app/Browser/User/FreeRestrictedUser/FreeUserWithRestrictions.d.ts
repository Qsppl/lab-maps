import { IFreeUserWithRestrictions } from "../../interfaces/IFreeUserWithRestrictions.js";
import { BaseUser } from "../BaseUser.js";
export declare abstract class FreeUserWithRestrictions extends BaseUser implements IFreeUserWithRestrictions {
    protected readonly fingerprintjsCDN = "https://cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@3/dist/fp.min.js";
    protected readonly checkGuestDailyLimitURL = "/ajax/ymaps/test-fp";
    protected _isSpentDailyLimit: Promise<boolean>;
    readonly fingerPrintIdentity: Promise<string>;
    readonly investProjectIdentity: Promise<number>;
    /** Пользователь потратил дневной лимит просмотра проектов */
    get isSpentDailyLimit(): Promise<boolean>;
    setIsSpentDailyLimit(value: boolean): void;
    constructor();
    /** Возвращает идентификатор посетителя вычисляемый по его user-agent'у */
    protected identifyUserAgent(): Promise<string>;
    /** Поверить, потратил ли посетитель дневной лимит на просмотр проектов */
    protected checkIsSpentDailyLimit(userAgentIdentityPromise: Promise<string>): {
        investProjectIdentity: Promise<number>;
        isSpentDailyLimit: Promise<boolean>;
    };
}
