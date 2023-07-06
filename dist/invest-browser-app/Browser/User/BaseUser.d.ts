import { IUser } from "../interfaces/IUser.js";
export declare abstract class BaseUser implements IUser {
    /** Текущая языковая локализация страницы */
    get languageLocale(): 'ru' | 'en';
    /** Количество просмотренных пользователем проектов */
    get numberOfViewedProjects(): number;
}
