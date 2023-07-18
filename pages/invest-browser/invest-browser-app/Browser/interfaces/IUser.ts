"use strict"

export interface IUser {
    /** Текущая языковая локализация страницы */
    languageLocale: "en" | "ru"

    getLocation(): Promise<[number, number] | false>
}