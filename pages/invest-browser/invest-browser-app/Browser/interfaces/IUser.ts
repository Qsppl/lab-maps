"use strict"

import { TSypexgeoDTO } from "../User/BaseUser.js"

export interface IUser {
    /** Текущая языковая локализация страницы */
    languageLocale: "en" | "ru"

    /** @deprecated */
    location: Promise<false | [number, number]>

    /** @deprecated */
    region: Promise<string | false>

    countryIso3166: Promise<string | null>

    regionIso3166: Promise<string | null>
}