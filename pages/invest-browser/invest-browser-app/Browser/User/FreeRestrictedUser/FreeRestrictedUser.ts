"use strict"

import { BaseUser } from "../BaseUser.js"
import { FingerprintJSModule } from "./FingerprintJS/FingerprintJSModule.js"
import { IAgent } from "./FingerprintJS/IAgent.js"
import { ResultDto } from "./FingerprintJS/ResultDto.js"

var FingerprintJS: FingerprintJSModule | undefined

export abstract class FreeRestrictedUser extends BaseUser {
    protected readonly fingerprintjsCDN = 'https://cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@3/dist/fp.min.js'

    protected readonly checkGuestDailyLimitURL = 'https://investprojects.info/ajax/ymaps/test-fp'

    /** Пользователь потратил дневной лимит просмотра проектов */
    public readonly isSpentDailyLimit: Promise<boolean>

    constructor() {
        super()

        this.isSpentDailyLimit = this.identifyUserAgent().then(userAgentIdentity => {
            return this.getIsSpentDailyLimit(userAgentIdentity)
        }).catch((reason) => {
            console.warn(reason || "Ошибка загрузки данных")
            return true
        })
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
    protected async getIsSpentDailyLimit(userAgentIdentity: string): Promise<boolean> {
        const requestURL = `${this.checkGuestDailyLimitURL}?fpId=${userAgentIdentity}`

        const response: Response = await fetch(requestURL, { credentials: 'same-origin' })
        if (!response.ok) throw new Error("Ошибка сети!")
        if (response.status !== 200) throw new Error(`Неправильный запрос: ${requestURL}`)

        const data = await response.json()
        return !!(data.isMapLimited)
    }
}