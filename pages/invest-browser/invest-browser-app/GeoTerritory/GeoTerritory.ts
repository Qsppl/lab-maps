"use strict"

const ymaps = globalThis.ymaps

type GeoTerritoryJsonOptions = any

type GeoTerritoryJsonProperties = {
    hintContent: string

    iso3166: string

    level: string

    name: string

    neighbors: string[]

    parents: { delta: number, iso3166: string }[]
}

type GeoTerritoryJson = ymaps.geometry.json.IFeatureJson<
    ymaps.geometry.json.polygon,
    GeoTerritoryJsonOptions,
    GeoTerritoryJsonProperties
>

type GeoTerritoryCollectionJson = ymaps.geometry.json.IFeatureCollectionJson<GeoTerritoryJson>

export class GeoTerritory {
    public static readonly allowedCountryIso3166 = ['RU', 'UA', 'BY', 'KZ']
    protected readonly languageLocale: "ru" | "en" = "ru"

    public readonly countryIso3166: string

    public readonly regionIso3166?: string

    public readonly name: Promise<string>

    public readonly geoObject: Promise<ymaps.GeoObject<ymaps.IGeometry, {}, ymaps.IGeometryEditor, {}, GeoTerritoryJsonProperties, ymaps.GeoObjectOptions<{}, {}>, {}>>

    constructor(countryIso3166: 'RU' | 'UA' | 'BY' | 'KZ', regionIso3166?: string, languageLocale?: "ru" | "en") {
        this.countryIso3166 = countryIso3166
        this.regionIso3166 = regionIso3166
        if (languageLocale) this.languageLocale = languageLocale

        const territoryFeathure = regionIso3166 ? this.findRegionByIso(countryIso3166, regionIso3166) : this.findCountryByIso(countryIso3166)

        this.geoObject = territoryFeathure.then(territoryFeathure => new ymaps.GeoObject(territoryFeathure))
        this.name = territoryFeathure.then(territoryFeathure => territoryFeathure.properties.name)
    }

    protected async findRegionByIso(countryIso3166: string, regionIso3166: string) {
        await ymaps.ready()

        const countryTerritories: GeoTerritoryCollectionJson = await ymaps.borders.load(countryIso3166, { lang: this.languageLocale })

        return countryTerritories.features.find(feathure => feathure.properties.iso3166 === regionIso3166)
    }

    protected async findCountryByIso(countryIso3166: string) {
        await ymaps.ready()

        const countries: GeoTerritoryCollectionJson = await ymaps.borders.load('001', { lang: this.languageLocale })

        return countries.features.find(feathure => feathure.properties.iso3166 === countryIso3166)
    }

    static checkIsCountryIsoAllowed(countryIso: string) {
        return this.allowedCountryIso3166.includes(countryIso)
    }
}