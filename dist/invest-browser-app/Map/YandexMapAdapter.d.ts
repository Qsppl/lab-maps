/// <reference types="yandex-maps" />
import { IMap as IBrowserMap } from "../Browser/interfaces/IMap.js";
import { IMap as IUserInterfaceMap } from "../UserInterface/interfaces/IMap.js";
import { IPlace as IUserInterfacePlace } from "../UserInterface/interfaces/IPlace.js";
import { ProjectsLoadingObjectManager } from "../Browser/LoadingObjectsManager/dto/project.js";
import { GroupsLoadingObjectManager } from "../Browser/LoadingObjectsManager/dto/group.js";
/** Класс инкапсулирующий логику управления картой. */
export declare class YandexMapAdapter implements IBrowserMap, IUserInterfacePlace, IUserInterfaceMap {
    private readonly center;
    private readonly zoom;
    private readonly zoomRange;
    private readonly controls;
    private readonly searchControlParameters;
    private _onZoomInBoundsing?;
    private _onZoomOutBoundsing?;
    readonly _yandexMap: Promise<ymaps.Map>;
    constructor(containerElement: HTMLElement | string);
    panTo([x, y]: number[], zoom?: number): Promise<void>;
    setCenter([x, y]: number[], zoom?: number): Promise<void>;
    setZoom(zoom: number): Promise<void>;
    /**
     * @param minZoom zoomOut limit
     * @param maxZoom zoomIn limit
     */
    setZoomRange(minZoom: number, maxZoom: number): Promise<void>;
    addProjectsManager(loadingManager: ProjectsLoadingObjectManager): Promise<void>;
    addGroupsManager(loadingManager: GroupsLoadingObjectManager): Promise<void>;
    /** Обработчик выхода за пределы масштабирования карты. Сообщает пользователю о блокировке масштабирования, если она сработала. */
    private _callZoomBoundsingHandlers;
    set onZoomInBoundsing(callback: CallableFunction);
    set onZoomOutBoundsing(callback: CallableFunction);
    /** Обертка для типизации и асинхронности. */
    private _createMapInstance;
}
