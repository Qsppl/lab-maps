"use strict"

import { IUser } from "../interfaces/IUser.js"

export type TSypexgeoDTO = {
    ip: string
    city: TSypexgeoCityDTO
    country: TSypexgeoCountryDTO
    region: TSypexgeoRegionDTO
    error: any
    request: number
    created: string
    timestamp: number
}

type TSypexgeoCityDTO = {
    id: number
    lat: number
    lon: number
    name_ru: string
    name_en: string
    name_uk: string
    name_de: string
    name_fr: string
    name_it: string
    name_es: string
    name_pt: string
    okato: string
    vk: number
    population: number
    tel: string
    post: string
}

type TSypexgeoRegionDTO = {
    id: number
    lat: number
    lon: number
    name_ru: string
    name_en: string
    name_uk: string
    name_de: string
    name_fr: string
    name_it: string
    name_es: string
    name_pt: string
    okato: string
    vk: number
    iso: string
    timezone: string
    utc: number
    auto: string
}

type TSypexgeoCountryDTO = {
    id: number
    lat: number
    lon: number
    name_ru: string
    name_en: string
    name_uk: string
    name_de: string
    name_fr: string
    name_it: string
    name_es: string
    name_pt: string
    vk: number
    iso: string
    timezone: string
    continent: string
    area: number
    population: number
    capital_id: number
    capital_ru: string
    capital_en: string
    cur_code: string
    phone: string
    neighbours: string
    utc: number
}

export abstract class BaseUser implements IUser {
    constructor() {
        // костыль для обратной совместимости. заполняем cookies
        if (!this.restoreRegion()) this.onceLoadGeoData().then(geoData => {
            if (geoData && geoData.city.lat && geoData.city.lon) this.storeLocation([geoData.city.lat, geoData.city.lon])
            else app.setCookie('base_coords1', 'undefined')
        })

        // костыль для обратной совместимости. заполняем cookies
        if (!this.restoreRegion()) this.onceLoadGeoData().then(geoData => {
            if (!geoData || (!geoData.region.name_ru && !geoData.region.name_en)) {
                app.setCookie('region', 'undefined')
                return
            }

            const regionName = this.languageLocale === "ru"
                ? geoData.region.name_ru || geoData.region.name_en
                : geoData.region.name_en || geoData.region.name_ru

            this.storeRegion(regionName)
        })
    }

    /** Текущая языковая локализация страницы */
    public get languageLocale(): 'ru' | 'en' {
        let lang = document.documentElement.lang
        if (lang === 'ru' || lang === 'en') return lang

        console.warn("Элемент <html> ДОЛЖЕН иметь аттрибут lang и валидное значение языка, иначе выбирается язык по умолчанию: 'ru'")
        return 'ru'
    }

    public get location(): Promise<[number, number] | false> {
        const restoredLocation = this.restoreLocation()

        // return restored value
        if (restoredLocation) return Promise.resolve(restoredLocation)

        // or load data
        return this.onceLoadGeoData().then(geoData => {
            if (!geoData || !geoData.city.lat || !geoData.city.lon) {
                app.setCookie('base_coords1', 'undefined')
                return false
            }

            // and store data
            this.storeLocation([geoData.city.lat, geoData.city.lon])

            // and return loaded value
            return [geoData.city.lat, geoData.city.lon]
        })
    }

    public get region(): Promise<string | false> {
        const restoredLocation = this.restoreRegion()

        // return restored value
        if (restoredLocation) return Promise.resolve(restoredLocation)

        // or load data
        return this.onceLoadGeoData().then(geoData => {
            if (!geoData) {
                this.storeRegion('undefined')
                return false
            }

            const regionName = this.languageLocale === "ru"
                ? geoData.region.name_ru || geoData.region.name_en
                : geoData.region.name_en || geoData.region.name_ru

            // and store data
            this.storeRegion(regionName)

            // and return loaded value
            return regionName
        })
    }

    public get countryIso3166(): Promise<string | null> {
        return this.onceLoadGeoData()
            .then(result => result ? result.country.iso : null)
            .catch(reason => {
                console.warn(reason)
                return null
            })
    }

    public get regionIso3166(): Promise<string | null> {
        return this.onceLoadGeoData()
            .then(result => result ? result.region.iso : null)
            .catch(reason => {
                console.warn(reason)
                return null
            })
    }

    protected _geoData: Promise<TSypexgeoDTO | false> | undefined

    protected async onceLoadGeoData(): Promise<TSypexgeoDTO | false> {
        if (this._geoData) return this._geoData

        return this._geoData = this.loadGeoData()
    }

    protected async loadGeoData(): Promise<TSypexgeoDTO | false> {
        try {
            const response = await fetch("https://api.sypexgeo.net/4Rc1A/json/")

            if (!response.ok) {
                console.warn(response)
                throw Error()
            }

            return response.json()
        } catch (error: any) {
            console.warn(error)
            return false
        }
    }

    protected restoreLocation(): [number, number] | false {
        if (app.getCookie('base_coords1') === 'undefined') return false

        if (!app.getCookie('base_coords1')) return false

        return app.getCookie('base_coords1').split(',')
    }

    protected storeLocation([x, y]: [x: number, y: number]) {
        app.setCookie('base_coords1', `${x},${y}`)
    }

    protected restoreRegion(): string | false {
        if (app.getCookie('region') === 'undefined') return false

        if (!app.getCookie('region')) return false

        return app.getCookie('region')
    }

    protected storeRegion(region: string) {
        app.setCookie('region', region)
    }
}