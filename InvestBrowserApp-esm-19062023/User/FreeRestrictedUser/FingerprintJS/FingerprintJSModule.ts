import { IAgent } from "./IAgent"

export type FingerprintJSModule = {
    load({ delayFallback, debug, monitoring }: {
        delayFallback?: number
        debug?: boolean
        monitoring?: boolean
    }): Promise<IAgent>
}