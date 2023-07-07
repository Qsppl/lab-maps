"use strict"

import { IFreeUserWithRestrictions } from "../../interfaces/IFreeUserWithRestrictions.js"
import { BaseUser } from "../BaseUser.js"
import { FingerprintJSModule } from "./FingerprintJS/FingerprintJSModule.js"
import { IAgent } from "./FingerprintJS/IAgent.js"
import { ResultDto } from "./FingerprintJS/ResultDto.js"

var FingerprintJS: FingerprintJSModule | undefined

export abstract class FreeUserWithRestrictions extends BaseUser implements IFreeUserWithRestrictions {
    protected readonly fingerprintjsCDN = 'https://cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@3/dist/fp.min.js'

    protected readonly checkGuestDailyLimitURL = '/ajax/ymaps/test-fp'

    protected _isSpentDailyLimit: Promise<boolean>

    public readonly fingerPrintIdentity: Promise<string>

    public readonly investProjectIdentity: Promise<number>

    /** Пользователь потратил дневной лимит просмотра проектов */
    get isSpentDailyLimit(): Promise<boolean> {
        return this._isSpentDailyLimit
    }

    setIsSpentDailyLimit(value: boolean) {
        if (value) this._isSpentDailyLimit = Promise.resolve(true)
        else this._isSpentDailyLimit = Promise.resolve(false)
    }

    constructor() {
        super()

        // bind methood
        this.checkIsSpentDailyLimit = this.checkIsSpentDailyLimit.bind(this)

        this.fingerPrintIdentity = this.identifyUserAgent()

        const { investProjectIdentity, isSpentDailyLimit } = this.checkIsSpentDailyLimit(this.fingerPrintIdentity)

        this.investProjectIdentity = investProjectIdentity

        this._isSpentDailyLimit = isSpentDailyLimit
    }

    /** Возвращает идентификатор посетителя вычисляемый по его user-agent'у */
    protected async identifyUserAgent(): Promise<string> {
        // Чтобы идентифицировать пользователя нужна библиотека FingerprintJS
        await app.loadScriptPromise(this.fingerprintjsCDN)
        FingerprintJS = globalThis.FingerprintJS
        if (!FingerprintJS) throw new Error("Невозможно выполнить метод пока не будет загружен скрипт FingerprintJS")

        const FingerprintJSAgent: IAgent = await FingerprintJS.load({})
        const result: ResultDto = await FingerprintJSAgent.get()

        return result.visitorId
    }

    /** Поверить, потратил ли посетитель дневной лимит на просмотр проектов */
    protected checkIsSpentDailyLimit(userAgentIdentityPromise: Promise<string>) {
        const requestObject = userAgentIdentityPromise.then(userAgentIdentity => {
            const requestURL = `${this.checkGuestDailyLimitURL}?fpId=${userAgentIdentity}`

            return new Promise<string | globalThis.JQuery.jqXHR<any>>((resolve, reject) => {
                $.get(requestURL).done(resolve).fail(reject)
            })

        })

        const investProjectIdentity = requestObject.then((response: string | JQuery.jqXHR<any>): number => {
            if (typeof response !== "string") throw new Error("fail ajax fp!")
            return +JSON.parse(response).data.userFpId
        }).catch(reason => {
            console.warn(reason)
            return 0
        })

        const isSpentDailyLimit = requestObject.then((response: string | JQuery.jqXHR<any>): boolean => {
            if (typeof response !== "string") throw new Error("fail ajax fp!")
            return !!JSON.parse(response).data.isMapLimited
        }).catch(reason => {
            console.warn(reason)
            return false
        })

        return { investProjectIdentity, isSpentDailyLimit }
    }
}