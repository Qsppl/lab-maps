import { unescape } from "./html-escape.js"

type UrlParamsValue = string | number | Array<UrlParamsValue> | undefined

export function readUrlParamsDataAsRawData<T extends { [k: string]: string | undefined }>(): T {
    const unescapedUrl = unescape(location.search)

    const parsedParams = [...new URLSearchParams(unescapedUrl)].map(([key, value]) => [key, value === "" ? undefined : value])

    return Object.fromEntries(parsedParams)
}

export function readUrlParamsData<T extends { [k: string]: UrlParamsValue }>(): T {
    const urlRawData = readUrlParamsDataAsRawData<{[k in keyof T]: string}>()

    const serializedParams = Object.entries(urlRawData).map(([key, value]) => { return [key, parseUrlValue(value)] })

    return Object.fromEntries(serializedParams)
}

function parseUrlValue(value: string): UrlParamsValue {
    if (value.split(",").length > 1) return value.split(",").map(parseUrlValue)

    return Number(value) || value
}