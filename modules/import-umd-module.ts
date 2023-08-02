"use strict"

const importModulePromises = new Map<string, Promise<unknown>>()

export function importModule(url: string) {
    if (importModulePromises.has(url)) return importModulePromises.get(url)

    const promise = new Promise(function (resolve, reject) {
        var script = document.createElement("script")
        script.onload = resolve
        script.onerror = reject
        script.src = url
        document.getElementsByTagName("head")[0].appendChild(script)
    })

    importModulePromises.set(url, promise)

    return importModulePromises.get(url)
}

export async function importJQuery() {
    if (jQuery) return Promise.resolve(jQuery)

    await importModule('/modules-umd/jquery/jquery.js')

    return Promise.resolve(jQuery)
}

export async function importYandexMapsApi() {
    if (ymaps) {
        await ymaps.ready()
        return Promise.resolve(ymaps)
    }

    const lang = document.documentElement.lang
    await importModule(`https://api-maps.yandex.ru/2.1/?lang=${lang === 'ru' ? 'ru_RU' : 'en_GB'}`)
    await ymaps.ready()

    return Promise.resolve(ymaps)
}