type FingerprintJSType = {
    load({ delayFallback, debug, monitoring }: {
        delayFallback?: number
        debug?: boolean
        monitoring?: boolean
    }): Promise<Agent>
}

interface Agent {
    get(): Promise<GetResult>
}

interface GetResult {
    visitorId: string
    confidence: {
        score: number
        comment?: string
    }
    components: {
        [key: string]:
        { value: any, duration: number } |
        { error: object, duration: number }
    }
    version: string
}

var FingerprintJS: undefined | FingerprintJSType

abstract class InvestBrowserFreeRestrictedUser extends InvestBrowserBaseUser {
    private static fingerprintjsCDN = 'https://cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@3/dist/fp.min.js'

    private static checkGuestDailyLimitURL = '/ajax/ymaps/test-fp'

    /** Пользователь потратил дневной лимит просмотра проектов */
    readonly isSpentDailyLimit: Promise<boolean>

    constructor() {
        super()

        this.isSpentDailyLimit = InvestBrowserGuest.identifyUserAgent().then(userAgentIdentity => {
            return InvestBrowserGuest.getIsSpentDailyLimit(userAgentIdentity)
        })
    }

    /** Возвращает идентификатор посетителя вычисляемый по его user-agent'у */
    static async identifyUserAgent(): Promise<string> {
        // Чтобы идентифицировать пользователя нужна библиотека FingerprintJS
        await app.loadScriptPromise(InvestBrowserGuest.fingerprintjsCDN)

        if (!FingerprintJS) throw new Error("Невозможно выполнить метод пока не будет загружен скрипт FingerprintJS")

        const FingerprintJSAgent: Agent = await FingerprintJS.load({})
        const result: GetResult = await FingerprintJSAgent.get()

        return result.visitorId
    }

    /** Поверить, потратил ли посетитель дневной лимит на просмотр проектов */
    static async getIsSpentDailyLimit(userAgentIdentity: string): Promise<boolean> {
        const requestURL = `${InvestBrowserGuest.checkGuestDailyLimitURL}?fpId=${userAgentIdentity}`

        const response = await fetch(requestURL, { credentials: 'same-origin' })
        if (!response.ok) throw new Error("Ошибка сети!")
        if (response.status !== 200) throw new Error(`Неправильный запрос: ${requestURL}`)

        const data = await response.json()
        return !!(data.isMapLimited)
    }
}