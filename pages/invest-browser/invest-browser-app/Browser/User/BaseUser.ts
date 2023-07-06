"use strict"

import { IUser } from "../interfaces/IUser.js"

export abstract class BaseUser implements IUser {
    /** Текущая языковая локализация страницы */
    get languageLocale(): 'ru' | 'en' {
        let lang = document.documentElement.lang
        if (lang === 'ru' || lang === 'en') return lang

        console.warn("Элемент <html> ДОЛЖЕН иметь аттрибут lang и валидное значение языка, иначе выбирается язык по умолчанию: 'ru'")
        return 'ru'
    }

    /** Количество просмотренных пользователем проектов */
    get numberOfViewedProjects(): number {
        const storedValue = localStorage.getItem('gsp')
        return storedValue ? +(storedValue) : 0
    }
}