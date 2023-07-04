"use strict"

export interface IUser {
    /** Текущая языковая локализация страницы */
    languageLocale: "en" | "ru"
    /** Пользователь не зарегистрирован */
    isGuest: boolean | Promise<boolean>
    /** пользователь зарегистрирован, но не имеет подписки */
    isRegistrant: boolean | Promise<boolean>
    /** Пользователь потратил дневной лимит просмотра проектов */
    isSpentDailyLimit: boolean | Promise<boolean>
    /** Количество просмотренных пользователем проектов */
    numberOfViewedProjects: number
}