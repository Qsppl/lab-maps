"use strict"

import { IAgent } from "./IAgent.js"

export type FingerprintJSModule = {
    load({ delayFallback, debug, monitoring }: {
        delayFallback?: number
        debug?: boolean
        monitoring?: boolean
    }): Promise<IAgent>
}