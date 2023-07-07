import { GroupsLoadingObjectManager } from "./LoadingObjectsManager/dto/group.js";
import { ProjectFeathure, ProjectsLoadingObjectManager } from "./LoadingObjectsManager/dto/project.js";
import { Guest } from "./User/Guest.js";
import { Registrant } from "./User/Registrant.js";
import { Subscriber } from "./User/Subscriber.js";
import { IMap } from "./interfaces/IMap.js";
import { IUserInterface } from "./interfaces/IUserInterface.js";
/**
 * `Браузер Данных` Сайта Investprojects. Взаимодействует с `Пользовательским Интерфейсом` и `Картой`
 * - Реализует логику получения различных данных Сайта Investprojects.
 *
 * Дальше немного монолита:
 * - Реализует логику отображения данных на `Пользовательском Интерфейсе`.
 * - Реализует логику управления `Пользовательским Интерфейсом`.
 *
 * Дальше еще немного монолита:
 * - Реализует логику отображения данных на `Карте`
 */
export declare class Browser {
    /** ограничение просмотров проектов для незарегистрированных пользователей */
    private readonly limitOfProjectViews;
    private _map;
    private _userInterface;
    private _user;
    onLoadProject: (projectFeathure: ProjectFeathure) => void;
    get countOfViewedProjects(): number;
    set countOfViewedProjects(value: number);
    constructor(map: IMap, userInterface: IUserInterface, user: Guest | Registrant | Subscriber);
    addProjects(url?: string): Promise<ProjectsLoadingObjectManager>;
    addGroups(url?: string): Promise<GroupsLoadingObjectManager>;
    private blockForFreeUserWithRestrictions;
    private initForFreeUserWithRestrictions;
    private initForSubscriber;
    private restoreMapState;
    private isProjectInAnyFolder;
}
