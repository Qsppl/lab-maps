import { GroupsLoadingObjectManager } from "../Browser/LoadingObjectsManager/dto/group.js";
import { ProjectsLoadingObjectManager } from "../Browser/LoadingObjectsManager/dto/project.js";
import { IUserInterface, ZoomRestrictionPresetKeys } from "../Browser/interfaces/IUserInterface.js";
import { IMap } from "./interfaces/IMap.js";
import { IPlace } from "./interfaces/IPlace.js";
/** Класс реализующий работу пользовательского интерфейса управления браузером проектов Investproject */
export declare class UserInterface implements IUserInterface {
    private readonly restrictionPresets;
    private readonly localizationAssets;
    private readonly _map;
    private readonly _place;
    private readonly _localizationAsset;
    /** Модальное окно уведомляющее пользователя о том что у него есть какое-либо ограничение использования приложения */
    private readonly _modalRestrictionNotice;
    private _zoomInMessage;
    private _zoomOutMessage;
    private readonly SelectableCollectionsOfMap;
    constructor(map: IMap, place: IPlace, languageLocale: "ru" | "en");
    addProjectsManager(loadingManager: ProjectsLoadingObjectManager): Promise<void>;
    addGroupsManager(loadingManager: GroupsLoadingObjectManager): Promise<void>;
    setZoomRestriction(presetKey: ZoomRestrictionPresetKeys): void;
    private setMapZoomBoundsingNotions;
    private showWarningNotice;
    private showToast;
}
