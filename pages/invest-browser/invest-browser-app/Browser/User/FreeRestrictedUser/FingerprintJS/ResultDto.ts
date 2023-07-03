export type ResultDto = {
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