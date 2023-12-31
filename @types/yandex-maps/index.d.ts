// Type definitions for non-npm package yandex-maps 2.1
// Project: https://github.com/Delagen/typings-yandex-maps
// Definitions by: Delagen <https://github.com/Delagen>
//                 gastwork13 <https://github.com/gastwork13>
//                 kaskar2008 <https://github.com/kaskar2008>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.4

/**
 * Пример преобразования: "editor", "captionWidth" => "editorCaptionWidth"
 * 
 * @example // Пример использования:
 * type MyClassOptionsClusteerPrefix = {
 *    [K in keyof MyClassOptions as CamelCasePrefix<"clusteer", K>]: MyClassOptions[K]
 * }
 */
type CamelCasePrefix<Prefix extends string, String extends string> = `${Prefix}${Capitalize<String>}`

/**
 * Переназначение полей типа объекта.
 * 
 * @example
 * type MySomeOptions = {
 *      width: number,
 *      height: number
 * }
 * 
 * type MyOptionsOfWindow = RemapType<"element", MySomeOptions>
 * 
 * // after conversion:
 * MyOptionsOfWindow = {
 *      elementWidth: number,
 *      elementHeight: number
 * }
 */
type RemapType<Prefix extends string, Type> = {
    [Key in keyof Type as Key extends string ? CamelCasePrefix<Prefix, Key> : never]: Type[Key]
}

/** Два числа описывающих координату на карте */
type coordinate = [number, number]

namespace ymaps {
    interface IClassConstructor<T> {
        new(): T;
    }

    type ControlSingleKey = "fullscreenControl" | "geolocationControl" | "routeEditor" | "rulerControl" | "searchControl" | "trafficControl" | "typeSelector" | "zoomControl";
    type ControlSetKey = "smallMapDefaultSet" | "mediumMapDefaultSet" | "largeMapDefaultSet" | "default";
    type ControlKey = ControlSingleKey | ControlSetKey;

    type OverlayKey =
        "default#placemark" | "default#pin" | "default#circle" | "default#rectangle" | "default#polyline" | "default#polygon" |
        "hotspot#placemark" | "hotspot#circle" | "hotspot#rectangle" | "hotspot#polyline" | "hotspot#polygon" | "html#balloon" | "html#hint" |
        "html#placemark" | "html#rectangle" |
        string | IClassConstructor<IOverlay> | ((geometry: IPixelLineStringGeometry,
            data: IDataManager | object,
            options: object) => Promise<string | IClassConstructor<IOverlay>>);
    type InteractivityModelKey = "default#opaque" | "default#geoObject" | "default#layer" | "default#transparent" | "default#silent" | string;

    type IconLayoutKey = 'default#image' | 'default#imageWithContent' | string;
    type ClusterLayoutKey = 'cluster#balloonTwoColumns' | 'cluster#balloonCarousel' | 'cluster#balloonAccordion' | string;
    type ClusterContentLayoutKey = 'cluster#balloonTwoColumnsItemContent' | 'cluster#balloonCarouselItemContent' | 'cluster#balloonAccordionItemContent' | string;

    type EventMap = GlobalEventHandlersEventMap;

    namespace behavior {
        class DblClickZoom implements IBehavior {
            constructor(options?: IDblClickZoomOptions);

            events: IEventManager;
            options: IOptionManager;

            disable(): void;

            enable(): void;

            isEnabled(): boolean;

            getParent(): IControlParent | null;

            setParent(parent: IControlParent): this;
        }

        type IDblClickZoomOptions = IMapMarginOptions & {
            centering?: boolean | undefined;
            duration?: number | undefined;
        }

        class Drag implements IBehavior {
            constructor(options?: IDragOptions)

            events: IEventManager;
            options: IOptionManager;

            disable(): void;

            enable(): void;

            isEnabled(): boolean;

            getParent(): null | IControlParent;

            setParent(parent: IControlParent): this;
        }

        type IDragOptions = {
            actionCursor?: string | undefined;
            cursor?: string | undefined;
            inertia?: boolean | undefined;
            inertiaDuration?: number | undefined;
            tremor?: number | undefined;
        }

        class LeftMouseButtonMagnifier implements IBehavior {
            constructor(options?: ILeftMouseButtonMagnifierOptions)

            events: IEventManager;
            options: IOptionManager;

            disable(): void;

            enable(): void;

            isEnabled(): boolean;

            getParent(): null | IControlParent;

            setParent(parent: IControlParent): this;
        }

        type ILeftMouseButtonMagnifierOptions = {
            actionCursor?: string | undefined;
            cursor?: string | undefined;
            duration?: number | undefined;
        }

        class MultiTouch implements IBehavior {
            constructor(options?: IMultiTouchOptions)

            events: IEventManager;
            options: IOptionManager;

            disable(): void;

            enable(): void;

            isEnabled(): boolean;

            getParent(): null | IControlParent;

            setParent(parent: IControlParent): this;
        }

        type IMultiTouchOptions = {
            tremor?: number | undefined;
        }

        class RightMouseButtonMagnifier implements IBehavior {
            constructor(options?: IRightMouseButtonMagnifierOptions)

            events: IEventManager;
            options: IOptionManager;

            disable(): void;

            enable(): void;

            isEnabled(): boolean;

            getParent(): null | IControlParent;

            setParent(parent: IControlParent): this;
        }

        type IRightMouseButtonMagnifierOptions = {
            actionCursor?: string | undefined;
            duration?: number | undefined;
        }

        class RouteEditor implements IBehavior {
            events: IEventManager;
            options: IOptionManager;

            disable(): void;

            enable(): void;

            isEnabled(): boolean;

            getParent(): null | IControlParent;

            setParent(parent: IControlParent): this;

            getRoute(): router.Route;

            getState(): string;

            setState(state: string | null): void;
        }

        class Ruler implements IBehavior {
            constructor(options?: IRulerOptions)

            events: IEventManager;
            options: IOptionManager;

            disable(): void;

            enable(): void;

            isEnabled(): boolean;

            getParent(): null | IControlParent;

            setParent(parent: IControlParent): this;

            close(): boolean;

            getState(): string;

            setState(state: string | null): void;
        }

        type IRulerOptions = {
            balloonAutoPan?: boolean | undefined;
        }

        class ScrollZoom implements IBehavior {
            constructor(options?: IScrollZoomOptions)

            events: IEventManager;
            options: IOptionManager;

            disable(): void;

            enable(): void;

            isEnabled(): boolean;

            getParent(): null | IControlParent;

            setParent(parent: IControlParent): this;
        }

        type IScrollZoomOptions = {
            maximumDelta?: number | undefined;
            speed?: number | undefined;
        }

        const storage: util.Storage;
    }

    namespace clusterer {
        class Balloon implements IBalloonManager<Clusterer> {
            constructor(clusterer: Clusterer);

            events: IEventManager;

            autoPan(): Promise<Clusterer>;

            close(force?: boolean): Promise<Clusterer>;

            destroy(): void;

            getData(): object | null;

            getOptions(): IOptionManager | null;

            getOverlay(): Promise<IOverlay | null>;

            getOverlaySync(): IOverlay | null;

            getPosition(): number[] | null;

            isOpen(): boolean;

            open(position?: number[], data?: object | string | HTMLElement, options?: object): Promise<Clusterer>;

            setData(data: object | string | HTMLElement): Promise<Clusterer>;

            setOptions(options: object): Promise<Clusterer>;

            setPosition(position: number[]): Promise<Clusterer>;
        }

        class Hint implements IHintManager<Clusterer> {
            constructor(clusterer: Clusterer);

            events: IEventManager;

            close(force?: boolean): Promise<Clusterer>;

            destroy(): void;

            getData(): object | null;

            getOptions(): IOptionManager | null;

            getOverlay(): Promise<IOverlay | null>;

            getOverlaySync(): IOverlay | null;

            getPosition(): number[] | null;

            isOpen(): boolean;

            open(position?: number[], data?: object | string | HTMLElement, options?: object): Promise<Clusterer>;

            setData(data: object | string | HTMLElement): Promise<Clusterer>;

            setOptions(options: object): Promise<Clusterer>;

            setPosition(position: number[]): Promise<Clusterer>;
        }
    }

    namespace collection {
        class Item<
            Options extends ymaps.IOptionManagerData,
            ParentOptions extends ymaps.IOptionManagerData
        > implements IChildOnMap, ICustomizable<Options, ParentOptions>, IEventEmitter, IParentOnMap {
            constructor(options?: Options);

            events: IEventManager;
            options: IOptionManager<Options, ParentOptions>;

            getParent(): null | IControlParent;

            setParent(parent: IControlParent): this;

            getMap(): Map;

            onAddToMap(map: Map): void;

            onRemoveFromMap(oldMap: Map): void;
        }
    }

    namespace control {
        class Button implements ICustomizable, ISelectableControl {
            constructor(parameters?: IButtonParameters | string);

            options: IOptionManager;
            events: IEventManager;
            data: data.Manager;
            state: data.Manager;

            deselect(): void;

            disable(): void;

            enable(): void;

            isEnabled(): boolean;

            isSelected(): boolean;

            select(): void;

            getParent(): null | IControlParent;

            setParent(parent: IControlParent): this;
        }

        type IBaseButtonParametersOptions = {
            adjustMapMargin?: boolean | undefined;
            float?: "none" | "left" | "right" | undefined;
            floatIndex?: number | undefined;
            layout?: IClassConstructor<ISelectableControlLayout> | string | undefined;
            maxWidth?: number[][] | number[] | number | undefined;
            position?: {
                bottom?: number | string | undefined;
                left?: number | string | undefined;
                right?: number | string | undefined;
                top?: number | string | undefined;
            } | undefined;
            visible?: boolean | undefined;
        }

        interface IButtonParameters {
            data?: {
                content?: string | undefined;
                image?: string | undefined;
                title?: string | undefined;
            } | undefined;
            options?: IBaseButtonParametersOptions & {
                selectOnClick?: boolean | undefined;
                size?: "auto" | "small" | "medium" | "large" | undefined;
            } | undefined;
            state?: {
                enabled?: boolean | undefined;
                selected?: boolean | undefined;
            } | undefined;
        }

        class FullscreenControl extends Button {
            constructor(parameters?: IFullscreenControlParameters);

            enterFullscreen(): void;

            exitFullscreen(): void;
        }

        interface IFullscreenControlParameters {
            data?: {
                title?: string | undefined;
            } | undefined;
            options?: IBaseButtonParametersOptions & {
                collapseOnBlur?: boolean | undefined;
                expandOnClick?: boolean | undefined;
                popupFloat?: "left" | "right" | undefined;
            } | undefined;
            state?: {
                expanded?: boolean | undefined;
            } | undefined;
        }

        class GeolocationControl extends Button {
            constructor(parameters?: IGeolocationControlParameters);
        }

        interface IGeolocationControlParameters extends IButtonParameters {
            data?: {
                image?: string | undefined;
                title?: string | undefined;
            } | undefined;
            options?: IBaseButtonParametersOptions | undefined;
        }

        class ListBox implements ICollection, IControl, ICustomizable {
            constructor(parameters?: IListBoxParameters);

            events: IEventManager;
            options: IOptionManager;
            data: data.Manager;
            state: data.Manager;

            add(object: object): this;

            getIterator(): IIterator;

            remove(object: object): this;

            getParent(): null | IControlParent;

            setParent(parent: IControlParent): this;
        }

        interface IListBoxParameters extends IButtonParameters {
            options?: IBaseButtonParametersOptions & {
                noPlacemark?: boolean | undefined;
            } | undefined;
        }

        class ListBoxItem implements ICustomizable, ISelectableControl {
            constructor(parameters?: IListBoxItemParameters);

            options: IOptionManager;
            events: IEventManager;
            data: data.Manager;
            state: data.Manager;

            deselect(): void;

            disable(): void;

            enable(): void;

            isEnabled(): boolean;

            isSelected(): boolean;

            select(): void;

            getParent(): null | IControlParent;

            setParent(parent: IControlParent): this;

            getMap(): Map;
        }

        interface IListBoxItemParameters {
            data?: {
                content?: string | undefined;
            } | undefined;
            options?: {
                layout?: string | IClassConstructor<ISelectableControlLayout> | undefined;
                selectableLayout?: string | IClassConstructor<ISelectableControlLayout> | undefined;
                selectOnClick?: boolean | undefined;
                separatorLayout?: string | IClassConstructor<ISelectableControlLayout> | undefined;
                type?: "selectable" | "separator" | undefined;
                visible?: boolean | undefined;
            } | undefined;
            state?: {
                selected?: boolean | undefined;
            } | undefined;
        }

        class Manager {
            constructor(map: Map, controls?: Array<string | IControl>, options?: IManagerOptions);

            events: event.Manager;
            options: option.Manager;
            state: data.Manager;

            add(control: IControl | ControlKey, options?: IManagerControlOptions): this;

            each(callback: (control: IControl) => void, context?: object): this;

            get(index: number | string): IControl | null;

            getChildElement(control: IControl): Promise<HTMLElement>;

            getContainer(): HTMLElement;

            getMap(): Map;

            indexOf(childToFind: IControl | string): number;

            remove(control: IControl | string): this;
        }

        type IManagerOptions = {
            margin?: number | undefined;
            pane?: IPane | undefined;
            states?: string[] | undefined;
        }

        type IManagerControlOptions = {
            float?: "none" | "left" | "right" | undefined;
            floatIndex?: number | undefined;
            position?: {
                bottom?: number | string | undefined;
                left?: number | string | undefined;
                right?: number | string | undefined;
                top?: number | string | undefined;
            } | undefined;
        }

        class RouteButton implements IControl, ICustomizable {
            constructor(parameters?: IRouteButtonParameters);

            events: IEventManager;
            options: IOptionManager;
            routePanel: IRoutePanel;

            getParent(): null | IControlParent;

            setParent(parent: IControlParent): this;
        }

        interface IRouteButtonParameters {
            options?: {
                adjustMapMargin?: boolean | undefined;
                collapseOnBlur?: boolean | undefined;
                float?: "none" | "left" | "right" | undefined;
                floatIndex?: number | undefined;
                popupAnimate?: boolean | undefined;
                popupFloat?: "auto" | "left" | "right" | undefined;
                popupWidth?: string | undefined;
                position?: {
                    bottom?: number | string | undefined;
                    left?: number | string | undefined;
                    right?: number | string | undefined;
                    top?: number | string | undefined;
                } | undefined;
                size?: "auto" | "small" | "medium" | "large" | undefined;
                visible?: boolean | undefined;
            } | undefined;
            state?: {
                expanded?: boolean | undefined;
            } | undefined;
        }

        class RouteEditor extends Button {
            constructor(parameters?: IRouteEditorParameters);

            getRoute(): router.Route;
        }

        interface IRouteEditorParameters {
            data?: {
                image?: string | undefined;
                title?: string | undefined;
            } | undefined;
            options?: IBaseButtonParametersOptions | undefined;
            state?: {} | undefined;
        }

        class RoutePanel implements IControl, ICustomizable {
            constructor(parameters?: IRoutePanelParameters);

            events: IEventManager;
            options: IOptionManager;
            routePanel: IRoutePanel;

            getParent(): null | IControlParent;

            setParent(parent: IControlParent): this;
        }

        interface IRoutePanelParameters {
            options?: {
                autofocus?: boolean;
                float?: "none" | "left" | "right";
                floatIndex?: number;
                maxWidth?: string;
                position?: {
                    bottom?: number | string;
                    left?: number | string;
                    right?: number | string;
                    top?: number | string;
                } ;
                showHeader?: boolean;
                title?: string;
                visible?: boolean;
            };
            state?: {};
        }

        class RulerControl extends Button {
            constructor(parameters?: IRulerControlParameters);
        }

        interface IRulerControlParameters {
            data?: {} | undefined;
            options?: {
                adjustMapMargin?: boolean | undefined;
                position?: {
                    bottom?: number | string | undefined;
                    left?: number | string | undefined;
                    right?: number | string | undefined;
                    top?: number | string | undefined;
                } | undefined;
                scaleLine?: boolean | undefined;
                visible?: boolean | undefined;
            } | undefined;
            state?: {} | undefined;
        }

        class SearchControl implements IControl, ICustomizable {
            constructor(parameters?: ISearchControlParameters);

            events: IEventManager;
            options: IOptionManager;
            state: data.Manager;

            getParent(): null | IControlParent;

            setParent(parent: IControlParent): this;

            clear(): void;

            getMap(): Map;

            getRequestString(): string;

            getResponseMetaData(): object;

            getResult(index: number): Promise<object>;

            getResultsArray(): object[];

            getResultsCount(): number;

            getSelectedIndex(): number;

            hideResult(): void;

            search(request: string): Promise<void>;

            showResult(index: number): this;
        }

        interface ISearchControlParameters {
            data?: {} | undefined;
            options?: {
                adjustMapMargin?: boolean | undefined;
                boundedBy?: number[][] | undefined;
                fitMaxWidth?: boolean | undefined;
                float?: "none" | "left" | "right" | undefined;
                floatIndex?: number | undefined;
                formLayout?: string | IClassConstructor<ILayout> | undefined;
                kind?: "house" | "street" | "metro" | "district" | "locality" | undefined;
                layout?: string | IClassConstructor<ISearchControlLayout> | undefined;
                maxWidth?: number[][] | number[] | number | undefined;
                noCentering?: boolean | undefined;
                noPlacemark?: boolean | undefined;
                noPopup?: boolean | undefined;
                noSelect?: boolean | undefined;
                noSuggestPanel?: boolean | undefined;
                placeholderContent?: string | undefined;
                popupItemLayout?: string | IClassConstructor<ILayout> | undefined;
                popupLayout?: string | IClassConstructor<ILayout> | undefined;
                position?: {
                    bottom?: number | string | undefined;
                    left?: number | string | undefined;
                    right?: number | string | undefined;
                    top?: number | string | undefined;
                } | undefined;
                provider?: IGeocodeProvider | "yandex#map" | "yandex#search" | undefined;
                searchCoordOrder?: "latlong" | "longlat" | undefined;
                size?: "auto" | "small" | "medium" | "large" | undefined;
                strictBounds?: boolean | undefined;
                suppressYandexSearch?: boolean | undefined;
                useMapBounds?: boolean | undefined;
                zoomMargin?: number | undefined;
                visible?: boolean | undefined;
            } | undefined;
            state?: {} | undefined;
        }

        class ZoomControl implements IControl, ICustomizable {
            constructor(parameters?: IZoomControlParameters);

            events: IEventManager;
            options: IOptionManager;
            state: data.Manager;

            getParent(): null | IControlParent;

            setParent(parent: IControlParent): this;

            clear(): void;

            getMap(): Map;

            getRequestString(): string;

            getResponseMetaData(): object;

            getResult(index: number): Promise<object>;

            getResultsArray(): object[];

            getResultsCount(): number;

            getSelectedIndex(): number;

            hideResult(): void;

            search(request: string): Promise<void>;

            showResult(index: number): this;
        }

        interface IZoomControlParameters {
            options?: {
                adjustMapMargin?: boolean | undefined,
                position?: {
                    top?: number | string | 'auto' | undefined;
                    right?: number | string | 'auto' | undefined;
                    bottom?: number | string | 'auto' | undefined;
                    left?: number | string | 'auto' | undefined;
                } | undefined,
                size?: 'small' | 'large' | 'auto' | undefined,
                visible?: boolean | undefined,
                zoomDuration?: number | undefined,
                zoomStep?: number | undefined
            } | undefined;
        }

        class TypeSelector extends ListBox {
            constructor(parameters?: ITypeSelectorParameters);
        }

        interface ITypeSelectorParameters {
            options?: {
                panoramasItemMode: 'on' | 'off' | 'ifMercator';
            } | undefined;
        }
    }

    namespace data {
        class Manager<Data extends IDataManagerData> implements IDataManager<Data>, IFreezable {
            constructor(data?: Data)

            events: IEventManager

            get<K extends keyof Data, D>(path: K, defaultValue: D): Data[K] | D

            getAll(): Data

            set<K extends keyof Data>(path: K, value: Data[K]): this
            set<K extends keyof Data>({ }: { K: Data[K] }): this

            setAll<K extends keyof Data>(path: K, value: Data[K]): this
            setAll<K extends keyof Data>({ }: { K: Data[K] }): this

            unset<K extends keyof Data>(path: K | string): this

            unsetAll(): this

            freeze(): IFreezable

            isFrozen(): boolean

            unfreeze(): IFreezable

            add(types: string[][] | string[] | string, callback: (event: (object | IEvent)) => void, context?: object, priority?: number): this

            getParent(): IEventManager | null

            group(): IEventGroup

            remove(types: string[][] | string[] | string, callback: (event: (object | IEvent)) => void, context?: object, priority?: number): this

            setParent(parent: IEventManager | null): this

            fire(type: string, eventObject: object | IEvent): this
        }
    }

    namespace domEvent {
        interface manager {
            add<K extends keyof EventMap>(htmlElement: HTMLElement | Document, types: K, callback: (event: EventMap[K]) => void, context?: object, capture?: boolean): this;
            add(htmlElement: HTMLElement | Document, types: string[] | string, callback: (event: any) => void, context?: object, capture?: boolean): this;

            group(htmlElement: HTMLElement | Document, capture?: boolean): event.Group;

            remove(htmlElement: HTMLElement | Document, types: string[] | string, callback: ((event: any) => void) | string, context?: object, capture?: boolean): this;
        }
    }

    namespace event {
        class Group implements IEventGroup {
            events: IEventManager;

            add<K extends keyof EventMap>(types: K, callback: (event: EventMap[K] | IEvent) => void, context?: object, priority?: number): this;
            add(types: string[][] | string[] | string, callback: (event: (object | IEvent)) => void, context?: object, priority?: number): this;

            remove(types: string[][] | string[] | string, callback: (event: (object | IEvent)) => void, context?: object, priority?: number): this;

            removeAll(): this;

            getLength(): number;
        }

        class Manager<TargetGeometry extends {} = {}> implements IEventManager<TargetGeometry> {
            constructor(params?: { context?: object | undefined; controllers?: IEventWorkflowController[] | undefined; parent?: IEventManager | undefined });

            add<K extends keyof EventMap>(types: K, callback: (event: (IEvent<EventMap[K], TargetGeometry>)) => void, context?: object, priority?: number): this;
            add(types: string[][] | string[] | string, callback: (event: (IEvent<{}, TargetGeometry>)) => void, context?: object, priority?: number): this;

            getParent(): IEventManager | null;

            group(): IEventGroup;

            remove(types: string[][] | string[] | string, callback: (event: (object | IEvent)) => void, context?: object, priority?: number): this;

            setParent(parent: IEventManager | null): this;

            fire(type: string, eventObject: object | IEvent): this;

            createEventObject(type: string, event: object, target: object): Event;

            once(types: string[][] | string[] | string, callback: (event: IEvent) => any, context?: object, priority?: number): this;
        }

        class Mapper implements IEventTrigger {
            constructor(targetEventManager: IEventManager, mappingTable: Record<string, ((event: IEvent) => IEvent | null) | boolean>);

            fire(type: string, eventObject?: object | IEvent): this;
        }
    }

    namespace geometry {
        namespace base {
            class LineString implements IBaseLineStringGeometry {
                events: IEventManager;

                static fromEncodedCoordinates(encodedCoordinates: string): geometry.LineString;

                static toEncodedCoordinates(geometry: geometry.LineString): string;

                getBounds(): number[][] | null;

                getType(): string;

                get(index: number): number[];

                getChildGeometry(index: number): IPointGeometryAccess;

                getClosest(anchorPosition: number[]): object;

                getCoordinates(): number[][];

                getLength(): number;

                insert(index: number, coordinates: coordinate[]): ILineStringGeometryAccess;

                remove(index: number): number[];

                remove(types: string[][] | string[] | string, callback: (event: (object | IEvent)) => void, context?: object, priority?: number): this;

                set(index: number, coordinates: coordinate): ILineStringGeometryAccess;

                setCoordinates(coordinates: coordinate[]): ILineStringGeometryAccess;

                splice(index: number, length: number): coordinate[];

                freeze(): IFreezable;

                isFrozen(): boolean;

                unfreeze(): IFreezable;

                add(types: string[][] | string[] | string, callback: (event: (object | IEvent)) => void, context?: object, priority?: number): this;

                getParent(): object | null;

                group(): IEventGroup;

                setParent(parent: IEventManager | null): this;

                fire(type: string, eventObject: object | IEvent): this;
            }

            class Point implements IBasePointGeometry {
                events: IEventManager;

                getBounds(): number[][] | null;

                getType(): string;

                getCoordinates(): number[] | null;

                setCoordinates(coordinates: coordinate | null): this;
            }

            class Polygon implements IBasePointGeometry {
                constructor(coordinates?: coordinate[][], fillRule?: 'evenOdd' | 'nonZero');

                events: IEventManager;

                static fromEncodedCoordinates(encodedCoordinates: string): Polygon;
                static toEncodedCoordinates(geometry: Polygon): string;

                contains(position: number[]): boolean;

                freeze(): IFreezable;

                get(index: number): number[][];

                getBounds(): number[][] | null;

                getChildGeometry(index: number): ILinearRingGeometryAccess;

                getClosest(anchorPosition: number[]): object;

                getCoordinates(): number[] | null;

                getFillRule(): 'evenOdd' | 'nonZero';

                getLength(): number;

                getType(): string;

                insert(index: number, path: number[][]): IPolygonGeometryAccess;

                isFrozen(): boolean;

                remove(index: number): ILinearRingGeometryAccess;

                set(index: number, path: number[][]): IPolygonGeometryAccess;

                setCoordinates(coordinates: coordinate | null): this;

                setFillRule(fillRule: 'evenOdd' | 'nonZero'): IPolygonGeometryAccess;

                splice(index: number, number: number): ILinearRingGeometryAccess[];

                unfreeze(): IFreezable;
            }
        }

        /** Опции геометрии. */
        type CircleOptions = {
            /**
             * Включает отображение с использованием геодезических линий.
             * @default false
             */
            geodesic?: false | undefined

            /**
             * Метод расчета пиксельных координат отображения в зацикленных проекциях. Опция может принимать одно из следующих значений:
             * - jumpy - отображение располагается как можно ближе к центру области показа карты и может скачкообразно перемещается во время движения карты;
             * - static - отображение всегда располагается в начальном мире и не перемещается при движении карты.
             * @default "jumpy"
             */
            pixelRendering?: "jumpy" | "static" | undefined

            /** Проекция. */
            projection?: IProjection | undefined;
        }

        /** Геометрия "Круг". */
        class Circle implements ICircleGeometry {
            /**
             * @param coordinates Координаты центра круга.
             * @param radius Радиус круга в метрах.
             * @param options Опции геометрии.
             */
            constructor(coordinates?: coordinate | null | undefined, radius?: number | undefined, options?: CircleOptions | undefined)

            events: IEventManager;

            options: IOptionManager;

            getType(): "Circle"

            contains(position: number[]): boolean;
    
            getClosest(anchorPosition: number[]): object;
    
            getCoordinates(): number[] | null;
    
            getRadius(): number;
    
            setCoordinates(coordinates: coordinate | null): this;
    
            setRadius(radius: number): this;

            freeze(): IFreezable;
    
            isFrozen(): boolean;
    
            unfreeze(): IFreezable;

            getMap(): Map | null;
    
            getPixelGeometry(options?: object): IPixelGeometry;
    
            setMap(map: Map): void;

            getBounds(): number[][] | null;

            getType(): string;
        }
        
        /** GeoJSON like rfc7946. */
        namespace json {
            /** @private */
            type Types = "FeatureCollection" | "Feature" | "Cluster" | "Point" | "LineString" | "Polygon" | "Circle" | "Rectangle" | string
    
            /** @private */
            type IObjectJson = {
                type: Types
            }
    
            /**
             * Обертка для объекта на карте
             * 
             * При создании уточните типы содержимого:
             * 
             * - `GeometryJson` - Тип данных описывающих геометрию объедка, примеры: `circle`/`lineString`/`Point`/`polygon`/`rectangle`/собственная реализация `IGeometryJson` или расширение одного из типов `YmapsGeometryJsonIndex`. По этому типу данных `objectManager` создаст на карте объект и после заполнит его следующими данными: `Properties`, `Options`
             * - `Properties` - свойства, которыми `objectManager` заполнит созданный объект типа `GeometryJson`.
             * - `Options` - опции по умолчанию, которые `objectManager` присвоит созданному объекту типа `GeometryJson`.
             * 
             * `objectManager` при создании объектов на карте по стандартным типам `GeometryJson` эмитирует конструкторы стандартных классов расширяющих `GeoObject`, таким образом тип 'a' ассоции руется с классом 'AClass' и принимает в качестве `Properties` и `Options` данные типа `AClassProperties` и `AClassOptions` соответственно:
             * - тип `circle` ассоциируется с {@link ymaps.Circle} и принимает {@link ymaps.CircleProperties}, {@link ymaps.CircleOptions}
             * - тип `lineString` ассоциируется с {@link ymaps.Polyline} и принимает {@link ymaps.PolylineProperties}, {@link ymaps.PolylineOptions}
             * - тип `Point` ассоциируется с {@link ymaps.Placemark} и принимает {@link ymaps.PlacemarkProperties}, {@link ymaps.PlacemarkOptions}
             * - тип `polygon` ассоциируется с {@link ymaps.Polygon} и принимает {@link ymaps.PolygonProperties}, {@link ymaps.PolygonOptions}
             * - тип `rectangle` ассоциируется с {@link ymaps.Rectangle} и принимает {@link ymaps.RectangleProperties}, {@link ymaps.RectangleOptions}
             */
            type IFeatureJson<
                GeometryJson extends YmapsGeometryJsonIndex | IGeometryJson,
                Options extends IOptionManagerData,
                Properties extends IDataManagerData
            > = IObjectJson & {
                type: "Feature"
                id: string
                geometry: GeometryJson
                properties: Properties
                options: Options
            }
    
            /** Коллекция оберток {@link IFeatureJson} */
            type IFeatureCollectionJson<Feature extends IFeatureJson<any, any, any>> = IObjectJson & {
                type: "FeatureCollection"
                features: Feature[]
            }
    
            /** Минимальные данные описывающие геометрию карты. */
            type IGeometryJson = IObjectJson & {
                type: Omit<Types, "FeatureCollection" | "Feature">
                /** Описание типов не завершено */
                coordinates: any
            }
        
            /**
             * Отдельный тип обертки объекта на карте. В отличие от базового IFeatureJson, эта обертка ссылается не только на собственный объект, но еще и на группу других оберток объектов карты.
             * 
             * {@inheritdoc {@link IFeatureJson}}
             */
            type IClusterJson<
                GeometryJson extends YmapsGeometryJsonIndex | IGeometryJson,
                Options extends IOptionManagerData,
                Properties extends IDataManagerData,
                ChildFeathureJson extends IFeatureJson<any, any, any>
            > = IObjectJson & {
                type: "Cluster"
                id: string
                geometry: GeometryJson
                options: Options
        
                /** Количество меток в кластере */
                number: number
        
                /**
                 * Данные кластера. Представляет собой объект, содержащий поле geoObjects – массив меток, входящих в кластер. Кроме того, объект properties может содержать другие поля, заданные разработчиком (например, balloonContent).
                 * @todo неизвестное свойство
                 */
                properties: {
                    geoObjects: ChildFeathureJson[]
                    iconContent: number
                    [k: string]: any
                } & Properties
            }

            /** Перечисление реализаций типа IGeometryJson библиотеки YandexMap */
            type YmapsGeometryJsonIndex = circle | lineString | Point | polygon | rectangle
            
            /** Объект, описывающий JSON-представление геометрии "Круг". */
            type circle = IGeometryJson & {
                /** Идентификатор типа геометрии "Круг". Всегда должен принимать значение "Circle". */
                type: "Circle",
                /** Координаты центра круга. */
                coordinates: coordinate | null,
                /** Радиус круга. */
                radius: number
            }

            /** Объект, описывающий JSON-представление геометрии "Ломаная линия". */
            type lineString = IGeometryJson & {
                /** Идентификатор типа геометрии "Ломаная линия". Всегда должен принимать значение "LineString". */
                type: "LineString",
                /** Координаты ломаной линии. */
                coordinates: coordinate[]
            }

            /** Объект, описывающий JSON-представление геометрии "Точка". */
            type Point = IGeometryJson & {
                /** Идентификатор типа геометрии. */
                type: "Point",
                coordinates: coordinate
            }

            /** Объект, описывающий JSON-представление геометрии "Многоугольник". */
            type polygon = IGeometryJson & {
                /** Идентификатор типа геометрии. */
                type: "Polygon",
                /** Координаты многоугольника. */
                coordinates: coordinate[][],
                /**
                 * Идентификатор алгоритма заливки многоугольника. Может принимать одно из двух значений:
                 * - evenOdd - алгоритм, определяющий, находится ли точка в области заполнения, путем рисования луча от этой точки до бесконечности в любом направлении и подсчета количества сегментов контура в пределах заданной фигуры, которые пересекает этот луч. Если это число нечетное, точка находится внутри; если четное, точка находится снаружи.
                 * - nonZero - алгоритм, определяющий, находится ли точка в области заполнения, путем рисования луча от этой точки до бесконечности в любом направлении и проверки точек, в которых сегмент фигуры пересекает этот луч. Начиная с нуля, добавляется единица каждый раз, когда сегмент пересекает луч слева направо, и вычитается единица каждый раз, когда сегмент пересекает луч справа налево. Если после подсчета пересечений результат равен нулю, точка находится снаружи контура. В противном случае она находится внутри.
                 */
                fillRule: "evenOdd" | "nonZero"
            }

            /** Объект, описывающий JSON-представление геометрии "Прямоугольник". */
            type rectangle = IGeometryJson & {
                /** Идентификатор типа геометрии "Прямоугольник". Всегда должен принимать значение "Rectangle". */
                type: "Rectangle",
                /** Координаты двух противоположных углов прямоугольника. */
                coordinates: [coordinate, coordinate]
            }
        }

        type LineStringOptions = {
            coordRendering?: "shortestPath" | "straightPath" | undefined;
            geodesic?: boolean | undefined;
            pixelRendering?: "jumpy" | "static" | undefined;
            projection?: IProjection | undefined;
            simplification?: boolean | undefined;
        }

        class LineString implements ILineStringGeometry {
            constructor(coordinates?: coordinate[], options?: LineStringOptions);

            events: IEventManager;
            options: IOptionManager;

            static fromEncodedCoordinates(encodedCoordinates: string): LineString;
            static toEncodedCoordinates(geometry: LineString): string;

            getMap(): Map | null;

            getPixelGeometry(options?: object): IPixelGeometry;

            setMap(map: Map): void;

            getBounds(): number[][] | null;

            getType(): string;

            get(index: number): number[];

            getChildGeometry(index: number): IPointGeometryAccess;

            getClosest(anchorPosition: number[]): object;

            getCoordinates(): number[][];

            getLength(): number;

            insert(index: number, coordinates: coordinate[]): ILineStringGeometryAccess;

            remove(index: number): number[];

            remove(types: string[][] | string[] | string, callback: (event: (object | IEvent)) => void, context?: object, priority?: number): this;

            set(index: number, coordinates: coordinate): ILineStringGeometryAccess;

            setCoordinates(coordinates: coordinate[]): ILineStringGeometryAccess;

            splice(index: number, length: number): number[][];

            freeze(): IFreezable;

            isFrozen(): boolean;

            unfreeze(): IFreezable;

            add(types: string[][] | string[] | string, callback: (event: (object | IEvent)) => void, context?: object, priority?: number): this;

            getParent(): object | null;

            group(): IEventGroup;

            setParent(parent: IEventManager | null): this;

            fire(type: string, eventObject: object | IEvent): this;
        }

        namespace pixel {
            class Circle implements IPixelCircleGeometry {
                constructor(
                    coordinates: coordinate | null,
                    radius: number,
                    metaData?: object
                );

                events: IEventManager;

                equals(geometry: IPixelGeometry): boolean;

                getBounds(): number[][] | null;

                getCoordinates(): number[];

                getMetaData(): object;

                getRadius(): number;

                getType(): string;

                scale(factor: number): IPixelGeometry;

                shift(offset: number[]): IPixelGeometry;
            }

            class LineString implements IPixelLineStringGeometry {
                constructor(coordinates: coordinate[], metaData?: object);

                events: IEventManager;

                equals(geometry: IPixelGeometry): boolean;

                getBounds(): number[][] | null;

                getClosest(anchorPosition: number[]): object;

                getCoordinates(): number[][];

                getLength(): number;

                getMetaData(): object;

                getType(): string;

                scale(factor: number): IPixelGeometry;

                shift(offset: number[]): IPixelGeometry;
            }

            class MultiLineString implements IPixelMultiLineGeometry {
                constructor(coordinates: coordinate[][], metaData?: object);

                events: IEventManager;

                equals(geometry: IPixelGeometry): boolean;

                getBounds(): number[][] | null;

                getClosest(anchorPosition: number[]): object;

                getCoordinates(): number[][][];

                getLength(): number;

                getMetaData(): object;

                getType(): string;

                scale(factor: number): IPixelGeometry;

                shift(offset: number[]): IPixelGeometry;
            }

            class MultiPolygon implements IPixelMultiPolygonGeometry {
                constructor(
                    coordinates: coordinate[][][],
                    fillRule: 'evenOdd' | 'nonZero',
                    metaData?: object
                );

                events: IEventManager;

                contains(position: number[]): boolean;

                equals(geometry: IPixelGeometry): boolean;

                getBounds(): number[][] | null;

                getClosest(anchorPosition: number[]): object;

                getCoordinates(): number[][][][];

                getFillRule(): 'evenOdd' | 'nonZero';

                getLength(): number;

                getMetaData(): object;

                getType(): string;

                scale(factor: number): IPixelGeometry;

                shift(offset: number[]): IPixelGeometry;
            }

            class Point implements IPixelPointGeometry {
                constructor(position: number[] | null, metaData?: object);

                events: IEventManager;

                equals(geometry: IPixelGeometry): boolean;

                getBounds(): number[][] | null;

                getCoordinates(): number[];

                getMetaData(): object;

                getType(): string;

                scale(factor: number): IPixelGeometry;

                shift(offset: number[]): IPixelGeometry;
            }

            class Polygon implements IPixelPolygonGeometry {
                constructor( coordinates: coordinate[][], fillRule: 'evenOdd' | 'nonZero', metaData?: object );

                events: IEventManager;

                contains(position: number[]): boolean;

                equals(geometry: IPixelGeometry): boolean;

                getBounds(): number[][] | null;

                getClosest(anchorPosition: number[]): object;

                getCoordinates(): number[][][];

                getFillRule(): 'evenOdd' | 'nonZero';

                getLength(): number;

                getMetaData(): object;

                getType(): string;

                scale(factor: number): IPixelGeometry;

                shift(offset: number[]): IPixelGeometry;
            }

            class Rectangle implements IPixelRectangleGeometry {
                constructor(coordinates: coordinate[] | null, metaData?: object);

                events: IEventManager;

                equals(geometry: IPixelGeometry): boolean;

                getBounds(): number[][] | null;

                getClosest(anchorPosition: number[]): object;

                getCoordinates(): number[][];

                getMetaData(): object;

                getType(): string;

                scale(factor: number): IPixelGeometry;

                shift(offset: number[]): IPixelGeometry;
            }
        }

        /** Опции геометрии. */
        type PointOptions = {
            /**
             * Метод расчета пиксельных координат отображения в зацикленных проекциях. Опция может принимать одно из следующих значений:
             * - jumpy - отображение располагается как можно ближе к центру области показа карты и может скачкообразно перемещается во время движения карты;
             * - static - отображение всегда располагается в начальном мире и не перемещается при движении карты.
             * @default "jumpy"
             */
            pixelRendering?: "jumpy" | "static" | undefined

            /** Проекция. */
            projection?: IProjection | undefined;
        }

        class Point implements IPointGeometry {
            constructor(coordinates?: coordinate | null, options?: PointOptions | undefined);

            options: IOptionManager;
            events: IEventManager;

            getMap(): Map | null;

            getPixelGeometry(options?: object): IPixelGeometry;

            setMap(map: Map): void;

            getBounds(): number[][] | null;

            getType(): string;

            getCoordinates(): number[] | null;

            setCoordinates(coordinates: coordinate | null): this;
        }

        /** Опции геометрии. */
        type PolygonOptions = {
            /**
             * Строковый идентификатор, определяющий алгоритм пересчета координат геометрии в пиксельные координаты. Может принимать одно из двух значений:
             * - shortestPath - алгоритм, учитывающий зацикленность проекции по осям, и формирующий пиксельные координаты так, чтобы расстояние между двумя соседними точками было минимальным;
             * - straightPath - алгоритм, не учитывающий зацикленность проекции;
             * @default "shortestPath"
             */
            coordRendering?: "shortestPath" | "straightPath" | undefined

            /**
             * Включает отображение с использованием геодезических линий.
             * @default false
             */
            geodesic?: boolean | undefined

            /**
             * Метод расчета пиксельных координат отображения в зацикленных проекциях. Опция может принимать одно из следующих значений:
             * - jumpy - отображение располагается как можно ближе к центру области показа карты и может скачкообразно перемещается во время движения карты;
             * - static - отображение всегда располагается в начальном мире и не перемещается при движении карты.
             * @default "jumpy"
             */
            pixelRendering?: "jumpy" | "static" | undefined

            /** Проекция. */
            projection?: IProjection | undefined

            /**
             * Включает симплификацию при рендеринге пиксельной геометрии.
             * @default true
             */
            simplification?: boolean | undefined
        }

        class Polygon implements IPolygonGeometry {
            constructor(coordinates?: coordinate[][], fillRule?: 'evenOdd' | 'nonZero', options?: object);

            events: IEventManager;
            options: IOptionManager;

            static fromEncodedCoordinates(encodedCoordinates: string): Polygon;
            static toEncodedCoordinates(geometry: Polygon): string;

            add(types: string[][] | string[] | string, callback: (event: (object | IEvent)) => void, context?: object, priority?: number): this;

            contains(position: number[]): boolean;

            fire(type: string, eventObject: object | IEvent): this;

            freeze(): IFreezable;

            get(index: number): number[][];

            getBounds(): number[][] | null;

            getChildGeometry(index: number): ILinearRingGeometryAccess;

            getClosest(anchorPosition: number[]): object;

            getCoordinates(): number[][][];

            getFillRule(): 'evenOdd' | 'nonZero';

            getLength(): number;

            getMap(): Map | null;

            getParent(): object | null;

            getPixelGeometry(options?: object): IPixelGeometry;

            getType(): string;

            group(): IEventGroup;

            insert(index: number, path: number[][]): IPolygonGeometryAccess;

            isFrozen(): boolean;

            remove(index: number): ILinearRingGeometryAccess;

            set(index: number, path: number[][]): IPolygonGeometryAccess;

            setCoordinates(coordinates: coordinate[][]): IPolygonGeometryAccess;

            setFillRule(fillRule: 'evenOdd' | 'nonZero'): IPolygonGeometryAccess;

            setMap(map: Map): void;

            setParent(parent: object | null): this;

            splice(index: number, number: number): ILinearRingGeometryAccess[];

            unfreeze(): IFreezable;
        }

        type RectangleOptions = {
            /**
             * Строковый идентификатор, определяющий алгоритм пересчета координат геометрии в пиксельные координаты. Для геометрии "Прямоугольник" может принимать одно из трех значений:
             * - shortestPath - алгоритм, учитывающий зацикленность проекции по осям, и формирующий пиксельные координаты так, чтобы расстояние между противоположными углами было минимальным;
             * - straightPath - алгоритм, не учитывающий зацикленность проекции;
             * - boundsPath - алгоритм, трактующий координаты углов прямоугольника, как координаты соответственно нижнего и верхнего углов ограничивающей области. При расчете диагонали по зацикленным осям проекции всегда выбирается направление обхода против часовой стрелки.
             */
            coordRendering?: "shortestPath" | "straightPath" | "boundsPath" | undefined

            /**
             * Включает отображение с использованием геодезических линий.
             * @default false
             */
            geodesic?: boolean | undefined

            /**
             * Метод расчета пиксельных координат отображения в зацикленных проекциях. Опция может принимать одно из следующих значений:
             * - jumpy - отображение располагается как можно ближе к центру области показа карты и может скачкообразно перемещается во время движения карты;
             * - static - отображение всегда располагается в начальном мире и не перемещается при движении карты.
             * @default "jumpy"
             */
            pixelRendering?: "jumpy" | "static" | undefined

            /** Проекция. */
            projection?: IProjection | undefined
        }

        class Rectangle implements IRectangleGeometry {
            constructor(coordinates?: [coordinate, coordinate] | null | undefined, options?: RectangleOptions | undefined)

            events: IEventManager;

            options: IOptionManager;

            getType(): "Rectangle"

            getMap(): Map | null;
    
            getPixelGeometry(options?: object): IPixelGeometry;
    
            setMap(map: Map): void;

            getBounds(): number[][] | null;
    
            getType(): string;

            contains(position: coordinate): boolean

            getClosest(anchorPosition: coordinate): object

            getCoordinates(): [coordinate, coordinate]

            setCoordinates(coordinates: [coordinate, coordinate]): IRectangleGeometryAccess

            freeze(): IFreezable;

            isFrozen(): boolean;

            unfreeze(): IFreezable;
        }
    }

    namespace geometryEditor {
        class Circle implements IGeometryEditor {
            constructor(geometry: ICircleGeometry, options?: object);

            events: IEventManager;
            geometry: IGeometry;
            options: IOptionManager;
            state: IDataManager;

            startDrawing(): vow.Promise;

            startEditing(): void;

            stopDrawing(): vow.Promise;

            stopEditing(): void;
        }

        /** Опции редактора геометрии. */
        type LineStringOptions = {
            /** Обработчик двойного щелчка по вершине. Принимает ссылку на модель редактируемой вершины. По умолчанию, обработчик определен функцией, удаляющей соответствующую вершину. */
            dblClickHandler?: Function | undefined

            /**
             * Курсор мыши в режиме добавления новых вершин.
             * @default "arrow"
             */
            drawingCursor?: boolean | undefined

            /**
             * Разрешает ставить точки поверх объектов карты в режиме добавления новых вершин.
             * @default true
             */
            drawOver?: boolean | undefined

            /**
             * Позволяет использовать для промежуточных меток опции с постфиксами, привязанными к текущему состоянию метки. Доступны следующие постфиксы:
             * - Hover — опции с данным постфиксом применяются при наведении на метку указателя мыши;
             * - Drag — опции с данным постфиксом применяются при перетаскивании метки.
             * 
             * Примеры таких опций: edgeLayoutHover, edgeIconImageSizeActive, edgeIconImageShapeHover и т. д. Если вам не требуется менять опции промежуточных меток в зависимости от их состояния, то нужно отключить данную опцию.
             * @default true
             */
            edgeInteractiveOptions?: boolean | undefined

            /** Класс макета для промежуточных меток. */
            edgeLayout?: Function | undefined

            /**
             * Максимальное допустимое число вершин в ломаной линии.
             * @default Infinity
             */
            maxPoints?: number | undefined

            /**
             * Диспетчер контекстного меню, открывающегося при щелчке по вершине. Принимает два аргумента:
             * - массив объектов, описывающих пункты контекстного меню для этой вершины;
             * - ссылку на модель редактируемой вершины.
             * 
             * Диспетчер может изменять данные в переданном массиве. Должен возвращать массив объектов, описывающих пункты контекстного меню.
             */
            menuManager?: Function | undefined

            /**
             * Минимально допустимое число вершин полилинии.
             * @default 0
             */
            minPoints?: number | undefined

            /**
             * Включается режим автоматического передвижения карты при перетаскивании вершины на границе.
             * @default true
             */
            useAutoPanInDrawing?: boolean | undefined

            /**
             * Нужно ли учитывать отступы карты в режиме рисования.
             * @default true
             */
            useMapMarginInDrawing?: boolean | undefined

            /**
             * Позволяет использовать для меток вершин опции с постфиксами, привязанными к текущему состоянию вершины. Доступны следующие постфиксы:
             * - Hover — опции с данным постфиксом применяются при наведении на вершину метки указателя мыши;
             * - Drag — опции с данным постфиксом применяются при перетаскивании вершины.
             * - Active — опции с данным постфиксом применяются когда для вершины открыто контекстное меню.
             * 
             * Примеры таких опций: vertexLayoutHover, vertexIconImageSizeActive, vertexIconImageShapeHover и т. д. Если вам не требуется менять опции меток вершин в зависимости от их состояния, то нужно отключить данную опцию.
             * @default true
             */
            vertexInteractiveOptions?: boolean | undefined

            /** Класс макета для меток на вершинах ломаной линии. */
            vertexLayout?: Function | undefined
        }

        type LineStringOptionsWithEditorPrefix = { [K in keyof LineStringOptions as CamelCasePrefix<"editor", K>]: LineStringOptions[K] }

        class LineString implements IGeometryEditor {
            constructor(geometry: ILineStringGeometry, options?: LineStringOptions);

            events: IEventManager;
            geometry: IGeometry;
            options: IOptionManager;
            state: IDataManager;

            getModel(): vow.Promise;

            getModelSync(): model.RootLineString | null;

            getView(): vow.Promise;

            getViewSync(): view.Path | null;

            startDrawing(): vow.Promise;

            startEditing(): vow.Promise;

            startFraming(): vow.Promise;

            stopDrawing(): void;

            stopEditing(): void;

            stopFraming(): void;
        }

        namespace model {
            class ChildLinearRing extends ChildLineString {}

            class ChildLineString implements IGeometryEditorChildModel {
                editor: IGeometryEditor;
                events: IEventManager;
                geometry: IBaseGeometry;

                destroy(): void;

                getAllVerticesNumber(): number;

                getEdgeModels(): Edge[];

                getIndex(): number;

                getParent(): IGeometryEditorModel;

                getPixels(): number[];

                getVertexModels(): ChildVertex[];

                setIndex(index: number): void;

                setPixels(pixels: number[]): void;

                spliceVertices(start: number, deleteCount: number): number[][];
            }

            class ChildVertex implements IGeometryEditorChildModel {
                editor: IGeometryEditor;
                events: IEventManager;
                geometry: IBaseGeometry;

                destroy(): void;

                getAllVerticesNumber(): number;

                getIndex(): number;

                getNextVertex(): ChildVertex | null;

                getParent(): IGeometryEditorModel;

                getPixels(): number[];

                getPrevVertex(): ChildVertex | null;

                setGlobalPixels(pixels: number[]): void;

                setIndex(index: number): void;

                setNextVertex(nextVertex: ChildVertex): void;

                setPixels(pixels: number[]): void;

                setPrevVertex(prevVertex: ChildVertex): void;
            }

            class Edge implements IGeometryEditorRootModel {
                events: IEventManager;

                destroy(): void;

                getNextVertex(): ChildVertex | null;

                getPixels(): number[];

                getPrevVertex(): ChildVertex | null;

                setNextVertex(nextVertex: ChildVertex): void;

                setPrevVertex(prevVertex: ChildVertex): void;
            }

            class EdgeGeometry implements IGeometry {
                events: IEventManager;
                options: IOptionManager;

                getBounds(): number[][] | null;

                getMap(): Map | null;

                getPixelGeometry(options?: object): IPixelGeometry;

                getType(): string;

                setMap(map: Map): void;
            }

            class RootLineString implements IGeometryEditorRootModel {
                events: IEventManager;

                destroy(): void;

                getAllVerticesNumber(): number;

                getPixels(): number[];

                getVertexModels(): ChildVertex[];

                spliceVertices(start: number, deleteCount: number): number[][];
            }

            class RootPolygon implements IGeometryEditorRootModel {
                events: IEventManager;

                destroy(): void;

                getAllVerticesNumber(): number;

                getPathModels(): ChildLinearRing[];

                getPixels(): number[];

                splicePaths(start: number, deleteCount: number): number[][];
            }
        }

        /** Опции редактора геометрии. */
        type PointOptions = {
            /** Обработчик двойного щелчка по вершине. Принимает ссылку на модель редактируемой вершины. По умолчанию, обработчик определен функцией, удаляющей соответствующую вершину. */
            dblClickHandler?: Function | undefined

            /**
             * Курсор мыши в режиме рисования.
             * @default "arrow"
             */
            drawingCursor?: boolean | undefined

            /**
             * Разрешает ставить точки поверх объектов карты в режиме рисования.
             * @default true
             */
            drawOver?: boolean | undefined
        }

        type PointOptionsWithEditorPrefix = {
            [K in keyof PointOptions as CamelCasePrefix<"editor", K>]: PointOptions[K]
        }

        class Point implements IGeometryEditor {
            constructor(geometry: IPolygonGeometry, options?: PointOptions)
            events: IEventManager;
            geometry: IGeometry;
            options: IOptionManager;
            state: IDataManager;

            startDrawing(): vow.Promise;

            startEditing(): void;

            stopDrawing(): vow.Promise;

            stopEditing(): void;
        }

        /** Опции редактора геометрии. */
        type PolygonOptions = {
            /** Обработчик двойного щелчка по вершине. Принимает ссылку на модель редактируемой вершины. По умолчанию, обработчик определен функцией, удаляющей соответствующую вершину. */
            dblClickHandler?: Function | undefined

            /**
             * Курсор мыши в режиме добавления новых вершин.
             * @default "arrow"
             */
            drawingCursor?: boolean | undefined

            /**
             * Разрешает ставить точки поверх объектов карты в режиме добавления новых вершин.
             * @default true
             */
            drawOver?: boolean | undefined

            /**
             * Позволяет использовать для промежуточных меток опции с постфиксами, привязанными к текущему состоянию метки. Доступны следующие постфиксы:
             * - Hover — опции с данным постфиксом применяются при наведении на метку указателя мыши;
             * - Drag — опции с данным постфиксом применяются при перетаскивании метки.
             * 
             * Примеры таких опций: edgeLayoutHover, edgeIconImageSizeActive, edgeIconImageShapeHover и т. д. Если вам не требуется менять опции промежуточных меток в зависимости от их состояния, то нужно отключить данную опцию.
             * @default true
             */
            edgeInteractiveOptions?: boolean | undefined

            /** Класс макета для промежуточных меток. */
            edgeLayout?: Function | undefined

            /**
             * Максимально допустимое число вершин в многоугольнике.
             * @default Infinity
             */
            maxPoints?: number | undefined

            /**
             * Диспетчер контекстного меню, открывающегося при щелчке по вершине. Принимает два аргумента:
             * - массив объектов, описывающих пункты контекстного меню для этой вершины;
             * - ссылку на модель редактируемой вершины.
             * 
             * Диспетчер может изменять данные в переданном массиве. Должен возвращать массив объектов, описывающих пункты контекстного меню.
             */
            menuManager?: Function | undefined

            /**
             * Минимальное допустимое число вершин в многоугольнике.
             * @default 0
             */
            minPoints?: number | undefined

            /**
             * Включается режим автоматического передвижения карты при перетаскивании вершины на границе.
             * @default true
             */
            useAutoPanInDrawing?: boolean | undefined

            /**
             * Нужно ли учитывать отступы карты в режиме рисования.
             * @default true
             */
            useMapMarginInDrawing?: boolean | undefined

            /**
             * Позволяет использовать для меток вершин опции с постфиксами, привязанными к текущему состоянию вершины. Доступны следующие постфиксы:
             * - Hover — опции с данным постфиксом применяются при наведении на вершину метки указателя мыши;
             * - Drag — опции с данным постфиксом применяются при перетаскивании вершины.
             * - Active — опции с данным постфиксом применяются когда для вершины открыто контекстное меню.
             * 
             * Примеры таких опций: vertexLayoutHover, vertexIconImageSizeActive, vertexIconImageShapeHover и т. д. Если вам не требуется менять опции меток вершин в зависимости от их состояния, то нужно отключить данную опцию.
             * @default true
             */
            vertexInteractiveOptions?: boolean | undefined

            /** Класс макета для меток на вершинах многоугольника. */
            vertexLayout?: Function | undefined
        }

        type PolygonOptionsWithEditorPrefix = {
            [K in keyof PolygonOptions as CamelCasePrefix<"editor", K>]: PolygonOptions[K]
        }

        class Polygon implements IGeometryEditor {
            constructor(geometry: IPolygonGeometry, options?: PolygonOptions)

            events: IEventManager;
            geometry: IGeometry;
            options: IOptionManager;
            state: IDataManager;

            getModel(): vow.Promise;

            getModelSync(): model.RootPolygon | null;

            getView(): vow.Promise;

            getViewSync(): view.MultiPath | null;

            startDrawing(): vow.Promise;

            startEditing(): vow.Promise;

            startFraming(): vow.Promise;

            stopDrawing(): void;

            stopEditing(): void;

            stopFraming(): void;
        }

        namespace view {
            class Edge {
                getPlacemark(): GeoObject;
            }

            class MultiPath {
                getEdgePlacemarks(): GeoObjectCollection;

                getPathViews(): Path[];

                getVertexPlacemarks(): GeoObjectCollection;
            }

            class Path {
                getEdgePlacemarks(): GeoObjectCollection;

                getEdgeViews(): Edge[];

                getVertexPlacemarks(): GeoObjectCollection;

                getVertexViews(): Vertex[];
            }

            class Vertex {
                getPlacemark(): GeoObject;
            }
        }
    }

    namespace geoObject {
        class Balloon implements IBalloonManager<GeoObject> {
            constructor(geoObject: GeoObject);

            events: IEventManager;

            autoPan(): Promise<GeoObject>;

            close(force?: boolean): Promise<GeoObject>;

            destroy(): void;

            getData(): object | null;

            getOptions(): IOptionManager | null;

            getOverlay(): Promise<IOverlay | null>;

            getOverlaySync(): IOverlay | null;

            getPosition(): number[] | null;

            isOpen(): boolean;

            open(position?: number[], data?: object | string | HTMLElement, options?: object): Promise<GeoObject>;

            setData(data: object | string | HTMLElement): Promise<GeoObject>;

            setOptions(options: object): Promise<GeoObject>;

            setPosition(position: number[]): Promise<GeoObject>;
        }

        class Hint implements IHintManager<GeoObject> {
            constructor(geoObject: GeoObject);

            events: IEventManager;

            close(force?: boolean): Promise<GeoObject>;

            destroy(): void;

            getData(): object | null;

            getOptions(): IOptionManager | null;

            getOverlay(): Promise<IOverlay | null>;

            getOverlaySync(): IOverlay | null;

            getPosition(): number[] | null;

            isOpen(): boolean;

            open(position?: number[], data?: object | string | HTMLElement, options?: object): Promise<GeoObject>;

            setData(data: object | string | HTMLElement): Promise<GeoObject>;

            setOptions(options: object): Promise<GeoObject>;

            setPosition(position: number[]): Promise<GeoObject>;
        }

        class Sequence implements IGeoObject, IGeoObjectSequence {
            constructor(geoObject: GeoObject);

            geometry: IGeometry | null;
            properties: IDataManager;
            state: IDataManager;
            events: IEventManager;
            options: IOptionManager;

            getOverlay(): Promise<IOverlay | null>;

            getOverlaySync(): IOverlay | null;

            getParent(): null | IControlParent;

            setParent(parent: IControlParent): this;

            getMap(): Map;

            each(callback: (geoObject: IGeoObject) => void, context?: object): void;

            get(index: number): IGeoObject;

            getBounds(): number[][] | null;

            getIterator(): IIterator;

            getLength(): number;

            getPixelBounds(): number[][] | null;

            indexOf(geoObject: IGeoObject): number;
        }
    }

    namespace layout {
        namespace templateBased {
            class Base implements ILayout {
                constructor(data: object);

                events: IEventManager;

                destroy(): void;

                getData(): object;

                getParentElement(): HTMLElement;

                getShape(): IShape | null;

                isEmpty(): boolean;

                setData(data: object): void;

                setParentElement(parent: HTMLElement | null): this;

                build(): void;

                clear(): void;

                onSublayoutSizeChange(sublayoutInfo: object, nodeSizeByContent: object): void;

                rebuild(): void;
            }
        }

        class Image implements ILayout {
            events: IEventManager;

            destroy(): void;

            getData(): object;

            getParentElement(): HTMLElement;

            getShape(): IShape | null;

            isEmpty(): boolean;

            setData(data: object): void;

            setParentElement(parent: HTMLElement | null): void;
        }

        type IImageOptionsWithIconPrefix = {
            iconImageClipRect?: number[][] | undefined;
            iconImageHref?: string | undefined;
            iconImageOffset?: number[] | undefined;
            iconImageSize?: number[] | undefined;
            iconShape?: IShape | object | null | undefined;
        }

        class ImageWithContent extends Image {}

        type IImageWithContentOptionsWithIconPrefix = IImageOptionsWithIconPrefix & {
            iconContentLayout?: IClassConstructor<ILayout> | string | undefined;
            iconContentOffset?: number[] | undefined;
            iconContentSize?: number[] | undefined;
        }

        class PieChart extends templateBased.Base {}

        type IPieChartOptionsWithIconPrefix = {
            iconPieChartCaptionMaxWidth?: number | undefined;
            iconPieChartCoreFillStyle?: string | undefined;
            iconPieChartCoreRadius?: number | (() => number) | undefined;
            iconPieChartStrokeStyle?: string | undefined;
            iconPieChartStrokeWidth?: number | undefined;
        }

        const storage: util.Storage;
    }

    namespace map {
        namespace action {
            class Manager implements IEventEmitter {
                constructor(map: Map);

                events: IEventManager;

                breakTick(): void;

                execute(action: IMapAction): void;

                getCurrentState(): object;

                getMap(): Map;

                setCorrection(userFunction: () => void): void;

                stop(): void;
            }
        }

        namespace behavior {
            class Manager implements ICustomizable, IEventEmitter, IParentOnMap {
                constructor(map: Map, behaviors?: string[][] | string[], options?: object);

                options: IOptionManager;
                events: IEventManager;

                getMap(): Map;

                disable(behaviors: string[][] | string[] | string): this;

                enable(behaviors: string[][] | string[] | string): this;

                get(behaviorName: string): IBehavior;

                isEnabled(behaviorName: string): boolean;
            }
        }

        namespace layer {
            class Manager implements ILayer, IMapObjectCollection {
                constructor(map: Map, options?: {
                    trafficImageZIndex?: number | undefined;
                    trafficInfoZIndex?: number | undefined;
                    trafficJamZIndex?: number | undefined;
                });

                events: IEventManager;
                options: IOptionManager;

                getParent(): null | IControlParent;

                setParent(parent: IControlParent): this;

                add(object: object): this;

                each(callback: (layer: ILayer) => void, context?: object): void;

                getIterator(): IIterator;

                remove(object: object): this;

                getMap(): Map;

                getAll(): Array<Collection<Layer>>;
            }
        }

        namespace margin {
            class Accessor {
                constructor(screenArea: object);

                getArea(): object;

                remove(): this;

                setArea(screenArea: object): this;
            }

            class Manager {
                constructor(map: Map);

                addArea(screenArea: object): Accessor;

                destroy(): this;

                getMargin(): number[];

                getOffset(): number[];

                setDefaultMargin(margin: number[][] | number[] | number): void;
            }
        }

        namespace pane {
            class Manager {
                constructor(map: Map);

                append(key: string, pane: IPane): void;

                destroy(): void;

                get(key: string): IPane | null;

                getLower(): string;

                getUpper(): string;

                insertBefore(key: string, pane: IPane, referenceKey: string): void;

                remove(pane: IPane): void;
            }
        }

        class Balloon implements IBalloonManager<Balloon>/*, IBalloonSharingManager*/ {
            constructor(map: Map);

            events: IEventManager;

            autoPan(): Promise<Balloon>;

            close(force?: boolean): Promise<Balloon>;

            destroy(): void;

            getData(): object | null;

            getOptions(): IOptionManager | null;

            getOverlay(): Promise<IOverlay | null>;

            getOverlaySync(): IOverlay | null;

            getPosition(): number[] | null;

            isOpen(): boolean;

            open(position?: number[], data?: object | string | HTMLElement, options?: object): Promise<Balloon>;

            setData(data: object | string | HTMLElement): Promise<Balloon>;

            setOptions(options: object): Promise<Balloon>;

            setPosition(position: number[]): Promise<Balloon>;
        }

        class Container implements IDomEventEmitter {
            constructor(parentElement: string | HTMLElement);

            events: IEventManager;

            enterFullscreen(): void;

            exitFullscreen(): void;

            fitToViewport(preservePixelPosition?: boolean): void;

            getElement(): HTMLElement;

            getOffset(): number[];

            getParentElement(): HTMLElement;

            getSize(): number[];

            isFullscreen(): boolean;
        }

        class Converter {
            constructor(map: Map);

            globalToPage(globalPixelPoint: number[]): number[];

            pageToGlobal(pagePixelPoint: number[]): number[];
        }

        class Copyrights {
            constructor(map: Map);

            add(customCopyrights: string | HTMLElement | Array<string | HTMLElement>): ICopyrightsAccessor;

            addProvider(provider: ICopyrightsProvider): this;

            get(point?: number[], zoom?: number): Promise<Array<string | HTMLElement>>;

            getPromoLink(): string;

            removeProvider(provider: ICopyrightsProvider): this;
        }

        class GeoObjects implements IGeoObjectCollection {
            constructor(map: Map, options?: object);

            options: IOptionManager;
            events: IEventManager;

            add(child: IGeoObject | ObjectManager, index?: number): this;

            each(callback: (object: IGeoObject) => void, context?: object): void;

            get(index: number): IGeoObject;

            getBounds(): number[][] | null;

            getIterator(): IIterator;

            getLength(): number;

            getPixelBounds(): number[][] | null;

            indexOf(object: IGeoObject): number;

            remove(child: IGeoObject | ObjectManager): this;

            removeAll(): this;

            set(index: number, child: IGeoObject): this;

            splice(index: number, length: number): this;

            getMap(): Map;
        }

        class Hint implements IHintManager<Hint>/*, IHintSharingManager*/ {
            constructor(map: Map);

            events: IEventManager;

            close(force?: boolean): Promise<Hint>;

            destroy(): void;

            getData(): object | null;

            getOptions(): IOptionManager | null;

            getOverlay(): Promise<IOverlay | null>;

            getOverlaySync(): IOverlay | null;

            getPosition(): number[] | null;

            isOpen(): boolean;

            open(position?: number[], data?: object | string | HTMLElement, options?: object): Promise<Hint>;

            setData(data: object | string | HTMLElement): Promise<Hint>;

            setOptions(options: object): Promise<Hint>;

            setPosition(position: number[]): Promise<Hint>;
        }

        class ZoomRange implements IEventEmitter {
            constructor(map: Map, constraints: number[]);

            events: IEventManager;

            get(coords?: number[]): Promise<number[]>;

            getCurrent(): number[];
        }
    }

    namespace multiRouter {
        namespace driving {
            class Path implements IGeoObject {
                geometry: IGeometry | null;
                properties: data.Manager;
                state: IDataManager;
                model: PathModel;
                events: IEventManager;
                options: IOptionManager;

                getOverlay(): Promise<IOverlay | null>;

                getOverlaySync(): IOverlay | null;

                getParent(): object | null;

                setParent(parent: object): this;

                getMap(): Map;

                getSegments(): GeoObjectCollection;
            }

            class PathModel implements IEventEmitter {
                events: IEventManager;
                properties: data.Manager;
                route: RouteModel;

                destroy(): void;

                getSegments(): SegmentModel[];

                getType(): string;

                update(pathJson: object): void;
            }

            class Route implements IGeoObject {
                geometry: IGeometry | null;
                properties: IDataManager;
                state: IDataManager;
                events: IEventManager;
                options: IOptionManager;

                getOverlay(): Promise<IOverlay | null>;

                getOverlaySync(): IOverlay | null;

                getParent(): object | null;

                setParent(parent: object): this;

                getMap(): Map;

                getPaths(): GeoObjectCollection;
            }

            class RouteModel implements IEventEmitter {
                events: IEventManager;
                multiRoute: MultiRouteModel;
                properties: data.Manager;

                destroy(): void;

                getPaths(): PathModel[];

                update(routeJson: object): void;

                getType(): string;
            }

            class Segment implements IGeoObject {
                geometry: IGeometry | null;
                properties: data.Manager;
                state: IDataManager;
                events: IEventManager;
                options: IOptionManager;

                getOverlay(): Promise<IOverlay | null>;

                getOverlaySync(): IOverlay | null;

                getParent(): object | null;

                setParent(parent: object): this;

                getMap(): Map;
            }

            class SegmentModel implements IEventEmitter {
                events: IEventManager;
                geometry: geometry.base.LineString;
                path: PathModel;

                destroy(): void;

                getType(): string;

                getViaPoints(): ViaPointModel[];

                update(segmentJson: object): void;
            }
        }

        namespace masstransit {
            class Path implements IGeoObject {
                geometry: IGeometry | null;
                properties: data.Manager;
                state: IDataManager;
                events: IEventManager;
                options: IOptionManager;
                model: PathModel;

                getOverlay(): Promise<IOverlay | null>;

                getOverlaySync(): IOverlay | null;

                getParent(): object | null;

                setParent(parent: object): this;

                getMap(): Map;

                getSegmentMarkers(): GeoObjectCollection;

                getSegments(): GeoObjectCollection;
            }

            class PathModel implements IEventEmitter {
                events: IEventManager;
                properties: data.Manager;
                route: RouteModel;

                destroy(): void;

                getSegments(): Array<TransferSegmentModel | TransportSegmentModel | WalkSegmentModel>;

                getType(): string;

                update(pathJson: object): void;
            }

            class Route implements IGeoObject {
                geometry: IGeometry | null;
                properties: data.Manager;
                model: RouteModel;
                state: IDataManager;
                events: IEventManager;
                options: IOptionManager;

                getOverlay(): Promise<IOverlay | null>;

                getOverlaySync(): IOverlay | null;

                getParent(): object | null;

                setParent(parent: object): this;

                getMap(): Map;

                getPaths(): GeoObjectCollection;
            }

            class RouteModel implements IEventEmitter {
                events: IEventManager;
                multiRoute: MultiRouteModel;
                properties: data.Manager;

                destroy(): void;

                getPaths(): PathModel[];

                getType(): string;

                update(routeJson: object): void;
            }

            class StopModel implements IEventEmitter {
                events: IEventManager;
                geometry: geometry.base.Point;
                properties: data.Manager;
                segment: TransportSegmentModel;

                update(stopJson: object): void;
            }

            class TransferSegment implements IGeoObject {
                geometry: IGeometry | null;
                properties: data.Manager;
                state: IDataManager;
                events: IEventManager;
                options: IOptionManager;
                model: TransferSegmentModel;

                getOverlay(): Promise<IOverlay | null>;

                getOverlaySync(): IOverlay | null;

                getParent(): object | null;

                setParent(parent: object): this;

                getMap(): Map;
            }

            class TransferSegmentModel implements IEventEmitter {
                events: IEventManager;
                geometry: geometry.base.LineString;
                path: PathModel;
                properties: data.Manager;

                destroy(segmentJson: object): void;

                getType(): string;
            }

            class TransportSegment implements IGeoObject {
                geometry: IGeometry | null;
                properties: data.Manager;
                state: IDataManager;
                events: IEventManager;
                options: IOptionManager;
                model: TransportSegmentModel;

                getOverlay(): Promise<IOverlay | null>;

                getOverlaySync(): IOverlay | null;

                getParent(): object | null;

                setParent(parent: object): this;

                getMap(): Map;
            }

            class TransportSegmentModel implements IEventEmitter {
                events: IEventManager;
                geometry: geometry.base.LineString;
                path: PathModel;
                properties: data.Manager;

                destroy(): void;

                getStops(): StopModel[];

                getType(): string;

                update(segmentJson: object): void;
            }

            class WalkSegment implements IGeoObject {
                geometry: IGeometry | null;
                properties: data.Manager;
                state: IDataManager;
                events: IEventManager;
                options: IOptionManager;
                model: WalkSegmentModel;

                getOverlay(): Promise<IOverlay | null>;

                getOverlaySync(): IOverlay | null;

                getParent(): object | null;

                setParent(parent: object): this;

                getMap(): Map;
            }

            class WalkSegmentModel implements IEventEmitter {
                events: IEventManager;
                geometry: geometry.base.LineString;
                path: PathModel;
                properties: data.Manager;

                destroy(): void;

                getType(): string;
            }
        }

        class EditorAddon implements ICustomizable, IEventEmitter {
            options: IOptionManager;
            events: IEventManager;
            state: data.Manager;

            isActive(): boolean;

            start(state: object): void;

            stop(): void;
        }

        class MultiRoute implements IGeoObject {
            constructor(model: MultiRouteModel | IMultiRouteModelJson, options?: {
                activeRouteAutoSelection?: boolean | undefined;
                boundsAutoApply?: boolean | undefined;
                dragUpdateInterval?: string | number | undefined;
                preventDragUpdate?: boolean | undefined;
                useMapMargin?: boolean | undefined;
                zoomMargin?: number[][] | number[] | number | undefined;
                [index: string]: any;
            });

            editor: EditorAddon;
            model: MultiRouteModel;
            geometry: IGeometry | null;
            properties: IDataManager;
            state: IDataManager;
            events: IEventManager;
            options: IOptionManager;

            getOverlay(): Promise<IOverlay | null>;

            getOverlaySync(): IOverlay | null;

            getParent(): object | null;

            setParent(parent: object): this;

            getMap(): Map;

            getActiveRoute(): driving.Route | masstransit.Route | null;

            getBounds(): number[][] | null;

            getPixelBounds(): number[][] | null;

            getRoutes(): GeoObjectCollection;

            getViaPoints(): GeoObjectCollection;

            getWayPoints(): GeoObjectCollection;

            setActiveRoute(route: driving.Route | masstransit.Route | null): void;
        }

        class MultiRouteModel implements IEventEmitter {
            constructor(referencePoints: IMultiRouteReferencePoint[], params?: IMultiRouteParams);

            events: IEventManager;
            properties: data.Manager;

            destroy(): void;

            getAllPoints(): Array<WayPointModel | ViaPointModel>;

            getJson(): object;

            getParams(): IMultiRouteParams;

            getPoints(): Array<WayPointModel | ViaPointModel>;

            getReferencePointIndexes(): object;

            getReferencePoints(): IMultiRouteReferencePoint[];

            getRoutes(): driving.RouteModel[] | masstransit.RouteModel[];

            getViaPoints(): ViaPointModel[];

            getWayPoints(): WayPointModel[];

            setParams(params: IMultiRouteParams, extend?: boolean, clearRequests?: boolean): void;

            setReferencePoints(referencePoints: IMultiRouteReferencePoint[], viaIndexes?: number[], clearRequests?: boolean): void;
        }

        class ViaPoint implements IGeoObject {
            geometry: IGeometry | null;
            properties: data.Manager;
            state: IDataManager;
            events: IEventManager;
            options: IOptionManager;

            getOverlay(): Promise<IOverlay | null>;

            getOverlaySync(): IOverlay | null;

            getParent(): object | null;

            setParent(parent: object): this;

            getMap(): Map;
        }

        class ViaPointModel implements IEventEmitter {
            events: IEventManager;
            geometry: geometry.base.Point;
            multiRoute: MultiRouteModel;
            properties: data.Manager;

            destroy(): void;

            getReferencePoint(): object;

            getReferencePointIndex(): number;

            setReferencePoint(referencePoint: object): void;

            update(viaPointJson: object): void;
        }

        class WayPoint implements IGeoObject {
            geometry: IGeometry | null;
            properties: data.Manager;
            state: IDataManager;
            events: IEventManager;
            options: IOptionManager;
            model: WayPointModel;

            getOverlay(): Promise<IOverlay | null>;

            getOverlaySync(): IOverlay | null;

            getParent(): object | null;

            setParent(parent: object): this;

            getMap(): Map;
        }

        class WayPointModel implements IEventEmitter {
            events: IEventManager;
            geometry: geometry.base.Point;
            multiRoute: MultiRouteModel;
            properties: data.Manager;

            destroy(): void;

            getReferencePoint(): object;

            getReferencePointIndex(): number;

            setReferencePoint(referencePoint: object): void;

            update(wayPointJson: object): void;
        }
    }

    namespace option {
        class Manager<
            Options extends IOptionManagerData,
            ParentOptionManagerOptions extends IOptionManagerData = never
        > implements IOptionManager<Options, ParentOptionManagerOptions> {
            /**
             * @param options Хэш опций.
             * @param parent Родительский менеджер опций.
             * @param name Имя менеджера опций.
             */
            constructor(options?: Options | undefined, parent?: IOptionManager<Options, ParentOptionManagerOptions> | undefined, name?: string | undefined)

            /** Менеджер событий объекта. */
            events: IEventManager

            /** Задает значения опций для данного менеджера */
            set<K extends keyof Options>(path: K, value: Options[K]): this
            set({ }: Options): this

            /** Стирает значения заданных опций в данном менеджере. */
            unset(keys: string[][] | string[] | string): this

            /** Стирает значения всех опции в данном менеджере. */
            unsetAll(): this

            get<Key extends keyof (Options & ParentOptionManagerOptions), D>(key: Key, defaultValue: D): (Options & ParentOptionManagerOptions)[Key] | D

            getAll(): Options

            getName(): string

            getNative<Key extends keyof Options>(key: Key): Options[Key]

            resolve<Key extends keyof (Options & ParentOptionManagerOptions)>(key: Key, name?: string): (Options & ParentOptionManagerOptions)[Key]

            setName(name: string): void

            getParent(): ParentOptionManagerOptions extends IOptionManagerData ? IOptionManager<ParentOptionManagerOptions> : null;

            setParent<P extends {}>(parent: P | null): P extends {} ? IChild<P> : this

            freeze(): IFreezable

            isFrozen(): boolean

            unfreeze(): IFreezable

            /** @deprecated */
            add(types: string[][] | string[] | string, callback: (event: (object | IEvent)) => void, context?: object, priority?: number): this

            /** @deprecated */
            group(): IEventGroup

            /** @deprecated */
            remove(types: string[][] | string[] | string, callback: (event: (object | IEvent)) => void, context?: object, priority?: number): this

            /** @deprecated */
            fire(type: string, eventObject: object | IEvent): this
        }

        const presetStorage: util.Storage

        namespace presetKeys {
            type index = iconWithText | stretchIconWithText | iconWithDot | circleIconWithText | circleIconWithDot | iconWithIcon | circleIconWithIcon | pictogramIcon | clusterIcon | string

            /**
             * Метки с текстом
             * 
             * Содержимое метки задается через поле `properties.iconContent`.
             */
            type iconWithText = 'islands#blueIcon' | 'islands#darkGreenIcon' | 'islands#redIcon' | 'islands#violetIcon'
                | 'islands#darkOrangeIcon' | 'islands#blackIcon' | 'islands#nightIcon' | 'islands#yellowIcon'
                | 'islands#darkBlueIcon' | 'islands#greenIcon' | 'islands#pinkIcon' | 'islands#orangeIcon'
                | 'islands#grayIcon' | 'islands#lightBlueIcon' | 'islands#brownIcon' | 'islands#oliveIcon'

            /**
             * Метки с текстом (иконки тянутся под контент)
             * 
             * Содержимое метки задается через поле `properties.iconContent`.
             */
            type stretchIconWithText = 'islands#blueStretchyIcon' | 'islands#darkGreenStretchyIcon' | 'islands#redStretchyIcon' | 'islands#violetStretchyIcon'
                | 'islands#darkOrangeStretchyIcon' | 'islands#blackStretchyIcon' | 'islands#nightStretchyIcon' | 'islands#yellowStretchyIcon'
                | 'islands#darkBlueStretchyIcon' | 'islands#greenStretchyIcon' | 'islands#pinkStretchyIcon' | 'islands#orangeStretchyIcon'
                | 'islands#grayStretchyIcon' | 'islands#lightBlueStretchyIcon' | 'islands#brownStretchyIcon' | 'islands#oliveStretchyIcon'

            /** Метки без содержимого с точкой в центре */
            type iconWithDot = 'islands#blueDotIcon' | 'islands#darkGreenDotIcon' | 'islands#redDotIcon' | 'islands#violetDotIcon'
                | 'islands#darkOrangeDotIcon' | 'islands#blackDotIcon' | 'islands#nightDotIcon' | 'islands#yellowDotIcon'
                | 'islands#darkBlueDotIcon' | 'islands#greenDotIcon' | 'islands#pinkDotIcon' | 'islands#orangeDotIcon'
                | 'islands#grayDotIcon' | 'islands#lightBlueDotIcon' | 'islands#brownDotIcon' | 'islands#oliveDotIcon'

            /**
             * Метки в виде кругов с текстом
             * 
             * Содержимое метки задается через поле `properties.iconContent`.
             */
            type circleIconWithText = 'islands#blueCircleIcon' | 'islands#darkGreenCircleIcon' | 'islands#redCircleIcon' | 'islands#violetCircleIcon'
                | 'islands#darkOrangeCircleIcon' | 'islands#blackCircleIcon' | 'islands#nightCircleIcon' | 'islands#yellowCircleIcon'
                | 'islands#darkBlueCircleIcon' | 'islands#greenCircleIcon' | 'islands#pinkCircleIcon' | 'islands#orangeCircleIcon'
                | 'islands#grayCircleIcon' | 'islands#lightBlueCircleIcon' | 'islands#brownCircleIcon' | 'islands#oliveCircleIcon'

            /** Метки в виде кругов с точкой в центре */
            type circleIconWithDot = 'islands#blueCircleDotIcon' | 'islands#darkGreenCircleDotIcon' | 'islands#redCircleDotIcon' | 'islands#violetCircleDotIcon'
                | 'islands#darkOrangeCircleDotIcon' | 'islands#blackCircleDotIcon' | 'islands#nightCircleDotIcon' | 'islands#yellowCircleDotIcon'
                | 'islands#darkBlueCircleDotIcon' | 'islands#greenCircleDotIcon' | 'islands#pinkCircleDotIcon' | 'islands#orangeCircleDotIcon'
                | 'islands#grayCircleDotIcon' | 'islands#lightBlueCircleDotIcon' | 'islands#brownCircleDotIcon' | 'islands#oliveCircleDotIcon'

            /**
             * Метки со значком
             * 
             * Ключ для данного типа меток формируется по следующему правилу: `'islands#{цвет}{значок}Icon'`. Например, `'islands#blueHomeIcon'`. Ниже приведен список доступных значков и соответствующих для них ключей. Список доступных цветов можно посмотреть в любой другой таблице.
             */
            type iconWithIcon = 'islands#blueAirportIcon' | 'islands#blueAttentionIcon' | 'islands#blueAutoIcon' | 'islands#blueBarIcon'
                | 'islands#blueBarberIcon' | 'islands#blueBeachIcon' | 'islands#blueBicycleIcon' | 'islands#blueBicycle2Icon'
                | 'islands#blueBookIcon' | 'islands#blueCarWashIcon' | 'islands#blueChristianIcon' | 'islands#blueCinemaIcon'
                | 'islands#blueCircusIcon' | 'islands#blueCourtIcon' | 'islands#blueDeliveryIcon' | 'islands#blueDiscountIcon'
                | 'islands#blueDogIcon' | 'islands#blueEducationIcon' | 'islands#blueEntertainmentCenterIcon' | 'islands#blueFactoryIcon'
                | 'islands#blueFamilyIcon' | 'islands#blueFashionIcon' | 'islands#blueFoodIcon' | 'islands#blueFuelStationIcon'
                | 'islands#blueGardenIcon' | 'islands#blueGovernmentIcon' | 'islands#blueHeartIcon' | 'islands#blueHomeIcon'
                | 'islands#blueHotelIcon' | 'islands#blueHydroIcon' | 'islands#blueInfoIcon' | 'islands#blueLaundryIcon'
                | 'islands#blueLeisureIcon' | 'islands#blueMassTransitIcon' | 'islands#blueMedicalIcon' | 'islands#blueMoneyIcon'
                | 'islands#blueMountainIcon' | 'islands#blueNightClubIcon' | 'islands#blueObservationIcon' | 'islands#blueParkIcon'
                | 'islands#blueParkingIcon' | 'islands#bluePersonIcon' | 'islands#bluePocketIcon' | 'islands#bluePoolIcon'
                | 'islands#bluePostIcon' | 'islands#blueRailwayIcon' | 'islands#blueRapidTransitIcon' | 'islands#blueRepairShopIcon'
                | 'islands#blueRunIcon' | 'islands#blueScienceIcon' | 'islands#blueShoppingIcon' | 'islands#blueSouvenirsIcon'
                | 'islands#blueSportIcon' | 'islands#blueStarIcon' | 'islands#blueTheaterIcon' | 'islands#blueToiletIcon'
                | 'islands#blueUnderpassIcon' | 'islands#blueVegetationIcon' | 'islands#blueVideoIcon' | 'islands#blueWasteIcon'
                | 'islands#blueWaterParkIcon' | 'islands#blueWaterwayIcon' | 'islands#blueWorshipIcon' | 'islands#blueZooIcon'

            /**
             * Метки в виде круга со значком
             * 
             * Ключ для данного типа меток формируется по следующему правилу: `'islands#{цвет}{значок}CircleIcon'`. Например, `'islands#blueHomeCircleIcon'`. Ниже приведен список доступных значков и соответствующих для них ключей. Список доступных цветов можно посмотреть в любой другой таблице.
             */
            type circleIconWithIcon = 'islands#blueHomeCircleIcon' | 'islands#blueScienceCircleIcon' | 'islands#blueAirportCircleIcon' | 'islands#blueAttentionCircleIcon'
                | 'islands#blueAutoCircleIcon' | 'islands#blueBarCircleIcon' | 'islands#blueBarberCircleIcon' | 'islands#blueBeachCircleIcon'
                | 'islands#blueBicycleCircleIcon' | 'islands#blueBicycle2CircleIcon' | 'islands#blueBookCircleIcon' | 'islands#blueCarWashCircleIcon'
                | 'islands#blueChristianCircleIcon' | 'islands#blueCinemaCircleIcon' | 'islands#blueCircusCircleIcon' | 'islands#blueCourtCircleIcon'
                | 'islands#blueDeliveryCircleIcon' | 'islands#blueDiscountCircleIcon' | 'islands#blueDogCircleIcon' | 'islands#blueEducationCircleIcon'
                | 'islands#blueEntertainmentCenterCircleIcon' | 'islands#blueFactoryCircleIcon' | 'islands#blueFamilyCircleIcon' | 'islands#blueFashionCircleIcon'
                | 'islands#blueFoodCircleIcon' | 'islands#blueFuelStationCircleIcon' | 'islands#blueGardenCircleIcon' | 'islands#blueGovernmentCircleIcon'
                | 'islands#blueHeartCircleIcon' | 'islands#blueHotelCircleIcon' | 'islands#blueHydroCircleIcon' | 'islands#blueInfoCircleIcon'
                | 'islands#blueLaundryCircleIcon' | 'islands#blueLeisureCircleIcon' | 'islands#blueMassTransitCircleIcon' | 'islands#blueMedicalCircleIcon'
                | 'islands#blueMoneyCircleIcon' | 'islands#blueMountainCircleIcon' | 'islands#blueNightClubCircleIcon' | 'islands#blueObservationCircleIcon'
                | 'islands#blueParkCircleIcon' | 'islands#blueParkingCircleIcon' | 'islands#bluePersonCircleIcon' | 'islands#bluePocketCircleIcon'
                | 'islands#bluePoolCircleIcon' | 'islands#bluePostCircleIcon' | 'islands#blueRailwayCircleIcon' | 'islands#blueRapidTransitCircleIcon'
                | 'islands#blueRepairShopCircleIcon' | 'islands#blueRunCircleIcon' | 'islands#blueShoppingCircleIcon' | 'islands#blueSouvenirsCircleIcon'
                | 'islands#blueSportCircleIcon' | 'islands#blueStarCircleIcon' | 'islands#blueTheaterCircleIcon' | 'islands#blueToiletCircleIcon'
                | 'islands#blueUnderpassCircleIcon' | 'islands#blueVegetationCircleIcon' | 'islands#blueVideoCircleIcon' | 'islands#blueWasteCircleIcon'
                | 'islands#blueWaterParkCircleIcon' | 'islands#blueWaterwayCircleIcon' | 'islands#blueWorshipCircleIcon' | 'islands#blueZooCircleIcon'

            /** Пиктограммы */
            type pictogramIcon = 'islands#geolocationIcon'

            /** Значки кластеров */
            type clusterIcon = 'islands#blueClusterIcons' | 'islands#invertedBlueClusterIcons' | 'islands#redClusterIcons' | 'islands#invertedRedClusterIcons'
                | 'islands#darkOrangeClusterIcons' | 'islands#invertedDarkOrangeClusterIcons' | 'islands#nightClusterIcons' | 'islands#invertedNightClusterIcons'
                | 'islands#darkBlueClusterIcons' | 'islands#invertedDarkBlueClusterIcons' | 'islands#pinkClusterIcons' | 'islands#invertedPinkClusterIcons'
                | 'islands#grayClusterIcons' | 'islands#invertedGrayClusterIcons' | 'islands#brownClusterIcons' | 'islands#invertedBrownClusterIcons'
                | 'islands#darkGreenClusterIcons' | 'islands#invertedDarkGreenClusterIcons' | 'islands#violetClusterIcons' | 'islands#invertedVioletClusterIcons'
                | 'islands#blackClusterIcons' | 'islands#invertedBlackClusterIcons' | 'islands#yellowClusterIcons' | 'islands#invertedYellowClusterIcons'
                | 'islands#greenClusterIcons' | 'islands#invertedGreenClusterIcons' | 'islands#orangeClusterIcons' | 'islands#invertedOrangeClusterIcons'
                | 'islands#lightBlueClusterIcons' | 'islands#invertedLightBlueClusterIcons' | 'islands#oliveClusterIcons' | 'islands#invertedOliveClusterIcons'

        }
    }

    namespace pane {
        class EventsPane implements IEventPane {
            constructor(map: Map, params: {
                className?: string,
                css?: CSSStyleDeclaration;
                patch?: {
                    selectable?: boolean;
                },
                transparent?: boolean;
                checkContextMenu?: boolean;
                zIndex?: number;
            });

            events: IEventManager;

            destroy(): void;

            getElement(): HTMLElement;

            getMap(): Map;

            getOverflow(): 'visible' | 'hidden';

            getZIndex(): number;
        }

        class MovablePane implements IContainerPane {
            constructor(map: Map, params: {
                css?: CSSStyleDeclaration;
                margin?: number;
                overflow?: 'hidden' | 'visible';
                zIndex?: number;
            });

            events: IEventManager;

            destroy(): void;

            fromClientPixels(clientPixelPoint: number[]): number[];

            getElement(): HTMLElement;

            getMap(): Map;

            getOverflow(): 'visible' | 'hidden';

            getZIndex(): number;

            getZoom(): number;

            toClientPixels(globalPixelPoint: number[]): number[];
        }

        class StaticPane implements IContainerPane {
            constructor(map: Map, params: {
                css?: CSSStyleDeclaration;
                margin?: number;
                overflow?: 'visible' | 'hidden';
                zIndex?: number;
            });

            events: IEventManager;

            destroy(): void;

            fromClientPixels(clientPixelPoint: number[]): number[];

            getElement(): HTMLElement;

            getMap(): Map;

            getOverflow(): 'visible' | 'hidden';

            getZIndex(): number;

            getZoom(): number;

            toClientPixels(globalPixelPoint: number[]): number[];
        }
    }

    namespace panorama {
        type Layer = 'yandex#panorama' | 'yandex#airPanorama';

        class Base implements IPanorama {
            getAngularBBox(): number[];

            getConnectionArrows(): IPanoramaConnectionArrow[];

            getConnectionMarkers(): IPanoramaConnectionMarker[];

            getConnections(): IPanoramaConnectionMarker[];

            getCoordSystem(): ICoordSystem;

            getDefaultDirection(): number[];

            getDefaultSpan(): number[];

            getGraph(): IPanoramaGraph | null;

            getMarkers(): IPanoramaMarker[];

            getName(): string;

            getPosition(): number[];

            getThoroughfares(): IPanoramaConnectionArrow[];

            getTileLevels(): IPanoramaTileLevel[];

            getTileSize(): number[];

            validate(): void;

            static createPanorama(params: {
                angularBBox: number[],
                coordSystem?: ICoordSystem | undefined;
                name?: string | undefined;
                position: number[];
                tilesLevels: IPanoramaTileLevel[];
                tileSize: number[];
            }): IPanorama;

            static getMarkerPositionFromDirection(
                panorama: IPanorama,
                direction: number[],
                distance: number,
            ): number[];
        }

        function createPlayer(element: HTMLElement | string, point: number[], options?: {
            direction?: number[] | string | undefined;
            layer?: Layer | undefined;
            span?: number[] | string | undefined;
        }): Promise<Player>;

        function isSupported(): boolean;

        function locate(point: number[], options?: { layer?: Layer | undefined; }): Promise<IPanorama[]>;

        class Manager implements IEventEmitter {
            events: IEventManager;

            closePlayer(): void;

            disableLookup(): void;

            enableLookup(): void;

            getPlayer(): Player;

            isLookupEnabled(): boolean;

            openPlayer(panorama: IPanorama[] | number): Promise<void>;
        }

        class Player implements IEventEmitter {
            constructor(element: HTMLElement | string, panorama: IPanorama, options?: {
                autoFitToViewport?: "none" | "ifNull" | "always" | undefined;
                controls?: string[] | undefined;
                direction?: number[] | string | undefined;
                hotkeysEnabled?: boolean | undefined;
                scrollZoomBehavior?: boolean | undefined;
                span?: number[] | string | undefined;
                suppressMapOpenBlock?: boolean | undefined;
            })

            events: IEventManager;

            destroy(): void;

            fitToViewport(): void;

            getDirection(): number[];

            getPanorama(): IPanorama;

            getSpan(): number[];

            lookAt(point: number[]): this;

            moveTo(point: number[], options?: {
                direction?: number[] | string | undefined;
                layer?: Layer | undefined;
                span?: number[] | string | undefined;
            }): Promise<void>;

            setDirection(direction: number[] | string): this;

            setPanorama(panorama: IPanorama): this;

            setSpan(span: number[] | string): this;
        }
    }

    namespace router {
        class Editor implements ICustomizable, IEventEmitter {
            options: IOptionManager;
            events: IEventManager;

            start(options?: {
                addViaPoints?: boolean | undefined;
                addWayPoints?: boolean | undefined;
                editViaPoints?: boolean | undefined;
                editWayPoints?: boolean | undefined;
                removeViaPoints?: boolean | undefined;
                removeWayPoints?: boolean | undefined;
            }): void;

            stop(): void;
        }

        abstract class Route implements IGeoObject {
            geometry: IGeometry | null;
            properties: IDataManager;
            state: IDataManager;
            events: IEventManager;
            options: IOptionManager;
            editor: Editor;

            getOverlay(): Promise<IOverlay | null>;

            getOverlaySync(): IOverlay | null;

            getParent(): null | IControlParent;

            setParent(parent: IControlParent): this;

            getMap(): Map;

            getHumanJamsTime(): string;

            getHumanLength(): string;

            getHumanTime(): string;

            getJamsTime(): number;

            getLength(): number;

            getPaths(): GeoObjectCollection;

            getTime(): number;

            getViaPoints(): GeoObjectCollection;

            getWayPoints(): GeoObjectCollection;
        }
    }

    namespace shape {
        class Circle implements IShape {
            constructor(
                pixelGeometry: IPixelCircleGeometry,
                params?: {
                    fill?: boolean | undefined;
                    outline?: boolean | undefined;
                    strokeWidth?: number | undefined;
                }
            );

            contains(position: number[]): boolean;

            equals(shape: IShape): boolean;

            getBounds(): number[][] | null;

            getGeometry(): IPixelGeometry;

            getType(): string;

            scale(factor: number): IShape;

            shift(offset: number[]): IShape;
        }

        class LineString implements IShape {
            constructor(
                pixelGeometry: IPixelLineStringGeometry,
                params?: {
                    strokeWidth?: number | undefined;
                }
            );

            contains(position: number[]): boolean;

            equals(shape: IShape): boolean;

            getBounds(): number[][] | null;

            getGeometry(): IPixelGeometry;

            getType(): string;

            scale(factor: number): IShape;

            shift(offset: number[]): IShape;
        }

        class MultiPolygon implements IShape {
            constructor(
                pixelGeometry: IPixelMultiPolygonGeometry,
                params?: {
                    fill?: boolean | undefined;
                    outline?: boolean | undefined;
                    strokeWidth?: number | undefined;
                }
            );

            contains(position: number[]): boolean;

            equals(shape: IShape): boolean;

            getBounds(): number[][] | null;

            getGeometry(): IPixelGeometry;

            getType(): string;

            scale(factor: number): IShape;

            shift(offset: number[]): IShape;
        }

        class Polygon implements IShape {
            constructor(
                pixelGeometry: IPixelPolygonGeometry,
                params?: {
                    fill?: boolean | undefined;
                    outline?: boolean | undefined;
                    strokeWidth?: number | undefined;
                }
            );

            contains(position: number[]): boolean;

            equals(shape: IShape): boolean;

            getBounds(): number[][] | null;

            getGeometry(): IPixelGeometry;

            getType(): string;

            scale(factor: number): IShape;

            shift(offset: number[]): IShape;
        }

        class Rectangle implements IShape {
            constructor(
                geometry: IPixelRectangleGeometry,
                params?: {
                    fill?: boolean | undefined;
                    outline?: boolean | undefined;
                    strokeWidth?: number | undefined;
                }
            );

            contains(position: number[]): boolean;

            equals(shape: IShape): boolean;

            getBounds(): number[][] | null;

            getGeometry(): IPixelGeometry;

            getType(): string;

            scale(factor: number): IShape;

            shift(offset: number[]): IShape;
        }
    }

    interface meta {
        coordinatesOrder: 'latlong' | 'longlat';
        countryCode: string;
        languageCode: string;
        mode: 'release' | 'debug';
        ns: typeof ymaps;
        version: string;
    }

    class Balloon extends Popup<Balloon> implements IBaloon<Balloon>, IBalloonManager<Balloon> {
        constructor(map: Map, options?: IBalloonOptions);
        
        getData(): object;

        close(force?: boolean): Promise<Balloon>;

        getParent(): Balloon | null;

        setParent(parent: Balloon): this;

        autoPan(): Promise<Balloon>;

        freeze(): IFreezable;

        isFrozen(): boolean;

        unfreeze(): IFreezable;

        add(types: string[][] | string[] | string, callback: (event: (object | IEvent)) => void, context?: object, priority?: number): this;

        group(): IEventGroup;

        remove(types: string[][] | string[] | string, callback: (event: (object | IEvent)) => void, context?: object, priority?: number): this;

        fire(type: string, eventObject: object | IEvent): this;

        destroy(): void;

        getOptions(): IOptionManager | null;

        setOptions(options: object): Promise<Balloon>;
    }

    /** Интерфейс хинта. */
    interface IHint extends IPopup<IHint> {

    }

    /** Опции. */
    type IHintOptions = {
        /**
         * Задержка закрытия (в мс).
         * @default 700
         */
        closeTimeout?: number | undefined;

        /** Макет для содержимого хинта. (Тип: конструктор объекта с интерфейсом ILayout). */
        contentLayout?: IClassConstructor<ILayout> | string | undefined;

        /**
         * Флаг, заставляющий инфо-объекта сдвигать свою позицию, чтобы не выходить за границы контейнера.
         * @default true
         */
        fitPane?: boolean | undefined

        /**
         * Флаг, отменяющий закрытие хинта, находящегося под курсором.
         * @default true
         */
        holdByMouse?: boolean | undefined

        /** Ключ модели интерактивности. Доступные ключи и их значения перечислены в описании interactivityModel.storage. */
        interactivityModel?: InteractivityModelKey | undefined;

        /**
         * Внешний макет хинта. (Тип: конструктор объекта с интерфейсом ILayout).
         * @default 'islands#hint'
         */
        layout?: IClassConstructor<ILayout> | string | undefined;

        /** Дополнительное смещение позиции относительно точки привязки. */
        offset?: number[] | undefined;

        /**
         * Задержка открытия (в мс).
         * @default 150
         */
        openTimeout?: number | undefined;

        /**
         * Ключ пейна, в который помещается оверлей хинта
         * @default 'outerHint'
         */
        pane?: IPane | string | undefined;

        /** z-index хинта. */
        zIndex?: number | undefined;
    }
    
    type IHintOptionsWithHintPrefix = {
        [K in keyof IHintOptions as CamelCasePrefix<"hint", K>]: IHintOptions[K]
    }

    /** Хинт - всплывающая подсказка, которая может отображать любое HTML-содержимое. Обычно хинт существует на карте в единственном экземпляре, управление им происходит через специальные менеджеры (maps, geo objects, hotspot layers и т.д.). Не создавайте их самостоятельно, если в этом нет необходимости. */
    class Hint extends Popup<Hint> implements IHint {
        constructor(map: Map, options?: IHintOptions)
    }

    /** Опции. */
    type IBalloonOptions = {
        /**
         * Сдвигать карту, чтобы отобразить открывшийся балун.
         * @default true
         */
        autoPan?: boolean | undefined;
        
        /**
         * Включает автомасштабирование при невозможности отобразить карту после перемещения на том же масштабе.
         * @default false
         */
        autoPanCheckZoomRange?: boolean | undefined;
        
        /**
         * Длительность перемещения к точке балуна (в мс).
         * @default 500
         */
        autoPanDuration?: number | undefined;
        
        /**
         * Отступ или отступы от краев видимой области карты при выполнении действия autoPan. Значение может быть задано в виде одного числа (равный отступ для всех сторон), в виде двух чисел (для вертикальные и горизонтальные отступы) и в виде четырех чисел (в порядке: верхний, правый, нижний и левый отступ). Следует иметь в виду, данное значение будет суммироваться со значением рассчитыванным в менеджере отступов map.margin.Manager.
         * @default 34
         */
        autoPanMargin?: number | number[] | undefined;
        
        /**
         * Нужно ли учитывать отступы карты map.margin.Manager при выполнении действия autoPan.
         * @default true
         */
        autoPanUseMapMargin?: boolean | undefined;
        
        /**
         * Флаг наличия кнопки закрытия.
         * @default true
         */
        closeButton?: boolean | undefined;
        
        /**
         * Задержка закрытия (в мс).
         * @default 700
         */
        closeTimeout?: number | undefined;
        
        /** Макет для содержимого балуна. (Тип: конструктор объекта с интерфейсом ILayout или ключ макета). */
        contentLayout?: IClassConstructor<ILayout> | string | undefined;
        
        /** Ключ модели интерактивности. Доступные ключи и их значения перечислены в описании interactivityModel.storage. */
        interactivityModel?: InteractivityModelKey | undefined;
        
        /**
         * Внешний макет балуна. (Тип: конструктор объекта с интерфейсом ILayout или ключ макета).
         * @default 'islands#balloon'
        */
        layout?: IClassConstructor<ILayout> | string | undefined;
        
        /** Максимальная высота, в пикселах. */
        maxHeight?: number | undefined;
        
        /** Максимальная ширина, в пикселах. */
        maxWidth?: number | undefined;
        
        /** Минимальная высота, в пикселах. */
        minHeight?: number | undefined;
        
        /** Минимальная ширина, в пикселах. */
        minWidth?: number | undefined;
        
        /** Дополнительное смещение позиции относительно точки привязки. */
        offset?: number[] | undefined;
        
        /**
         * Задержка открытия (в мс).
         * @default 150
         */
        openTimeout?: number | undefined;
        
        /**
         * Ключ пейна, в который помещается оверлей балуна.
         * @default 'balloon'
         */
        pane?: string | undefined;
        
        /**
         * Макет для содержимого балуна в режиме панели. Если опция не задана, то используется значение опции contentLayout. (Тип: конструктор объекта с интерфейсом ILayout или ключ макета).
         * @default null
         */
        panelContentLayout?: IClassConstructor<ILayout> | string | undefined;
        
        /** Максимальная высота балуна-панели. Задаётся как коэфициент отношения к высоте карты: числом от 0 до 1. */
        panelMaxHeightRatio?: number | undefined;
        
        /** Максимальная площадь карты, при которой балун будет отображаться в виде панели. Можно отключить режим панели, задав значение 0, и наоборот, всегда отображать балун в виде панели, задав значение Infinity. */
        panelMaxMapArea?: number | undefined;
        
        /**
         * Флаг наличия тени.
         * @default true
         */
        shadow?: boolean | undefined;
        
        /** Макет тени. (Тип: конструктор объекта с интерфейсом ILayout или ключ макета). */
        shadowLayout?: IClassConstructor<ILayout> | string | undefined;
        
        /** Дополнительное смещение позиции тени относительно точки привязки. */
        shadowOffset?: number[] | undefined;
        
        /** z-index балуна. */
        zIndex?: string | undefined;
    }

    type FunctionOverlayGenerator = ((geometry: IPixelCircleGeometry, data: object, options: object) => Promise<IOverlay>)

    type ICircleOptions = {
        circleOverlay?: string | FunctionOverlayGenerator | undefined;
        cursor?: string | undefined;
        draggable?: boolean | undefined;
        fill?: boolean | undefined;
        fillColor?: string | undefined;
        fillImageHref?: string | undefined;
        fillMethod?: "stretch" | "tile" | undefined;
        fillOpacity?: number | undefined;
        hasBalloon?: boolean | undefined;
        hasHint?: boolean | undefined;
        hideIconOnBalloonOpen?: boolean | undefined;
        interactiveZIndex?: boolean | undefined;
        interactivityModel?: InteractivityModelKey | undefined;
        opacity?: number | undefined;
        openBalloonOnClick?: boolean | undefined;
        openEmptyBalloon?: boolean | undefined;
        openEmptyHint?: boolean | undefined;
        openHintOnHover?: boolean | undefined;
        outline?: boolean | undefined;
        pane?: string | undefined;
        strokeColor?: string[][] | string[] | string | undefined;
        strokeOpacity?: number[][] | number[] | number | undefined;
        strokeStyle?: string[][][] | object[][] | string[] | object[] | string | object | undefined;
        strokeWidth?: number[][] | number[] | number | undefined;
        syncOverlayInit?: boolean | undefined;
        useMapMarginInDragging?: boolean | undefined;
        visible?: boolean | undefined;
        zIndex?: number | undefined;
        zIndexActive?: number | undefined;
        zIndexDrag?: number | undefined;
        zIndexHover?: number | undefined;
    }

    class Circle implements GeoObject<ICircleGeometry> {
        constructor(geometry: ICircleGeometry[][][][] | number[][] | object, properties?: object | IDataManager, options?: ICircleOptions)

        balloon: geoObject.Balloon;
        editor: IGeometryEditor;
        hint: geoObject.Hint;
        events: event.Manager;
        options: option.Manager;
        properties: data.Manager;
        state: data.Manager;

        geometry: ICircleGeometry | null;
        indices: ArrayBuffer;
        vertices: ArrayBuffer;

        getOverlay(): Promise<IOverlay | null>;

        getOverlaySync(): IOverlay | null;

        getParent(): null | IControlParent;

        setParent(parent: IControlParent): this;

        getMap(): Map;
    }

    /** Опции. Опции для дочерних объектов-кластеров задаются с префиксом "cluster". См. ClusterPlacemark. */
    type IClustererOptions = & RemapType<"cluster", ClusterPlacemarkOptions> & {
        /**
         * Размер ячейки кластеризации в пикселях. Значение должно быть равно 2^n (в область 256 на 256 пикселей должно умещаться ровное количество ячеек).
         * @default 64
         */
        gridSize?: number | undefined;

        /**
         * Специальный режим работы кластеризатора при котором кластеры образуются только из геобъектов с одинаковыми координатами.
         * @default false
         */
        groupByCoordinates?: boolean | undefined;

        /**
         * Флаг наличия у кластеризатора поля .balloon. Если при клике на кластер не нужно открывать балун, рекомендуется установить эту опцию в значение false, чтобы избежать лишних инициализаций;
         * @default true
         */
        hasBalloon?: boolean | undefined;

        /**
         * Флаг наличия у кластеризатора поля .hint. Если при наведении на кластер не нужно показывать всплывающую подсказку, рекомендуется установить эту опцию в значение false, чтобы избежать лишних инициализаций;
         * @default true
         */
        hasHint?: boolean | undefined;

        /**
         * Число или массив чисел, задающие отступ для центра кластера относительно ячеек кластеризации. Если задано одно число - оно применяется ко всем сторонам. Если задано два - то это вертикальные и горизонтальные отступы соответственно. Если задан массив из 4х чисел, то это отступы top, right, bottom, left.
         * @default 10
         */
        margin?: number[] | number | undefined;

        /**
         * Максимальный коэффициент масштабирования карты, на котором происходит кластеризация объектов. Даже если кластеризация отключена, будут показаны только объекты в видимой области карты.
         * @default Infinity
         */
        maxZoom?: number[] | number | undefined;

        /**
         * Минимальное количество объектов, образующих кластер.
         * @default 2
         */
        minClusterSize?: number | undefined;

        /**
         * Ключ предустановленных опций кластеризатора. Список ключей, доступных в пакете package.clusters, содержится в описании option.presetStorage.
         */
        preset?: option.presetKeys.index | undefined;

        /**
         * Показывать метки в балуне в алфавитном порядке при нажатии на кластер. Геообъекты кластера сортируются по специальным полям в данных этих геообъектов - clusterCaption (или balloonContentHeader, если предыдущее поле не определено). По умолчанию геообъекты показываются в порядке добавления в кластеризатор.
         * @default false
         */
        showInAlphabeticalOrder?: boolean | undefined;

        /**
         * Нужно ли учитывать отступы карты map.margin.Manager при приближении карты после клика на кластере.
         * @default true
         */
        useMapMargin?: boolean | undefined;

        /**
         * Отступ для области, в которой показываются объекты. С помощью данной опции область показа объектов расширяется по отношению к видимой области карты.
         * @default 128
         */
        viewportMargin?: number[] | number | undefined;

        /**
         * Отступы от границ видимой области карты, которые соблюдаются при приближении карты после клика на кластере. Рекомендуется устанавливать значение опции в соответствии с размером иконок кластеров и меток. Например, если метка попадает в видимую область карты только нижним концом ножки, стоит выставить ненулевой отступ top, чтобы метка оставалась полностью видна после того, как кластер распался. Если задано одно число - оно применяется ко всем сторонам. Если задано два - то это горизонтальные и вертикальные отступы соответственно. Если задан массив из 4х чисел, то это отступы top, right, bottom, left.
         * @default 0
         */
        zoomMargin?: number[] | number | undefined;
    }

    class Clusterer implements IChildOnMap, ICustomizable, IEventEmitter, IParentOnMap {
        constructor(options?: IClustererOptions);

        balloon: clusterer.Balloon;
        // balloonopen:
        // balloonclose:
        events: IEventManager;
        hint: clusterer.Hint;
        options: IOptionManager;

        add(objects: IGeoObject | IGeoObject[]): this;

        createCluster(center: number[], geoObjects: IGeoObject[]): IGeoObject;

        getBounds(): number[][] | null;

        getClusters(): IGeoObject[];

        getGeoObjects(): IGeoObject[];

        getMap(): Map;

        getObjectState(geoObject: IGeoObject): { isShown: boolean; cluster: Cluster; isClustered: boolean };

        getParent(): IParentOnMap | null;

        remove(objects: IGeoObject | IGeoObject[]): this;

        removeAll(): this;

        setParent(parent: IParentOnMap | null): this;
    }

    /** Опции кластера. Помимо частных опций, балун кластера поддерживает те же опции, что и Balloon. Опции для балуна кластера указываются с префикcом 'balloon' и/или 'clusterBallon' (т.е. свойство сloseButton доступно под именами clusterCloseButton и clusterBalloonCloseButton). */
    type ClusterPlacemarkOptions = RemapType<"balloon", IBalloonOptions> & {
       /**
        * Макет балуна кластера в обычном режиме. Можно передать конструктор объекта с интерфейсом ILayout или ключ одного из стандартных макетов. Каждый стандартный макет имеет некоторые собственные опции. В стандартных макетах по умолчанию используются поля данных геообъектов: clusterCaption, balloonContentHeader, balloonContent и balloonContentFooter (см. Placemark).
        * - 'cluster#balloonTwoColumns' - Макет с двумя колонками. В левой колонке находится список названий меток (поле данных метки clusterCaption или balloonContentHeader, если предыдущее поле не определено). В правой колонке располагается вся информация о геообъекте. Опции макета:
        *      - balloonLeftColumnWidth — ширина поля со списком объектов в балуне кластера в пикселях. Значение по умолчанию: 125
        * - 'cluster#balloonCarousel' - Информация о геообъекте располагается в центре. По бокам размещаются кнопки перехода к предыдущему и следующему геообъекту. В нижней части балуна находится меню быстрой навигации. Опции макета:
        *      - balloonCycling — цикличность списка при навигации боковыми стрелками. Значение по умолчанию: true
        *      - balloonPagerSize — количество элементов навигации в нижней панели. Значение по умолчанию зависит от типа устройства. Для мобильных телефонов — это 4, а для планшетов и персональных компьютеров — 9.
        *      - balloonPagerType — тип нижней панели навигации. Может принимать значения 'numeric' и 'marker'.
        *          - numeric — отображение номера геообъекта в списке;
        *          - marker — отображение маркеров без номеров. Рекомендуется использовать при количестве элементов в кластере меньшем или равном значению options.balloonPagerSize.
        *          - Значение по умолчанию: numeric.
        *      - balloonPagerVisible — отображать ли панель навигации. Значение по умолчанию: true
        * - 'cluster#balloonAccordion' - Информация о геообъектах отображается в виде списка. Каждый элемент списка - это маленькая иконка и название метки (поле данных метки clusterCaption или balloonContentHeader, если предыдущее поле не определено). Цвет иконок соответствует цвету метки. Цвет метки определяется опцией "iconColor" Placemark. В браузере Internet Explorer ниже 9й версии иконки не отображаются всегда. После клика по элементу списка под ним разворачивается информация о геообъекте. Опции макета:
        *      - balloonAccordionShowIcons — опция, которая определяет, отображать ли иконку геообъекта в макете 'cluster#balloonAccordionItemTitle'. В браузере Internet Explorer ниже 9й версии опция не используется. Значение по умолчанию: true
        * @default 'cluster#balloonTwoColumns'
        */
        balloonContentLayout?: IClassConstructor<ILayout> | ClusterLayoutKey |  undefined;

        /**
         * Высота макета контента балуна кластера. По умолчанию опция балуна balloonMaxHeight для кластера не установлена, так как все стандартные макеты балунов кластеров имеют определенные размеры. Стандартное значение зависит от макета.
         * - 'cluster#balloonTwoColumns' - 210 пикселей
         * - 'cluster#balloonCarousel' - 177 пикселей
         * - 'cluster#balloonAccordion' - 283 пикселей
         */
        balloonContentLayoutHeight?: number | undefined;

        /**
         * Ширина макета контента балуна кластера. По умолчанию опция балуна balloonMaxWidth для кластера не установлена, так как все стандартные макеты балунов кластеров имеют определенные размеры. Стандартное значение зависит от макета.
         * - 'cluster#balloonTwoColumns' - 475 пикселей
         * - 'cluster#balloonCarousel' - 308 пикселей
         * - 'cluster#balloonAccordion' - 305 пикселей
         * 
         * Опция не используется в режиме панели.
         */
        balloonContentLayoutWidth?: number | undefined;

        /**
         * Макет с информацией о геообъекте. Стандартное значение зависит от макета.
         * - В макете 'cluster#balloonTwoColumns' отображается справа от списка. Стандартноe значение 'cluster#balloonTwoColumnsItemContent'.
         * - В макете 'cluster#balloonCarousel' отображается в центре. Стандартно значение 'cluster#balloonCarouselItemContent'.
         * - В макете 'cluster#balloonAccordion' отображает после клика по элементу списка. Стандартно значение 'cluster#balloonAccordionItemContent'.
         * 
         * **Набор полей, которые поступают в данный макет, отличаются от родительского и соответствует полям, которые поступают в обычный макет балуна геообъекта. Еще были добавлены поля ownerProperties, ownerOptions и ownerState для доступа к данным кластера.**
         */
        balloonItemContentLayout?: ILayout | ClusterContentLayoutKey | undefined;

        /**
         * Макет балуна кластера в режиме "панель". Можно передать конструктор объекта с интерфейсом ILayout. Доступные значения такие же, как и у опции 'balloonContentLayout'. Если значение равно null, то применяется значение опции 'balloonContentLayout'.
         * @default null
         */
        balloonPanelContentLayout?: IClassConstructor<ILayout> | ClusterLayoutKey | undefined;

        /**
         * Курсор над меткой кластера.
         * @default 'pointer'
         */
        cursor?: string | undefined;

        /**
         * Флаг, запрещающий увеличение коэффициента масштабирования карты при клике на кластер.
         * @default false
         */
        disableClickZoom?: boolean | undefined;

        /**
         * Скрывать иконку при открытии балуна.
         * @default true
         */
        hideIconOnBalloonOpen?: boolean | undefined;

        /**
         * Цвет иконки кластера. Эта опция применяется для стандартных иконок в браузерах, поддерживающих SVG.
         */
        iconColor?: string | undefined;

        /**
         * Макет содержимого метки кластера. (Тип: конструктор объекта с интерфейсом ILayout или ключ макета). Если у метки не нужно отображать содержимое, значение опции нужно выставить в null.
         * @default 'cluster#iconContent'
         */
        iconContentLayout?: string | IClassConstructor<ILayout> | undefined;

        /**
         * Макет метки кластера (Тип: конструктор объекта с интерфейсом ILayout или ключ макета).
         * @default 'cluster#icon'
         */
        iconLayout?: string | IClassConstructor<ILayout> | undefined;

        /**
         * Массив, описывающий иконки для стандартной реализации кластера. Описание иконки представляет из себя объект с полями
         * - href - ссылка на картинку;
         * - size - массив из двух чисел - размер иконки в пикселях;
         * - offset - смещение иконки относительно точки привязки объекта;
         * - shape - необязательное поле. Объект, реализующий интерфейс IShape или JSON-описание геометрии. Позволяет задавать описание геометрии иконки. Если параметр отсутствует, то активной для событий (наведение мыши, клик) будет считаться прямоугольная область вокруг иконки.
         */
        icons?: [{ href: string; size: number[]; offset: number[]; shape?: IShape | IGeometryJson | undefined; }] | undefined;

        /**
         * Фигура активной области метки кластера. Задается в виде JSON-описания пиксельной геометрии иконки. Эту опцию нужно использовать при создании своих HTML макетов. Координаты геометрии фигуры отсчитываются от точки привязки.
         */
        iconShape?: IGeometryJson | undefined;

        /**
         * Модель интерактивности кластера. Доступные ключи и их значения перечислены в описании interactivityModel.storage.
         * @default 'default#geoObject'
         */
        interactivityModel?: InteractivityModelKey | undefined;

        /**
         * Массив, описывающий граничные значения для размеров кластеров. Количество иконок, описанных в опции "icons", должно быть на 1 больше, чем чисел в данном массиве.
         * @default
         * [10, 100]
         */
        numbers?: number[] | undefined;

        /**
         * Опция, позволяющая запретить открытие балуна при клике на кластере. По умолчанию открытие балуна разрешено;
         * @default true
         */
        openBalloonOnClick?: boolean | undefined;

        /**
         * Опция, включающая показ пустых всплывающих подсказок. По умолчанию пустые хинты кластера не показываются.
         * @default false
         */
        openEmptyHint?: boolean | undefined;

        /**
         * Опция, позволяющая запретить показ всплывающей подсказки при наведении на кластер. По умолчанию показ хинтов разрешен.
         * @default true
         */
        openHintOnHover?: boolean | undefined;

        /**
         * Значение zIndex, которое выставляется метке кластера при наведении.
         */
        zIndexHover?: number | undefined;
    }

    /** Данные геообъекта */
    interface ClusterPlacemarkProperties<ChildObject extends {}> extends IDataManagerData {
        /** Массив геообъектов, которые находятся в данном кластере */
        geoObjects: ChildObject[];
    }

    /** Состояние кластера */
    interface ClusterPlacemarkState<ChildObject extends {}> extends IDataManagerData {
        /** Cсылка на активный объект кластера. Активным объектом является тот, который в данный момент выбран в балуне кластера. */
        activeObject: ChildObject
    }

    /** Кластер геообъектов. Используется по умолчанию в Clusterer. */
    class ClusterPlacemark<
        // У метки кластера какого-то чорта есть ссылка на массив гео-объедков которые он представляет. Возможно это и не Placemark вовсе.
        ChildObject extends {},

        // Дальше типы описывающие сам ClusterPlacemark:
        // Гео-объект использует объект геометрии размещаемый на карте
        Geometry extends IPointGeometry,
        // Опции гео-объекта
        Options extends IOptionManagerData = ClusterPlacemarkOptions,
        // У менеджера опций должен быть доступ к чтению опций менеджеров-родителей. Передаем опции от родителей к потомкам.
        ParentOptions extends IOptionManagerData = {},
        // Если в документации класса описаны какие-либо свойства, описать их там же и передать в Generic. Смотри IGeoObject@todo.
        Properties extends IDataManagerData = ClusterPlacemarkProperties<ChildObject>,
        // Состояния гео-объедка
        States extends IDataManagerData = ClusterPlacemarkState<ChildObject>,
    > extends collection.Item<Options, ParentOptions> implements IGeoObject<Geometry, Options, ParentOptions, Properties, States> {
        constructor(geometry: coordinate | object | Geometry, properties: data.Manager<Properties>, options?: ClusterPlacemarkOptions)

        geometry: Geometry | null

        properties: data.Manager<Properties>

        events: IEventManager

        options: IOptionManager<Options, ParentOptions>

        state: data.Manager<States>

        getOverlay(): Promise<IOverlay | null>

        getOverlaySync(): IOverlay | null

        getParent(): null | IControlParent

        setParent(parent: IControlParent): this

        getMap(): Map

        onAddToMap(map: Map): void

        onRemoveFromMap(oldMap: Map): void

        getBounds(): number[][] | null

        getGeoObjects(): ChildObject[]
    }

    class Collection<T = {}> implements ICollection, collection.Item {
        constructor(options?: object);

        events: IEventManager;
        options: IOptionManager;

        add(object: object): this;

        getIterator(): IIterator;

        remove(object: object): this;

        getParent(): null | IControlParent;

        setParent(parent: IControlParent): this;

        getMap(): Map;

        onAddToMap(map: Map): void;

        onRemoveFromMap(oldMap: Map): void;

        filter(filterFunction: (object: object) => boolean): object[];

        get(index: number): object;

        getAll(): T[];

        getLength(): number;

        indexOf(childToFind: object): number;

        removeAll(): this;
    }

    class Event<OriginalEvent = {}, TargetGeometry = {}> implements IEvent<OriginalEvent, TargetGeometry> {
        constructor(originalEvent: object, sourceEvent: IEvent);

        allowMapEvent(): void;

        callMethod(name: string): void;

        get<T extends OriginalEvent, K extends keyof T = keyof T>(name: K): T[K];
        get(name: string): any;

        getSourceEvent(): IEvent<OriginalEvent, TargetGeometry> | null;

        isDefaultPrevented(): boolean;

        isImmediatePropagationStopped(): boolean;

        isMapEventAllowed(): boolean;

        isPropagationStopped(): boolean;

        preventDefault(): boolean;

        stopImmediatePropagation(): boolean;

        stopPropagation(): boolean;

        originalEvent: {
            domEvent: {
                originalEvent: OriginalEvent;
            }
            target: {
                geometry?: TargetGeometry | undefined;
            };
        };
    }

    class DomEvent<OriginalEvent = {}, TargetGeometry = {}> implements IDomEvent<OriginalEvent, TargetGeometry> {
        constructor(originalEvent: DomEvent, type?: object);

        allowMapEvent(): void;

        callMethod(name: string): void;

        get<T extends OriginalEvent, K extends keyof T = keyof T>(name: K): T[K];
        get(name: string): any;

        getSourceEvent(): IDomEvent<OriginalEvent, TargetGeometry>;

        isDefaultPrevented(): boolean;

        isImmediatePropagationStopped(): boolean;

        isMapEventAllowed(): boolean;

        isPropagationStopped(): boolean;

        preventDefault(): boolean;

        stopImmediatePropagation(): boolean;

        stopPropagation(): boolean;

        originalEvent: {
            domEvent: {
                originalEvent: OriginalEvent
            };
            target: {
                geometry?: TargetGeometry | undefined
            }
        };
    }

    /** Поля данных при значениях опций по умолчанию */
    interface IGeoObjectProperties extends IDataManagerData {
        /** содержимое иконки геообъекта; */
        iconContent?: object | number | string | null | undefined
        /** подпись иконки геообъекта; */
        iconCaption?: object | number | string | null | undefined
        /** содержимое всплывающей подсказки геообъекта; */
        hintContent?: object | number | string | null | undefined
        /** содержимое балуна геообъекта; является кратким обозначением для поля `balloonContentBody`, но при одновременном задании `balloonContentBody` более приоритетен */
        balloonContent?: object | number | string | null | undefined
        /** содержимое заголовка балуна геообъекта; */
        balloonContentHeader?: object | number | string | null | undefined
        /** содержимое основой части балуна геообъекта; */
        balloonContentBody?: object | number | string | null | undefined
        /** содержимое нижней части балуна геообъекта. */
        balloonContentFooter?: object | number | string | null | undefined
        /** произвольные данные используемые пользователем библиотеки */
        [k: string]: object | number | string | null | undefined
    }

    /** Описание геообъекта. */
    type GeoObjectFeature<Geometry extends IGeometry, Properties extends IDataManagerData> = {
        /**
         * Принимает экземпляр геометрии или данные деометрии из которых можно создать экземпляр геометрии.
         * - **экземпляр** реализующий интерфейс {@link IGeometry}. Встроенные в библиотеку объекты геометрии:
         *     - {@link geometry.Circle}
         *     - {@link geometry.LineString}
         *     - {@link geometry.Point}
         *     - {@link geometry.Polygon}
         *     - {@link geometry.Rectangle}
         * - **данные** любого типа расширяющего тип `IGeometryJson`.
         *   Так же вы должны передать в `<Generic>` класса {@link GeoObject} тип экземпляра геометрии который делжен создаться из ваших данных.
         *   Встроенные в библиотеку типы:
         *     - {@link geometry.json.circle}
         *     - {@link geometry.json.lineString}
         *     - {@link geometry.json.Point}
         *     - {@link geometry.json.polygon}
         *     - {@link geometry.json.rectangle}
         */
        geomtery?: Geometry | IGeometryJson | undefined,
        properties?: Properties | IDataManager<Properties> | undefined,
    }

    /**
     * Опции геообъекта. Используя этот параметр можно задавать как опции самого геообъекта, так и опции его составных частей:
     * - Опции балуна геообъекта с префиксом `balloon`.
     * - Опции всплывающей подсказки геообъекта с префиксом `hint`.
     * - Опции редактора геометрии геообъекта с префиксом `editor`. Тип редактора и перечень доступных опций зависит от типа геометрии геообъекта. Смотрите описание классов geometryEditor.LineString, geometryEditor.Polygon, geometryEditor.Point.
     * - Опции геометрии могут задаваться без префикса. Смотрите описание классов IGeometry геометрий geometry.Point, geometry.Polygon и др.
     */
    type GeoObjectOptions<
        GeometryOptions extends IOptionManagerData,
        EditorOptions extends IOptionManagerData = {}
    > = RemapType<"balloon", IBalloonOptions> & RemapType<"hint", IHintOptions> & GeometryOptions & RemapType<"editor", EditorOptions> & {
        /**
         * Тип: String|Function
         * Ключ-идентификатор из хранилища overlay.storage или класс оверлея. Функция-генератор принимает три параметра:
         * - geometry: IPixelCircleGeometry - непосредственно пиксельная геометрия;
         * - data: Object - данные оверлея;
         * - options: Object - опции оверлея.
         * 
         * Функция возвращает объект vow.Promise.
         * @default "default#circle"
         */
        circleOverlay?: string | FunctionOverlayGenerator | undefined

        /**
         * Вид курсора над геообъектом.
         * @default "pointer"
         */
        cursor?: string | undefined

        /**
         * Определяет возможность перетаскивания геообъекта.
         * @default false
         */
        draggable?: boolean | undefined

        /**
         * Наличие заливки фигуры.
         * @default true
         */
        fill?: boolean | undefined

        /**
         * Цвет заливки.
         * @default "0066ff99"
         */
        fillColor?: string | undefined

        /** Фоновое изображение. При включении данной опции в режиме заливки stretch значение опции fillColor игнорируется. */
        fillImageHref?: string | undefined

        /**
         * Тип заливки фоном. Может принимать одно из двух значений:
         * - stretch - фоновое изображение растягивается по размеру оверлея.
         * - tile - Фоновое изображение повторяется без изменений размера. Аналог background-repeat в css. Можно использовать для заливки фигуры неким шаблоном.
         * @default 'stretch'
         */
        fillMethod?: 'stretch' | 'tile' | undefined

        /**
         * Прозрачность заливки.
         * @default 1
         */
        fillOpacity?: number | undefined

        /**
         * Определяет наличие поля balloon у геообъекта.
         * @default true
         */
        hasBalloon?: boolean | undefined

        /**
         * Определяет наличие поля hint у геообъекта.
         * @default true
         */
        hasHint?: boolean | undefined

        /**
         * Скрывать иконку при открытии балуна.
         * @default true
         */
        hideIconOnBalloonOpen?: boolean | undefined

        /**
         * Максимальная ширина подписи метки.
         * @default 188
         */
        iconCaptionMaxWidth?: number | undefined

        /** Цвет иконки. Эта опция применяется для стандартных иконок в браузерах, поддерживающих SVG. */
        iconColor?: string | undefined

        /** Макет содержимого иконки. (Тип: конструктор объекта с интерфейсом ILayout или его ключ в хранилище). */
        iconContentLayout?: string | IClassConstructor<ILayout> | undefined

        /** Пиксельный сдвиг содержимого иконки относительно родительского элемента. Используется в макете default#imageWithContent. */
        iconContentOffset?: number[] | undefined

        /** Отступ для содержимого в иконке. */
        iconContentPadding?: number[] | undefined

        /** Размер содержимого. Используется в макете default#imageWithContent. */
        iconContentSize?: number[] | undefined

        /**
         * Прямоугольная область (указывается левый верхний и правый нижний углы), которая будет вырезана из исходного графического файла и смасштабирована под размеры иконки (например для использования спрайтов). По умолчанию исходная картинка подставляется полностью.
         * @default
         * [[0, 0], [{imageWidth}, {imageHeight}]]
         */
        iconImageClipRect?: number[][] | undefined

        /** URL графического файла иконки. Применяется только в комбинации с макетами (iconLayout) 'default#image' и 'default#imageWithContent'. */
        iconImageHref?: string | undefined

        /** Пиксельный сдвиг изображения иконки внутри родительского элемента. */
        iconImageOffset?: number[] | undefined

        /** Фигура активной области. Если не задана, то автоматически будет рассчитана прямоугольная фигура на основе размера и смещения картинки. Координаты геометрии фигуры отсчитываются от точки привязки. Применяется только в комбинации с макетами (iconLayout) 'default#image' и 'default#imageWithContent'. */
        iconImageShape?: IShape | null | undefined

        /** Размер иконки в пикселях. */
        iconImageSize?: number[] | undefined

        /** Макет иконки. (Тип: конструктор объекта с интерфейсом ILayout или его ключ в хранилище). */
        iconLayout?: string | IClassConstructor<ILayout> | undefined

        /** Максимальная высота иконки с содержимым. */
        iconMaxHeight?: number | undefined

        /** Максимальная ширина иконки с содержимым. */
        iconMaxWidth?: number | undefined

        /**
         * Пиксельное смещение левого верхнего угла иконки относительно географической точки привязки метки.
         * @default
         * [0, 0]
         */
        iconOffset?: number[] | undefined

        /**
         * Флаг наличия тени у иконки.
         * @default false
         */
        iconShadow?: boolean | undefined

        /**
         * Прямоугольная область (указывается левый верхний и правый нижний углы), которая будет вырезана из исходного графического файла и смасштабирована под размеры тени (например для использования спрайтов). По умолчанию исходная картинка подставляется полностью.
         * @default
         * [[0, 0], [{imageWidth}, {imageHeight}]]
         */
        iconShadowImageClipRect?: number[][] | undefined

        /** URL графического файла тени иконки. Применяется только в комбинации с макетами (iconShadowLayout) 'default#image' и 'default#imageWithContent'. */
        iconShadowImageHref?: string | undefined

        /** Пиксельный сдвиг изображения тени иконки внутри родительского элемента. */
        iconShadowImageOffset?: number[] | undefined

        /** Размер тени иконки. */
        iconShadowImageSize?: number[] | undefined

        /** Макет тени иконки. (Тип: конструктор объекта с интерфейсом ILayout или его ключ в хранилище). */
        iconShadowLayout?: string | IClassConstructor<ILayout> | undefined

        /** Пиксельное смещение тени иконки относительно заданной позиции. */
        iconShadowOffset?: number[] | undefined

        /** Включает режим автоматического изменения z-index геообъекта в зависимости от его состояния. По умолчанию принимает значение true для геометрии geometry.Point и false для других геометрий. */
        interactiveZIndex?: boolean | undefined

        /**
         * Модель интерактивности. Доступные ключи и их значения перечислены в описании interactivityModel.storage.
         * @default "default#geoObject"
         */
        interactivityModel?: InteractivityModelKey | undefined

        /**
         * Ключ-идентификатор из хранилища overlay.storage или класс оверлея. Функция-генератор принимает три параметра:
         * - geometry:IPixelLineStringGeometry - непосредственно пиксельная геометрия;
         * - data: IDataManager или Object - данные оверлея;
         * - options: Object - опции оверлея.
         * 
         * Функция возвращает объект vow.Promise.
         * @default "default#polyline"
         */
        lineStringOverlay?: OverlayKey | undefined

        /**
         * Прозрачность.
         * @default 1
         */
        opacity?: number | undefined

        /**
         * Определяет показывать ли балун при щелчке на геообъекте.
         * @default true
         */
        openBalloonOnClick?: boolean | undefined

        /**
         * Определяет показывать ли пустой балун при щелчке на геообъекте.
         * @default false
         */
        openEmptyBalloon?: boolean | undefined

        /**
         * Определяет показывать ли пустой хинт при наведении указателя мыши на геообъект.
         * @default false
         */
        openEmptyHint?: boolean | undefined

        /**
         * Определяет показывать ли хинт при наведении указателя мыши на геообъект.
         * @default true
         */
        openHintOnHover?: boolean | undefined

        /**
         * Наличие обводки фигуры.
         * @default true
         */
        outline?: boolean | undefined

        /** Ключ пейна, в который помещается оверлей геообъекта. Значение по умолчанию определяется текущим оверлеем. */
        pane?: string | undefined

        /**
         * Ключ-идентификатор из хранилища overlay.storage или класс оверлея. Функция-генератор принимает три параметра:
         * - geometry: IPixelPointGeometry — непосредственно пиксельная геометрия;
         * - data: IDataManager или Object - данные оверлея;
         * - options: Object - опции оверлея.
         * 
         * Функция возвращает объект vow.Promise.
         * @default "default#placemark"
         */
        pointOverlay?: OverlayKey | undefined

        /**
         * Ключ-идентификатор из хранилища overlay.storage или класс оверлея. Функция-генератор принимает три параметра:
         * - geometry: IPixelPointGeometry — непосредственно пиксельная геометрия;
         * - data: IDataManager или Object - данные оверлея;
         * - options: Object - опции оверлея.
         * 
         * Функция возвращает объект vow.Promise.
         * @default "default#polygon"
         */
        polygonOverlay?: OverlayKey | undefined

        /** Ключ предустановленных опций геообъекта. Список ключей содержится в описании option.presetStorage. */
        preset?: option.presetKeys.index | undefined

        /**
         * Ключ-идентификатор из хранилища overlay.storage или класс оверлея. Функция-генератор принимает три параметра:
         * - geometry: IPixelPointGeometry — непосредственно пиксельная геометрия;
         * - data: IDataManager или Object - данные оверлея;
         * - options: Object - опции оверлея.
         * 
         * Функция возвращает объект vow.Promise.
         * @default "default#rectangle"
         */
        rectangleOverlay?: OverlayKey | undefined

        /**
         * true — при перетаскивании объекта выставлять курсор «сжатая рука» и на объект, и на карту, false — только на сам объект.
         * @default false
         */
        setMapCursorInDragging?: boolean | undefined

        /**
         * Цвет линии или обводки. Можно задать несколько значений для множественной обводки.
         * @default "0066ffff"
         */
        strokeColor?: string | string[] | undefined

        /**
         * Прозрачность линии или обводки. Можно задать несколько значений для множественной обводки.
         * @default 1
         */
        strokeOpacity?: number | number[] | undefined

        /** Стиль линии или обводки. Можно задать несколько значений для множественной обводки. Доступные стили перечислены в объекте graphics.style.stroke. */
        strokeStyle?: string | string[] | object | object[] | undefined

        /**
         * Толщина линии или обводки. Можно задать несколько значений для множественной обводки.
         * @default 1
         */
        strokeWidth?: number | number[] | undefined

        /**
         * Включает синхронное добавление оверлея на карту. По умолчанию добавление оверлея осуществляется асинхронно, что позволяет предотвратить зависания браузера при добавлении на карту большого числа геообъектов. Однако, асинхронное добавление не позволяет получать доступ к оверлею сразу после добавления геообъекта на карту.
         * @default false
         */
        syncOverlayInit?: boolean | undefined

        /**
         * При перетаскивании объекта к краю карты происходит автоматическое изменение центра карты. Нужно ли учитывать отступы карты при автоматическом смещении центра карты map.margin.Manager.
         * @default true
         */
        useMapMarginInDragging?: boolean | undefined

        /**
         * Определяет видимость геообъекта.
         * @default true
         */
        visible?: boolean | undefined

        /** z-index геообъекта в обычном состоянии. Наименее приоритетный. */
        zIndex?: number | undefined

        /** z-index геообъекта с открытым балуном. Наиболее приоритетный. */
        zIndexActive?: number | undefined

        /** z-index геообъекта при перетаскивании. */
        zIndexDrag?: number | undefined

        /** z-index геообъекта при наведении на него указателя мыши. */
        zIndexHover?: number | undefined
    }

    /** Состояние геообъекта */
    interface GeoObjectState extends IDataManagerData {
        /** признак того, что на геообъекте открыт балун */
        active: boolean,
        /** признак того, что в данный момент на геообъект наведен указатель мыши */
        hover: boolean,
        /** признак того, что в данный момент геообъект перетаскивается */
        drag: boolean
    }

    class GeoObject<
        Geometry extends IGeometry,
        GeometryOptions extends {},
        GeometryEditor extends IGeometryEditor,
        GeometryEditorOptions extends {},
        Properties extends IDataManagerData = IGeoObjectProperties,
        Options extends IOptionManagerData = GeoObjectOptions<GeometryOptions, GeometryEditorOptions>,
        ParentOptions extends IOptionManagerData = {}
    > implements IGeoObject<Geometry, GeometryOptions, GeometryEditorOptions, Properties, Options, ParentOptions> {
        constructor( feature?: GeoObjectFeature<Geometry, Properties> | undefined, options?: Options | undefined );

        balloon: geoObject.Balloon;
        editor: GeometryEditor;
        events: event.Manager<Geometry>;
        geometry: Geometry | null;
        hint: geoObject.Hint;
        options: option.Manager<Options, ParentOptions>;
        properties: data.Manager<Properties>;
        state: data.Manager<GeoObjectState>;

        getMap(): Map;

        getOverlay(): Promise<IOverlay | null>;

        getOverlaySync(): IOverlay | null;

        getParent(): null | IControlParent;

        setParent(parent: IParentOnMap | null): this;
    }

    class GeocodeResult implements IGeoObject {
        events: IEventManager;
        geometry: IGeometry | null;
        options: IOptionManager;
        properties: IDataManager;
        state: IDataManager;

        getAddressLine(): string;
        getAdministrativeAreas(): ReadonlyArray<string>;
        getCountry(): string | null;
        getCountryCode(): string | null;
        getLocalities(): ReadonlyArray<string>;
        getMap(): Map;
        getOverlay(): Promise<IOverlay | null>;
        getOverlaySync(): IOverlay | null;
        getParent(): object | null;
        getPremise(): string | null;
        getPremiseNumber(): string | null;
        getThoroughfare(): string | null;
        setParent(parent: object | null): this;
    }

    interface IGeoObjectFeature {
        geometry?: IGeometry | IGeometryJson | undefined;
        properties?: IDataManager | object | undefined;
    }

    class GeoObjectCollection implements IGeoObject, IGeoObjectCollection {
        constructor(feature?: {
            children?: IGeoObject[] | undefined;
            geometry?: IGeometry | object | undefined;
            properties?: IDataManager | object | undefined;
        }, options?: object);

        geometry: IGeometry | null;
        properties: IDataManager;
        state: IDataManager;
        events: IEventManager;
        options: IOptionManager;

        getOverlay(): Promise<IOverlay | null>;

        getOverlaySync(): IOverlay | null;

        getParent(): null | IControlParent;

        setParent(parent: IControlParent): this;

        getMap(): Map;

        add(child: IGeoObject, index?: number): this;

        each(callback: (object: IGeoObject) => void, context?: object): void;

        get(index: number): IGeoObject;

        getBounds(): number[][] | null;

        getIterator(): IIterator;

        getLength(): number;

        getPixelBounds(): number[][] | null;

        indexOf(object: IGeoObject): number;

        remove(child: IGeoObject): this;

        removeAll(): this;

        set(index: number, child: IGeoObject): this;

        splice(index: number, length: number): this;

        toArray(): IGeoObject[];
    }

    class Layer implements ILayer, IParentOnMap, IPositioningContext {
        constructor(tileUrlTemplate: string | ((tileNumber: number[], tileZoom: number) => string));

        events: IEventManager;
        options: IOptionManager;

        fromClientPixels(clientPixelPoint: number[]): number[];

        getZoom(): number;

        toClientPixels(globalPixelPoint: number[]): number[];

        getParent(): null | IControlParent;

        setParent(parent: IControlParent): this;

        getMap(): Map;

        getAlias(): string;

        getElement(): HTMLElement;
    }

    class Map implements IDomEventEmitter {
        constructor(parentElement: HTMLElement | string, state: IMapState, options?: IMapOptions)

        action: map.action.Manager;
        balloon: map.Balloon;
        behaviors: map.behavior.Manager;
        container: map.Container;
        controls: control.Manager;
        converter: map.Converter;
        copyrights: map.Copyrights;
        cursors: util.cursor.Manager;
        events: event.Manager;
        geoObjects: map.GeoObjects;
        hint: map.Hint;
        layers: map.layer.Manager;
        margin: map.margin.Manager;
        options: option.Manager;
        panes: map.pane.Manager;
        zoomRange: map.ZoomRange;

        destroy(): void;

        getBounds(options?: IMapMarginOptions): number[][];

        getCenter(options?: IMapMarginOptions): number[];

        getGlobalPixelCenter(options?: IMapMarginOptions): number[];

        getPanoramaManager(): Promise<panorama.Manager>;

        getType(): string | MapType;

        getZoom(): number;

        panTo(center: number[] | object[], options?: IMapPanOptions): Promise<void>;

        setBounds(bounds: number[][], options?: IMapBoundsOptions): Promise<void>;

        setCenter(center: number[], zoom?: number, options?: IMapPositionOptions): Promise<void>;

        setGlobalPixelCenter(globalPixelCenter: number[], zoom?: number, options?: IMapPositionOptions): Promise<void>;

        setType(type: string | MapType, options?: IMapCheckZoomRangeOptions): Promise<void>;

        setZoom(zoom: number, options?: IMapZoomOptions): Promise<void>;
    }

    class MapEvent<OriginalEvent = {}, TargetGeometry = {}> extends Event<OriginalEvent, TargetGeometry> {
        get(name: string): any;
        get(name: 'coords' | 'globalPixels' | 'pagePixels' | 'clientPixels'): [number, number];
        get(name: 'domEvent'): DomEvent<OriginalEvent, TargetGeometry> | undefined;
    }

    type IMapMarginOptions = {
        useMapMargin?: boolean | undefined;
    }

    type IMapCheckZoomRangeOptions = {
        checkZoomRange?: boolean | undefined;
    }

    type IMapZoomOptions = IMapMarginOptions & IMapCheckZoomRangeOptions & {
        duration?: number | undefined;
    }

    type IMapPositionOptions = IMapZoomOptions & {
        timingFunction?: string | undefined;
    }

    type IMapBoundsOptions = IMapPositionOptions & {
        preciseZoom?: boolean | undefined;
        zoomMargin?: number[][] | number[] | undefined;
    }

    type IMapPanOptions = IMapPositionOptions & {
        delay?: number | undefined;
        flying?: boolean | undefined;
        safe?: boolean | undefined;
    }

    class MapType {
        constructor(name: string, layers: Array<IClassConstructor<Layer> | string>)
    }

    interface IMapState {
        behaviors?: string[] | undefined;
        bounds?: number[][] | undefined;
        center?: number[] | undefined;
        controls?: Array<
            string
            | control.ZoomControl
            | control.RulerControl
            | control.TypeSelector
        > | undefined;
        margin?: number[][] | number[] | undefined;
        type?: "yandex#map" | "yandex#satellite" | "yandex#hybrid" | undefined;
        zoom?: number | undefined;
    }

    type IMapOptions = {
        autoFitToViewport?: "none" | "ifNull" | "always" | undefined;
        avoidFractionalZoom?: boolean | undefined;
        exitFullscreenByEsc?: boolean | undefined;
        fullscreenZIndex?: number | undefined;
        mapAutoFocus?: boolean | undefined;
        maxAnimationZoomDifference?: number | undefined;
        maxZoom?: number | undefined;
        minZoom?: number | undefined;
        nativeFullscreen?: boolean | undefined;
        projection?: IProjection | undefined;
        restrictMapArea?: boolean | number[][] | undefined;
        suppressMapOpenBlock?: boolean | undefined;
        suppressObsoleteBrowserNotifier?: boolean | undefined;
        yandexMapAutoSwitch?: boolean | undefined;
        yandexMapDisablePoiInteractivity?: boolean | undefined;

        copyrightLogoVisible?: boolean | undefined;
        copyrightProvidersVisible?: boolean | undefined;
        copyrightUaVisible?: boolean | undefined;
    }

    type PlacemarkOptions = RemapType<"balloon", IBalloonOptions> & layout.IImageWithContentOptionsWithIconPrefix & layout.IPieChartOptionsWithIconPrefix & {
        preset?: option.presetKeys.index | undefined;
        iconColor?: string | undefined;
        iconLayout?: IClassConstructor<ILayout> | IconLayoutKey | undefined;

        cursor?: string | undefined;
        draggable?: boolean | undefined;
        hasBalloon?: boolean | undefined;
        hasHint?: boolean | undefined;
        hideIconOnBalloonOpen?: boolean | undefined;
        iconOffset?: number[] | undefined;
        iconShape?: IGeometryJson | null | undefined;
        interactiveZIndex?: boolean | undefined;
        interactivityModel?: InteractivityModelKey | undefined;
        openBalloonOnClick?: boolean | undefined;
        openEmptyBalloon?: boolean | undefined;
        openEmptyHint?: boolean | undefined;
        openHintOnHover?: boolean | undefined;
        pane?: string | undefined;
        pointOverlay?: string | ((geometry: IPixelPointGeometry, data?: IOptionManagerData, options?: object) => vow.Promise) | undefined;
        syncOverlayInit?: boolean | undefined;
        useMapMarginInDragging?: boolean | undefined;
        visible?: boolean | undefined;
        zIndex?: number | undefined;
        zIndexActive?: number | undefined;
        zIndexDrag?: number | undefined;
        zIndexHover?: number | undefined;
    }

    class Placemark extends GeoObject<IPointGeometry, geometry.Point> {
        constructor(geometry: number[] | object | IPointGeometry, properties: object | IDataManager, options?: PlacemarkOptions)
    }

    type IPolygonOptions = {
        cursor?: string | undefined;
        draggable?: boolean | undefined;
        fill?: boolean | undefined;
        fillColor?: string | undefined;
        fillImageHref?: string | undefined;
        fillMethod?: 'stretch' | 'tile' | undefined;
        fillOpacity?: number | undefined;
        hasBalloon?: boolean | undefined;
        hasHint?: boolean | undefined;
        interactiveZIndex?: boolean | undefined;
        interactivityModel?: InteractivityModelKey | undefined;
        opacity?: number | undefined;
        openBalloonOnClick?: boolean | undefined;
        openEmptyBalloon?: boolean | undefined;
        openEmptyHint?: boolean | undefined;
        openHintOnHover?: boolean | undefined;
        outline?: boolean | undefined;
        pane?: string | undefined;
        polygonOverlay?: string | undefined;
        strokeColor?: string | string[] | undefined;
        strokeOpacity?: number | number[] | undefined;
        strokeStyle?: string | string[] | object | object[] | undefined;
        strokeWidth?: number | number[] | undefined;
        syncOverlayInit?: boolean | undefined;
        useMapMarginInDragging?: boolean | undefined;
        visible?: boolean | undefined;
        zIndex?: number | undefined;
        zIndexActive?: number | undefined;
        zIndexDrag?: number | undefined;
        zIndexHover?: number | undefined;
    }

    class Polygon extends GeoObject<IPolygonGeometry> {
        constructor(geometry: number[][][] | object| IPolygonGeometry, properties?: object | IDataManager, options?: IPolygonOptions)
    }

    /** Поля данных при значениях опций по умолчанию */
    interface PolylineProperties extends IDataManagerData {
        /** содержимое всплывающей подсказки ломаной; */
        hintContent?: object | number | string | null | undefined
        /** содержимое балуна ломаной; является кратким обозначением для поля `balloonContentBody`, но при одновременном задании `balloonContentBody` более приоритетен */
        balloonContent?: object | number | string | null | undefined
        /** содержимое заголовка балуна ломаной; */
        balloonContentHeader?: object | number | string | null | undefined
        /** содержимое основой части балуна ломаной; */
        balloonContentBody?: object | number | string | null | undefined
        /** содержимое нижней части балуна ломаной. */
        balloonContentFooter?: object | number | string | null | undefined
    }

    type PolylineOptions = {
        cursor?: string | undefined;
        draggable?: boolean | undefined;
        hasBalloon?: boolean | undefined;
        hasHint?: boolean | undefined;
        interactiveZIndex?: boolean | undefined;
        interactivityModel?: InteractivityModelKey | undefined;
        lineStringOverlay?: (() => object | string) | undefined;
        opacity?: number | undefined;
        openBalloonOnClick?: boolean | undefined;
        openEmptyBalloon?: boolean | undefined;
        openEmptyHint?: boolean | undefined;
        openHintOnHover?: boolean | undefined;
        pane?: string | undefined;
        strokeColor?: string | string[] | undefined;
        strokeOpacity?: number | number[] | undefined;
        strokeStyle?: string | string[] | object | object[] | undefined;
        strokeWidth?: number | number[] | undefined;
        syncOverlayInit?: boolean | undefined;
        useMapMarginInDragging?: boolean | undefined;
        visible?: boolean | undefined;
        zIndex?: number | undefined;
        zIndexActive?: number | undefined;
        zIndexDrag?: number | undefined;
        zIndexHover?: number | undefined;
    }

    class Polyline<
        Geometry extends ILineStringGeometry = geometry.LineString,
        GeometryOptions extends geometry.LineStringOptions = geometry.LineStringOptions,
        GeometryEditor extends geometryEditor.LineString = geometryEditor.LineString,
        GeometryEditorOptions extends geometryEditor.LineStringOptions = geometryEditor.LineStringOptions,
        Properties extends IDataManagerData = PolylineProperties,
        Options extends IOptionManagerData = GeoObjectOptions<GeometryOptions, GeometryEditorOptions>,
        ParentOptions extends IOptionManagerData = {}
    > extends GeoObject<Geometry, GeometryOptions, GeometryEditor, GeometryEditorOptions, Properties, Options, ParentOptions> {
        constructor(geometry: coordinate[] | object | ILineStringGeometry, properties?: object | IDataManager, options?: PolylineOptions)
    }

    class Popup<T> implements IPopup<T> {
        constructor(map: Map, options?: IPopupOptions);

        options: IOptionManager;
        events: IEventManager;

        close(force?: boolean): Promise<T>;

        getData(): object;

        getOverlay(): Promise<IOverlay>;

        getOverlaySync(): IOverlay;

        getPosition(): number[];

        isOpen(): boolean;

        open(position: number[], data: object | string | HTMLElement): Promise<T>;

        setData(data: object | string | HTMLElement): Promise<T>;

        setPosition(position: number[]): Promise<T>;
    }

    type IPopupOptions = {
        closeTimeout?: number | undefined;
        interactivityModel?: InteractivityModelKey | undefined;
        openTimeout?: number | undefined;
        pane?: IPane | string | undefined;
        projection?: IProjection | undefined;
        zIndex?: number | undefined;
    }

    function ready(successCallback?: () => any | IReadyObject, errorCallback?: () => any, context?: object): Promise<void>;

    /**
     * Processes geocoding requests. The request result can be provided in JSON format or as a GeoObjectCollection object.
     * @param request The address for which coordinates need to be obtained (forward geocoding), or the coordinates for which the address needs to be determined (reverse geocoding).
     * @param options Options.
     */
    function geocode(request: string | ReadonlyArray<number>, options?: IGeocodeOptions): Promise<IGeocodeResult>;

    type IGeocodeOptions = {
        /**
         * A rectangular area on the map, where the object being searched for is presumably located.
         */
        boundedBy?: ReadonlyArray<ReadonlyArray<number>>;

        /**
         * If true, JSON is passed to the handler function. Otherwise, the handler function is passed an object containing the geoObjects field with the geocoding results as GeoObjectCollection.
         * When geocoding using the 'yandex#map' geocoder, the collection contains GeocodeResult objects.
         */
        json?: boolean;

        /**
         * Type of toponym (only for reverse geocoding).
         */
        kind?: 'house' | 'street' | 'metro' | 'district' | 'locality';

        /**
         * Geocoding provider
         */
        provider?: IGeocodeProvider | 'yandex#map';

        /**
         * Maximum number of results to be returned.
         */
        results?: number;

        /**
         * Determines how to interpret the coordinates in the request.
         */
        searchCoordOrder?: 'longlat' | 'latlong';

        /**
         * Number of results that must be skipped.
         */
        skip?: number;

        /**
         * Search only inside the area defined by the "boundedBy" option.
         */
        strictBounds?: boolean;
    }

    interface IGeocodeResult {
        /**
         *  Geocoding results.
         */
        geoObjects: GeoObjectCollection;
    }

    namespace geolocation {
        /**
         * Tries to determine the user's location. Returns the promise object, which will either be confirmed by the object with the field geoObjects or rejected with an error message.
         * The geoObjects field is an instance of GeoObjectCollection. The object that indicates the user's current location will be added to the collection.
         * @param options Options.
         */
        function get(options?: IGeolocationOptions): Promise<IGeolocationResult>;

        type IGeolocationOptions = {
            /**
             * If true, geocode the user position automatically; if false, return as it is.
             * If automatic geocoding is used, the object marking the user's current position has the same structure as the result of executing geocode.
             */
            autoReverseGeocode?: boolean;

            /**
             * If true, the map center and zoom level are adjusted automatically to show the current location of the user; if false, nothing happens.
             */
            mapStateAutoApply?: boolean;

            /**
             * Geolocation provider. Accepted values:
             *  'yandex' - geolocation according to the Yandex data, based on the user IP-address;
             *  'browser' - built-in browser geolocation;
             *  'auto' - try to locate the user by all means available and then choose the best value.
             */
            provider?: 'yandex' | 'browser' | 'auto';

            /**
             * The response time, in milliseconds.
             */
            timeout?: number;

            /**
             * Whether to account for map margins map.margin.Manager when automatically centering and zooming the map.
             */
            useMapMargin?: boolean;
        }

        interface IGeolocationResult {
            /**
             * Geolocation results.
             */
            geoObjects: GeoObjectCollection;
        }
    }

    /**
     * Processes requests for search suggestions.
     * Returns a promise object that is either rejected with an error,
     * or confirmed by an array of objects in the format { displayName: "Mitishi, Moscow region", value: "Russia, Moscow region, Mitishi " }.
     * The displayName field represents the toponym in a user-friendly way,
     * and the value field represents the value which should be inserted into the search field after the user selects the suggestion.
     * @param request Request string.
     * @param options Options.
     */
    function suggest(request: string, options?: ISuggestOptions): Promise<ISuggestResult[]>;

    interface ISuggestResult {
        /**
         * Represents the toponym in a user-friendly way.
         */
        displayName: string;

        /**
         * Represents the value which should be inserted into the search field after the user selects the suggestion.
         */
        value: string;

        /**
         * Array of ranges for highlighting to show which part of the result matched the query.
         * The range for highlighting is an array of two numbers: the indexes of the starting and ending symbols of the range.
         */
         hl: number[][];

         type: string;
    }

    interface ISuggestProvider {
        suggest(request: string, options?: Omit<ISuggestOptions, 'provider'>): Promise<ISuggestResult[]>;
    }

    type ISuggestOptions = {
        /**
         * A rectangular area on the map, where the object being searched for is presumably located. Must be set as an array, such as [[30, 40], [50, 50]].
         */
        boundedBy?: number[][];

        /**
         * Search suggestion provider. You can use the 'yandex#map' built-in search suggestion provider for map objects, or specify your own.
         */
        provider?: ISuggestProvider | string;

        /**
         * Maximum number of results to be returned.
         */
        results?: number;
    }

    interface IReadyObject {
        require?: string[] | undefined;
        context?: object | undefined;

        successCallback?(): void;

        errorCallback?(): void;
    }

    namespace templateLayoutFactory {
        function createClass<O extends {} = {}, S extends {} = {}>(
            template: string,
            overrides?: O,
            staticMethods?: S
        ): IClassConstructor<layout.templateBased.Base & O & S>;
    }

    namespace util {
        namespace bounds {
            function areIntersecting(bounds1: number[][], bounds2: number[][], projection?: IProjection): boolean;
            function containsBounds(outer: number[][], inner: number[][], projection?: IProjection): boolean;
            function containsPoint(bounds: number[][], point: number[], projection?: IProjection): boolean;
            function fromBounds(sourceBounds: number[][][], projection?: IProjection): number[][];
            function fromGlobalPixelBounds(
              pixelBounds: number[][],
              zoom: number,
              projection?: IProjection,
            ): number[][];
            function fromPoints(points: number[][], projection?: IProjection): number[][];
            function getCenter(bounds: number[][], projection?: IProjection): number[];
            function getCenterAndZoom(
              bounds: number[][],
              containerSize: number[],
              projection?: IProjection,
              params?: { inscribe: boolean; margin: number | number[]; preciseZoom: boolean },
            ): {
              center: number[][];
              zoom: number;
            };
            function getIntersections(
              bounds1: number[][],
              bounds2: number[][],
              projection?: IProjection,
            ): number[][][];
            function getSize(bounds: number[][], projection?: IProjection): number[];
            function toGlobalPixelBounds(
              geoBounds: number[][],
              zoom: number,
              projection?: IProjection,
            ): number[][];
          }

        namespace cursor {
            class Accessor {
                constructor(key: string);

                getKey(): string;

                remove(): void;

                setKey(): void;
            }

            class Manager {
                constructor(element: HTMLElement);

                push(key: string): Accessor;
            }
        }

        class Storage {
            add(key: string, object: object): this;

            get(key: string | object): object | string;

            remove(key: string): object;
        }
    }

    namespace vow {
        class Deferred {
            promise(): Promise;

            reject(reason: object): void;

            resolve(value: object): void;
        }

        class Promise {
            constructor(resolver?: () => void);

            done(
                onFulfilled?: (...args: any[]) => void,
                onRejected?: (err?: Error | any) => void,
                onProgress?: (...args: any[]) => void,
                ctx?: object
            ): void;

            spread(
                onFulfilled?: (...args: any[]) => void,
                onRejected?: (err?: Error | any) => void,
                ctx?: object
            ): Promise;

            then(
                onFulfilled?: (...args: any[]) => void,
                onRejected?: (err?: Error | any) => void,
                onProgress?: (...args: any[]) => void,
                ctx?: object
            ): Promise;

            valueOf(): object;
        }
    }

    /*Interfaces*/

    interface IBaloon<T> extends IPopup<T>, ICustomizable, IChild<T>, IFreezable {
        autoPan(): Promise<T>;
    }

    interface IBalloonManager<T> extends IPopupManager<T> {
        autoPan(): Promise<T>;
    }

    interface IBaseGeometry extends IEventEmitter {
        getBounds(): number[][] | null;

        getType(): string;
    }

    interface IBaseLineStringGeometry extends IBaseGeometry, ILineStringGeometryAccess { }

    interface IBasePointGeometry extends IBaseGeometry, IPointGeometryAccess { }

    interface IBasePolygonGeometry extends IBaseGeometry, IPolygonGeometryAccess { }

    interface IBehavior extends IChildOnMap, ICustomizable {
        disable(): void;

        enable(): void;

        isEnabled(): boolean;
    }

    interface IChild<Parent = null> extends IEventEmitter {
        getParent(): Parent;

        setParent<P extends {}>(parent: P | null): P extends {} ? IChild<P> : this
    }

    interface IChildOnMap extends IChild<IControlParent> { }

    interface ICircleGeometry extends ICircleGeometryAccess, IGeometry {
        getType(): "Circle"
    }

    interface ICircleGeometryAccess extends IFreezable {
        contains(position: number[]): boolean;

        getClosest(anchorPosition: number[]): object;

        getCoordinates(): number[] | null;

        getRadius(): number;

        setCoordinates(coordinates: coordinate | null): this;

        setRadius(radius: number): this;
    }

    interface ICollection extends IEventEmitter {
        add(object: object): this;

        getIterator(): IIterator;

        remove(object: object): this;
    }

    interface IContainerPane extends IPane, IPositioningContext { }

    interface IControl extends IChildOnMap { }

    interface IControlParent extends IParentOnMap {
        getChildElement(child: IControl): Promise<HTMLElement>;
    }

    interface ICoordSystem {
        getDistance(point1: number[], point2: number[]): number;

        solveDirectProblem(startPoint: number[], direction: number[], distance: number): object;

        solveInverseProblem(startPoint: number[], endPoint: number[], reverseDirection?: boolean): object;
    }

    interface ICopyrightsAccessor extends ICopyrightsProvider { }

    interface ICopyrightsProvider extends IEventEmitter {
        getCopyrights(coords: number[], zoom: number): Promise<Array<string | HTMLElement>>;

        remove(): void;

        setCopyrights(copyrights: string | HTMLElement | Array<string | HTMLElement>): void;
    }

    interface ICustomizable<
        Options extends ymaps.IOptionManagerData,
        ParentOptionManagerOptions extends IOptionManagerData = never
    > extends IEventEmitter {
        options: IOptionManager<Options, ParentOptionManagerOptions>;
    }

    interface IDataManagerData {
        [k: string]: object | number | boolean | string | null | undefined
    }

    interface IDataManager<Data extends IDataManagerData> extends IEventEmitter {
        get<K extends keyof Data, D>(path: K, defaultValue: D): Data[K] | D;
    }

    interface IDomEventEmitter extends IEventEmitter { }

    interface IEvent<OriginalEvent = {}, TargetGeometry = {}> {
        allowMapEvent(): void;

        callMethod(name: string): void;

        get<T extends OriginalEvent, K extends keyof T = keyof T>(name: K): T[K];

        get(name: 'type'): string;
        get(name: 'objectId'): string | undefined;
        get(name: 'newZoom' | 'oldZoom'): number | undefined;

        get(name: string): any;

        getSourceEvent(): IEvent<OriginalEvent, TargetGeometry> | null;

        isDefaultPrevented(): boolean;

        isImmediatePropagationStopped(): boolean;

        isMapEventAllowed(): boolean;

        isPropagationStopped(): boolean;

        preventDefault(): boolean;

        stopImmediatePropagation(): boolean;

        stopPropagation(): boolean;

        originalEvent: {
            domEvent: {
                originalEvent: OriginalEvent;
            }
            target: {
                geometry?: TargetGeometry | undefined;
            };
        };
    }

    interface IDomEvent<OriginalEvent = {}, TargetGeometry = {}> extends IEvent<OriginalEvent, TargetGeometry> {
        getSourceEvent(): IDomEvent<OriginalEvent, TargetGeometry>;
    }

    interface IEventController {
        onStartListening?(events: IEventManager, type: string): void;

        onStopListening?(events: IEventManager, type: string): void;
    }

    interface IEventEmitter {
        events: IEventManager;
    }

    interface IEventGroup {
        add<K extends keyof EventMap>(types: K, callback: (event: EventMap[K] | IEvent) => void, context?: object, priority?: number): this;
        add(types: string[][] | string[] | string, callback: (event: object | IEvent) => void, context?: object, priority?: number): this;

        remove(types: string[][] | string[] | string, callback: (event: object | IEvent) => void, context?: object, priority?: number): this;

        removeAll(): this;
    }

    interface IEventManager<TargetGeometry = {}> extends IEventTrigger {
        add<K extends keyof EventMap>(types: K, callback: (event: IEvent<EventMap[K], TargetGeometry>) => void, context?: object, priority?: number): this;
        add(types: string[][] | string[] | string, callback: (event: IEvent) => void, context?: object, priority?: number): this;

        getParent(): object | null;

        group(): IEventGroup;

        remove(types: string[][] | string[] | string, callback: (event: object | IEvent) => void, context?: object, priority?: number): this;

        setParent(parent: object | null): this;
    }

    interface IEventPane extends IDomEventEmitter, IPane {}

    interface IEventTrigger {
        fire(type: string, eventObject?: object | IEvent): this;
    }

    interface IEventWorkflowController extends IEventController {
        onAfterEventFiring?(events: IEventManager, type: string, event?: IEvent): void;

        onBeforeEventFiring?(events: IEventManager, type: string, event?: IEvent): void;
    }

    interface IExpandableControlLayout extends ILayout { }

    interface IFreezable {
        events: IEventManager;

        freeze(): IFreezable;

        isFrozen(): boolean;

        unfreeze(): IFreezable;
    }

    interface IGeocodeProvider {
        geocode(
            request: string,
            options?: {
                boundedBy?: number[][] | undefined;
                results?: number | undefined;
                skip?: number | undefined;
                strictBounds?: boolean | undefined;
            }
        ): Promise<object>;

        suggest(
            request: string,
            options?: {
                boundedBy?: number[][] | undefined;
                results?: number | undefined;
                strictBounds?: boolean | undefined;
            }
        ): Promise<object>;
    }

    interface IGeometry extends IBaseGeometry, ICustomizable {
        getMap(): Map | null;

        getPixelGeometry(options?: object): IPixelGeometry;

        setMap(map: Map): void;
    }

    interface IGeometryEditor extends ICustomizable, IEventEmitter {
        geometry: IGeometry;
        state: IDataManager;

        startEditing(): void;

        stopEditing(): void;
    }

    interface IGeometryEditorChildModel extends IGeometryEditorModel {
        editor: IGeometryEditor;
        geometry: IBaseGeometry;

        getParent(): IGeometryEditorModel;

        setPixels(pixels: number[]): void;
    }

    interface IGeometryEditorModel extends IEventEmitter {
        destroy(): void;

        getPixels(): number[];
    }

    interface IGeometryEditorRootModel extends IGeometryEditorModel { }

    type IGeometryJson = geometry.json.GeometryObject

    type FeathureDTO<
        GeometryData extends geometry.json.YmapsGeometryJsonIndex | IGeometryJson,
        GeometryOptions extends {},
        GeometryEditorOptions extends {},
        Properties extends IDataManagerData = IGeoObjectProperties,
        Options extends IOptionManagerData = GeoObjectOptions<GeometryOptions, GeometryEditorOptions>,
    > = geometry.json.FeatureCollection & {
        feathures: geometry.json.Feature & {
            /** Уникальный идентификатор объекта. Разработчик должен сформировать идентификаторы объектов самостоятельно. */
            id: string
            /** Сериализованные данные геометрии объекта */
            geometry: GeometryData
            /** Свойства объекта (например, содержимое балуна или метки). Список доступных свойств описан в классе GeoObject. Кроме того, в свойствах могут быть указаны произвольные поля */
            properties?: Properties | undefined
            /** Опции объекта (например, стиль метки или цвет линии). Список доступных опций описан в классе GeoObject */
            options?: Options | undefined
        }
    }

    // #########################################################################
    // GeoJSON like rfc7946 END
    // ###############################################################

    /** @todo необходимо выяснить что такое `<Properties>` и дописать логику. В документации обрывками что-то где-то написано про свойства, но ничего не понятно. */
    interface IGeoObject<
        // Опции гео-объекта
        Options extends IOptionManagerData,
        // Если в документации класса описаны какие-либо свойства, описать их там же и передать в Generic. Смотри IGeoObject@todo.
        Properties extends IDataManagerData = {},
        // Состояния гео-объедка
        States extends IDataManagerData = {},
        // Гео-объект использует объект геометрии размещаемый на карте
        Geometry extends IGeometry = null,
        // У менеджера опций должен быть доступ к чтению опций менеджеров-родителей. Передаем опции от родителей к потомкам.
        ParentOptionManagerOptions extends IOptionManagerData = never
    > extends IChildOnMap, ICustomizable<Options, ParentOptionManagerOptions>, IDomEventEmitter, IParentOnMap {
        geometry: Geometry | null

        properties: data.Manager<Properties>

        state: data.Manager<States>

        getOverlay(): Promise<IOverlay | null>

        getOverlaySync(): IOverlay | null
    }

    interface IGeoObjectCollection extends ICustomizable, IEventEmitter, IParentOnMap {
        add(child: IGeoObject, index?: number): this;

        each(callback: (object: IGeoObject) => void, context?: object): void;

        get(index: number): IGeoObject;

        getBounds(): number[][] | null;

        getIterator(): IIterator;

        getLength(): number;

        getPixelBounds(): number[][] | null;

        indexOf(object: IGeoObject): number;

        remove(child: IGeoObject): this;

        removeAll(): this;

        set(index: number, child: IGeoObject): this;

        splice(index: number, length: number): this;
    }

    interface IGeoObjectSequence extends ICustomizable, IEventEmitter, IParentOnMap {
        each(callback: (geoObject: IGeoObject) => void, context?: object): void;

        get(index: number): IGeoObject;

        getBounds(): number[][] | null;

        getIterator(): IIterator;

        getLength(): number;

        getPixelBounds(): number[][] | null;

        indexOf(geoObject: IGeoObject): number;
    }

    interface IHintManager<T> extends IPopupManager<T> { }

    interface IIterator {
        getNext(): object | null;
    }

    interface ILayer extends IChildOnMap, ICustomizable, IEventEmitter {
        getBrightness?(): number;

        getCopyrights?(coords: number[], zoom: number): Promise<Array<string | HTMLElement>>;

        getZoomRange?(point: number[]): Promise<number[]>;
    }

    interface ILayout extends IDomEventEmitter {
        // new (data: object);
        destroy(): void;

        getData(): object;

        getParentElement(): HTMLElement;

        getShape(): IShape | null;

        isEmpty(): boolean;

        setData(data: object): void;

        setParentElement(parent: HTMLElement | null): void;
    }

    interface ILinearRingGeometryAccess extends IFreezable {
        contain(position: number): boolean;

        freeze(): IFreezable;

        get(index: number): number[];

        getChildGeometry(index: number): IPointGeometryAccess;

        getClosest(anchorPosition: number[]): object;

        getCoordinates(): number[][];

        getFillRule(): string;

        getLength(): number;

        insert(index: number, coordinates: coordinate): ILinearRingGeometryAccess;

        isFrozen(): boolean;

        remove(index: number): number[];

        set(index: number, coordinates: coordinate): ILinearRingGeometryAccess;

        setCoordinates(coordinates: coordinate[]): ILinearRingGeometryAccess;

        setFillRule(fillRule: string): ILinearRingGeometryAccess;

        splice(index: number, number: number): number[][];

        unfreeze(): IFreezable;
    }

    interface ILineStringGeometry extends IGeometry, ILineStringGeometryAccess { }

    interface ILineStringGeometryAccess extends IFreezable {
        get(index: number): number[];

        getChildGeometry(index: number): IPointGeometryAccess;

        getClosest(anchorPosition: number[]): object;

        getCoordinates(): number[][];

        getLength(): number;

        insert(index: number, coordinates: coordinate[]): ILineStringGeometryAccess;

        remove(index: number): number[];

        set(index: number, coordinates: coordinate): ILineStringGeometryAccess;

        setCoordinates(coordinates: coordinate[]): ILineStringGeometryAccess;

        splice(index: number, length: number): number[][];
    }

    interface IMapAction extends IEventEmitter {
        begin(mapActionManager: map.action.Manager): void;

        end(): void;
    }

    interface IMapObjectCollection extends ICollection, ICustomizable, IParentOnMap { }

    interface IMultiRouteModelJson {
        params: IMultiRouteParams;
        referencePoints: IMultiRouteReferencePoint[];
    }

    interface IMultiRouteParams {
        avoidTrafficJams?: boolean | undefined;
        boundedBy?: number[][] | null | undefined;
        requestSendInterval?: string | number | undefined;
        results?: number | undefined;
        reverseGeocoding?: boolean | undefined;
        routingMode?: "auto" | "masstransit" | "pedestrian" | undefined;
        searchCoordOrder?: string | undefined;
        strictBounds?: boolean | undefined;
        viaIndexes?: number[] | undefined;
    }

    type IMultiRouteReferencePoint = string | number[] | geometry.Point;

    type IOptionManagerData = {
        [k: string]: object | number | boolean | string | null | undefined
    }

    /** Интерфейс менеджера опций. Менеджер опций позволяет задавать значения опций, строить иерархию наследования опций, а также разрешать значения опций в контексте существующей иерархии наследования. */
    interface IOptionManager<
        Options extends IOptionManagerData,
        ParentOptions extends IOptionManagerData = never,
        Parent = ParentOptions extends IOptionManagerData ? IOptionManager<ParentOptions> : null
    > extends IChild<Parent>, IEventEmitter, IFreezable {
        /** Возвращает значение заданной опции в контексте существующей иерархии наследования опций. При вызове данного метода сначала происходит поиск значения в текущем менеджере опций, а затем, если значение не определено, поиск продолжается в иерархии родительских менеджеров. */
        get<Key extends keyof (Options & ParentOptions), D>(key: Key, defaultValue: D): (Options & ParentOptions)[Key] | D

        /** Возвращает ссылку на внутренний хэш хранящий значения опций. */
        getAll(): Options

        /** Возвращает имя менеджера опций. */
        getName(): string

        /** Возвращает значение заданной опции, определенное на данном уровне иерархии опций, т.е. в данном менеджере. */
        getNative<Key extends keyof Options>(key: Key): Options[Key]

        /** Метод, предназначенный для вызова дочерними менеджерами опций. */
        resolve<Key extends keyof (Options & ParentOptions)>(key: Key, name?: string): (Options & ParentOptions)[Key]

        /** Задает имя менеджера опций. */
        setName(name: string): void
    }

    interface IOverlay extends ICustomizable, IDomEventEmitter {
        getData(): object;

        getGeometry(): IPixelGeometry;

        getMap(): Map | null;

        getShape(): IShape | null;

        isEmpty(): boolean;

        setData(data: object): void;

        setGeometry(geometry: IPixelGeometry): void;

        setMap(map: Map | null): void;
    }

    interface IPane extends IEventEmitter {
        destroy(): void;

        getElement(): HTMLElement;

        getMap(): Map;

        getOverflow(): "visible" | "hidden";

        getZIndex(): number;
    }

    interface IPanorama {
        getAngularBBox(): number[];

        getConnectionArrows(): IPanoramaConnectionArrow[];

        getConnectionMarkers(): IPanoramaConnectionMarker[];

        getCoordSystem(): ICoordSystem;

        getDefaultDirection(): number[];

        getDefaultSpan(): number[];

        getGraph(): IPanoramaGraph | null;

        getMarkers(): IPanoramaMarker[];

        getName(): string;

        getPosition(): number[];

        getTileLevels(): IPanoramaTileLevel[];

        getTileSize(): number[];
    }

    interface IPanoramaConnection {
        getConnectedPanorama(): Promise<IPanorama>;
    }

    interface IPanoramaConnectionArrow extends IPanoramaConnection {
        properties: data.Manager;

        getDirection(): number[];

        getPanorama(): IPanorama;
    }

    interface IPanoramaConnectionMarker extends IPanoramaConnection, IPanoramaMarker { }

    interface IPanoramaGraph {
        getEdges(): IPanoramaGraphEdge[];

        getNodes(): IPanoramaGraphEdge[];

        getPanorama(): IPanorama;
    }

    interface IPanoramaGraphEdge {
        getEndNodes(): IPanoramaGraphNode[];
    }

    interface IPanoramaGraphNode {
        getConnectedPanorama(): Promise<IPanorama>;
    }

    interface IPanoramaMarker {
        properties: data.Manager;

        getIconSet(): Promise<IPanoramaMarkerIconSet>;

        getPanorama(): IPanorama;

        getPosition(): number[];
    }

    interface IPanoramaMarkerIcon {
        image: HTMLCanvasElement | HTMLImageElement;
        offset: number[];
    }

    interface IPanoramaMarkerIconSet {
        default: IPanoramaMarkerIcon | null;
        expanded: IPanoramaMarkerIcon | null;
        expandedHovered: IPanoramaMarkerIcon | null;
        hovered: IPanoramaMarkerIcon | null;
    }

    interface IPanoramaTileLevel {
        getImageSize(): number[];

        getTileUrl(x: number, y: number): string;
    }

    interface IParentOnMap {
        getMap(): Map;
    }

    interface IPixelCircleGeometry extends IPixelGeometry {
        getCoordinates(): number[];

        getRadius(): number;
    }

    interface IPixelLineStringGeometry extends IPixelGeometry {
        getClosest(anchorPosition: number[]): object;

        getCoordinates(): number[][];

        getLength(): number;
    }

    interface IPixelPointGeometry extends IPixelGeometry {
        getCoordinates(): number[];
      }

    interface IPixelMultiLineGeometry extends IPixelGeometry {
        getClosest(anchorPosition: number[]): object;

        getCoordinates(): number[][][];

        getLength(): number;
    }

    interface IPixelMultiPolygonGeometry extends IPixelGeometry {
        contains(position: number[]): boolean;

        getClosest(anchorPosition: number[]): object;

        getCoordinates(): number[][][][];

        getFillRule(): 'evenOdd' | 'nonZero';

        getLength(): number;
    }

    interface IPixelPolygonGeometry extends IPixelGeometry {
        contains(position: number[]): boolean;

        getClosest(anchorPosition: number[]): object;

        getCoordinates(): number[][][];

        getFillRule(): 'evenOdd' | 'nonZero';

        getLength(): number;
    }

    interface IPixelRectangleGeometry extends IPixelGeometry {
        getClosest(anchorPosition: number[]): object;

        getCoordinates(): number[][];
    }

    interface IPixelGeometry extends IBaseGeometry {
        equals(geometry: IPixelGeometry): boolean;

        getMetaData(): object;

        scale(factor: number): IPixelGeometry;

        shift(offset: number[]): IPixelGeometry;
    }

    interface IPointGeometry extends IGeometry, IPointGeometryAccess { }

    interface IPointGeometryAccess {
        getCoordinates(): number[] | null;

        setCoordinates(coordinates: coordinate | null): this;
    }

    interface IPolygonGeometry extends IGeometry, IPolygonGeometryAccess { }

    interface IPolygonGeometryAccess extends IFreezable {
        contains(position: number[]): boolean;

        get(index: number): number[][];

        getChildGeometry(index: number): ILinearRingGeometryAccess;

        getClosest(anchorPosition: number[]): object;

        getCoordinates(): number[][][];

        getFillRule(): string;

        getLength(): number;

        insert(index: number, path: number[][]): IPolygonGeometryAccess;

        remove(index: number): ILinearRingGeometryAccess;

        set(index: number, path: number[][]): IPolygonGeometryAccess;

        setCoordinates(coordinates: coordinate[][]): IPolygonGeometryAccess;

        setFillRule(fillRule: string): IPolygonGeometryAccess;

        splice(index: number, number: number): ILinearRingGeometryAccess[];
    }

    interface IRectangleGeometry extends IGeometry, IRectangleGeometryAccess {
        getType(): "Rectangle"
    }

    interface IRectangleGeometryAccess extends IFreezable {
        /**
         * Проверяет, лежит ли переданная точка внутри прямоугольника.
         * 
         * Возвращает признак принадлежности точки прямоугольнику.
         * 
         * @param position Координаты точки.
         */
        contains(position: coordinate): boolean

        /**
         * Ищет на контуре прямоугольника точку, ближайшую к anchorPosition.
         * 
         * Возвращает объект со следующими полями:
         * - position - точка на контуре прямоугольника, ближайшая к anchorPosition;
         * - distance - расстояние от anchorPosition до position;
         * 
         * @param anchorPosition Координаты точки, для которой расчитывается ближайшая точка на прямоугольнике.
         */
        getClosest(anchorPosition: coordinate): object

        /** Возвращает координаты двух противоположных углов прямоугольника. */
        getCoordinates(): [coordinate, coordinate]

        /**
         * Задает координаты двух противоположных углов прямоугольника.
         * 
         * Возвращает ссылку на себя.
         * 
         * @param coordinates Координаты углов
         */
        setCoordinates(coordinates: [coordinate, coordinate]): IRectangleGeometryAccess
    }

    /** Интерфейс инфо-объекта. */
    interface IPopup<T> extends ICustomizable, IEventEmitter {
        /** Закрывает инфо-объект. */
        close(force?: boolean): Promise<T>;

        /** Возвращает данные инфо-объекта. */
        getData(): object;

        /** Возвращает объект-обещание вернуть оверлей. */
        getOverlay(): Promise<IOverlay>;

        /** Возвращает оверлей, если тот существует. */
        getOverlaySync(): IOverlay;

        /** Возвращает координаты инфо-объекта. */
        getPosition(): number[];

        /** Возвращает состояние инфо-объекта: открыт/закрыт. */
        isOpen(): boolean;

        /** Открывает инфо-объект в указанной позиции. Если инфо-объект уже открыт, перемещает его в указанную точку. Формат и суть координат определяется проекцией IProjection, которая содержится в опциях. */
        open(position: number[], data: object | string | HTMLElement): Promise<T>;

        /** Задаёт инфо-объекту новые данные. */
        setData(data: object | string | HTMLElement): Promise<T>;

        /** Задаёт инфо-объекту новую позицию. */
        setPosition(position: number[]): Promise<T>;
    }

    interface IPopupManager<T> extends IEventEmitter {
        close(force?: boolean): Promise<T>;

        destroy(): void;

        getData(): object | null;

        getOptions(): IOptionManager | null;

        getOverlay(): Promise<IOverlay | null>;

        getOverlaySync(): IOverlay | null;

        getPosition(): number[] | null;

        isOpen(): boolean;

        open(position?: number[], data?: object | string | HTMLElement, options?: object): Promise<T>;

        setData(data: object | string | HTMLElement): Promise<T>;

        setOptions(options: object): Promise<T>;

        setPosition(position: number[]): Promise<T>;
    }

    interface IPositioningContext {
        fromClientPixels(clientPixelPoint: number[]): number[];

        getZoom(): number;

        toClientPixels(globalPixelPoint: number[]): number[];
    }

    interface IProjection {
        fromGlobalPixels(globalPixelPoint: number[], zoom: number): number[];

        getCoordSystem(): ICoordSystem;

        isCycled(): boolean[];

        toGlobalPixels(coordPoint: number[], zoom: number): number[];
    }

    interface IRoutePanel {
        options: IOptionManager;
        state: IDataManager;

        getRoute(): multiRouter.MultiRoute;
        getRouteAsync(): Promise<multiRouter.MultiRoute>;

        switchPoints(): void;
    }

    interface ISearchControlLayout extends IExpandableControlLayout { }

    interface ISelectableControl extends IControl {
        deselect(): void;

        disable(): void;

        enable(): void;

        isEnabled(): boolean;

        isSelected(): boolean;

        select(): void;
    }

    interface ISelectableControlLayout extends ILayout { }

    interface IShape {
        contains(position: number[]): boolean;

        equals(shape: IShape): boolean;

        getBounds(): number[][] | null;

        getGeometry(): IPixelGeometry;

        getType(): string;

        scale(factor: number): IShape;

        shift(offset: number[]): IShape;
    }

    class Monitor {
        constructor(dataManager: IDataManager | IOptionManager);
           add(name: string[] | string, changeCallback: (event: (object | IEvent)) => void, context?: any, params?: any): Monitor;
        forceChange(): Monitor;
        get(name: string): any;
        remove(name: string): Monitor;
        removeAll(): Monitor;
    }

    type ObjectManagerOptions<
        ChildGeometryOptions extends ymaps.IOptionManagerData,
        ChildGeometryEditorOptions extends ymaps.IOptionManagerData
    > = Omit<IClustererOptions, "hasBalloon" | "hasHint">
        & RemapType<"cluster", ClusterPlacemarkOptions>
        & RemapType<"geoObject", GeoObjectOptions<ChildGeometryOptions, ChildGeometryEditorOptions>>
        & {
            clusterize?: boolean | undefined
            syncOverlayInit?: boolean | undefined
            viewportMargin?: number[] | number | undefined
        }

    class ObjectManager<
        ChildFeathureOptions extends IOptionManagerData,
        ChildFeathure extends geometry.json.IFeatureJson<any, ChildFeathureOptions, any>,
        GeometryEditorOptions extends IOptionManagerData,
        // ...не завершено
        Options = ObjectManagerOptions<ChildFeathureOptions, GeometryEditorOptions>
    > implements ICustomizable, IEventEmitter, IGeoObject, IParentOnMap {
        constructor(options: IObjectManagerOptions);

        clusters: objectManager.ClusterCollection<ChildFeathureOptions, ChildFeathure, this>;

        events: IEventManager;

        geometry: IGeometry | null;

        objects: objectManager.ObjectCollection;

        options: IOptionManager;

        properties: IDataManager;

        state: IDataManager;

        add(objects: object | object[] | string): this;

        getBounds(): number[][] | null;

        getFilter(): string | ((object: object | string) => boolean) | null;

        getMap(): Map;

        getObjectState(id: string): { found: boolean; isShown: boolean; cluster?: Cluster | undefined; isClustered: boolean; isFilteredOut: boolean };

        getOverlay(): Promise<IOverlay | null>;

        getOverlaySync(): IOverlay | null;

        getParent(): IParentOnMap | null;

        getPixelBounds(): number[][] | null;

        remove(objects: object | object[] | string): this;

        removeAll(): this;

        setFilter(filer: (object: object | string) => boolean): void;

        setParent(parent: IParentOnMap | null): this;
    }

    /**
     * В `objectManager` реализованы менеджеры для одновременного отображения огромного количества объектов на карте:
     * - ObjectManager
     * - LoadingObjectManager
     * - RemoteObjectManager
     * 
     * Так как отображать тысячи экземпляров GeoObject типа Placemark/ClusterPlacemark/etc - ОЧЕНЬ накладно,
     * а писать отдельные карты для работы с большим количеством объедков - избыточно,
     * ymaps предоставил objectManager'ы. Они частично эмитируют стандартную работу через GeoObject'ы выполняя те же задачи.
     * 
     * #### Пример создания объектов на карте:
     * - Если обычно для **создания** метки нужно написать что-то типа
     * 
     * `object = new GeoObject(GeoData) & Map > add(object)`
     * 
     * - то в `objectManager` то же самое выполняется через
     * 
     * `manager = new Manager(GeoData) & Map > add(manager)`
     * 
     * #### Пример последующего взаимодействия с объектами карты после их создания:
     * - Если обычно для **изменения** метки используется что-то типа:
     * 
     * `object > setProperty(name, value) || object > addListener(handler(e))`
     * 
     * - то в `objectManager` то же самое выполняется через
     * 
     * `manager > setObjectProperty(objectId, name, value) || manager > addListener(handler(e, targetObject))`
     * 
     * Будьте осторожны, в документации по `objectManager`-ам постоянно ссылаются на классы `GeoObject`/`Clusterer`/`ClusterPlacemark`/etc, но эти классы и интерфейсы НЕ ИСПОЛЬЗУЮТСЯ `objectManager`'ами. `objectManager`'ы только подражают `GeoObject`'ам.
     * 
     * #### Описание специфики работы с `objectManager`
     * Классы ObjectManager используются для создания объектов на карте и только для этого.
     * Последующее взаимодействие с созданными объедками возможно лишь через коллекции (`objectManager.ObjectCollection` / `objectManager.ClusterCollection` / etc).
     * Просто *представьте* что эти коллекции содержат экземпляры GeoObjects и взаимодействуйте аналогично.
     * Будьте осторожны, это на самом деле НЕ КОЛЛЕКЦИИ. Они не содержат никаких самостаятельных сущностей с которыми можно взаимодействовать. Коллекция это уже конечный объект с которым будет происходить вся работа.
     */
    namespace objectManager {
        class Balloon implements Omit<IBalloonManager<map.Balloon>, 'open'> {
            events: IEventManager;

            autoPan(): Promise<ymaps.Balloon>;

            close(force?: boolean): Promise<ymaps.Balloon>;

            destroy(): void;

            getData(): object | null;

            getOptions(): IOptionManager | null;

            getOverlay(): Promise<IOverlay | null>;

            getOverlaySync(): IOverlay | null;

            getPosition(): number[] | null;

            isOpen(): boolean;

            open(objectId: object | string, anchorPixelPosition?: boolean): Promise<ymaps.Balloon>;

            setData(data: object | string | HTMLElement): Promise<ymaps.Balloon>;

            setOptions(options: object): Promise<ymaps.Balloon>;

            setPosition(position: number[]): Promise<ymaps.Balloon>;
        }

        type ClusterCollectionOptions<
            ChildFeathureOptions extends IOptionManagerData = {},
            ClusterOptions extends IOptionManagerData = ClusterPlacemarkOptions
        > = ChildFeathureOptions & RemapType<"cluster", ClusterOptions> & {
            /** Флаг наличия у коллекции поля .balloon. Если при клике на кластер не нужно открывать балун, рекомендуется установить эту опцию в значение false, чтобы избежать лишних инициализаций */
            hasBalloon?: boolean | undefined

            /** Флаг наличия у коллекции поля .hint. Если при наведении на кластер не нужно показывать всплывающую подсказку, рекомендуется установить эту опцию в значение false, чтобы избежать лишних инициализаций */
            hasHint?: boolean | undefined

            /**
             * Скрывать иконку при открытии балуна.
             * @default true
             */
            hideIconOnBalloonOpen?: boolean | undefined

            /**
             * Опция, позволяющая запретить открытие балуна при клике на кластер.
             * @default true
             */
            openBalloonOnClick?: boolean | undefined

            /**
             * Опция, позволяющая запретить показ всплывающей подсказки при наведении на кластер
             * @default true
             */
            openHintOnHover?: boolean | undefined
        }

        /** Состояние коллекции кластеров. */
        interface ClusterCollectionState<TFeathure extends geometry.json.IFeatureJson<any, any, any>> extends IDataManagerData {
            /** Cсылка на активный объект кластера. Активным объектом является тот, который в данный момент выбран в балуне кластера. */
            activeObject: TFeathure
        }

        /**
         * смотри описание нэймспэйса `objectManager`.
         * 
         * Этот объедк предоставляет доступ на редактирование и чтение псевдо-кластеров. 
         */
        class ClusterCollection<
            // Объекты на которые ссылаются кластеры.
            ChildFeathureOptions extends IOptionManagerData,
            ChildFeathure extends geometry.json.IFeatureJson<any, ChildFeathureOptions, any>,
            // Ссылка на родительский объект
            Parent extends ObjectManager<any, any, any> | LoadingObjectManager<any, any, any, any>,
            
            // Кластеры
            ClusterOptions extends IOptionManagerData = ClusterPlacemarkOptions,
            Cluster extends geometry.json.IClusterJson<any, ClusterOptions, {}, ChildFeathure> = geometry.json.IClusterJson<geometry.json.Point, ClusterOptions, {}, ChildFeathure>,
            
            // Итоговые опции коллекции
            Options extends IOptionManagerData = ClusterCollectionOptions<ChildFeathureOptions, ClusterOptions>,
        > implements ICustomizable<Options>, IEventEmitter {
            /** Балун кластера в составе менеджера. */
            balloon: Balloon;

            /**
             * Хинт объекта в составе ObjectManager. Названия полей доступны через метод Event.get:
             * - objectId – идентификатор объекта, над которым был показан хинт (всплывающая подсказка).
             */
            hint: Hint;

            /**
             * Менеджер опций. Имена полей, доступных через метод option.Manager.get:
             * - hasBalloon - флаг наличия у коллекции поля .balloon. Если при клике на кластер не нужно открывать балун, рекомендуется установить эту опцию в значение false, чтобы избежать лишних инициализаций;
             * - hasHint - флаг наличия у коллекции поля .hint. Если при наведении на кластер не нужно показывать всплывающую подсказку, рекомендуется установить эту опцию в значение false, чтобы избежать лишних инициализаций;
             * - hideIconOnBalloonOpen - cкрывать иконку при открытии балуна. Значение по умолчанию true.
             * - openBalloonOnClick - опция, позволяющая запретить открытие балуна при клике на кластер. По умолчанию открытие балуна разрешено;
             * - openHintOnHover - опция, позволяющая запретить показ всплывающей подсказки при наведении на кластер. По умолчанию показ хинтов разрешен.
             */
            options: option.Manager<Options>;

            /**
             * Коллекция оверлеев кластеров. Все события, за исключением событий add и remove, пропагируются от коллекции оверлеев в коллекцию кластеров.
             * Возвращает objectManager.OverlayCollection
             * @todo этот функционал еще не задокументирован. Смотри в документации ymaps
             */
            overlays: any

            /**
             * Состояние коллекции кластеров. Определяется следующими полями:
             * - activeObject – JSON-описание объекта, выбранного в балуне кластера.
             */
            state: data.Manager<ClusterPlacemarkState<ChildFeathure>>;

            events: IEventManager;

            eacheach(callback: (object: Cluster) => void, context?: object): void;

            getAll(): Cluster[];

            getById(id: string | null): Cluster | null;

            getIterator(): IIterator;

            getLength(): number;

            getObjectManager(): Parent;

            setClusterOptions(objectId: string, options: PlacemarkOptions): this;
        }

        class Hint implements Omit<IHintManager<map.Hint>, 'open'> {
            events: IEventManager;

            close(force?: boolean): Promise<map.Hint>;

            destroy(): void;

            getData(): object | null;

            getOptions(): IOptionManager | null;

            getOverlay(): Promise<IOverlay | null>;

            getOverlaySync(): IOverlay | null;

            getPosition(): number[] | null;

            isOpen(): boolean;

            open(objectId: object | string, position?: number[]): Promise<map.Hint>;

            setData(data: object | string | HTMLElement): Promise<map.Hint>;

            setOptions(options: object): Promise<map.Hint>;

            setPosition(position: number[]): Promise<map.Hint>;
        }

        type ObjectCollectionOptions<
            TChildFeathureOptions extends IOptionManagerData,
            GeoObjectLikeOptions extends IOptionManagerData
        > = TChildFeathureOptions & GeoObjectLikeOptions & {
            /** Флаг наличия у коллекции поля .balloon. Если при клике на кластер не нужно открывать балун, рекомендуется установить эту опцию в значение false, чтобы избежать лишних инициализаций */
            hasBalloon?: boolean | undefined
            /** Флаг наличия у коллекции поля .hint. Если при наведении на кластер не нужно показывать всплывающую подсказку, рекомендуется установить эту опцию в значение false, чтобы избежать лишних инициализаций */
            hasHint?: boolean | undefined
        }

        class ObjectCollection<
            // Опции этих объектов (по умолчанию их нет, но могут быть пользовательские)
            FeathureOptions extends IOptionManagerData,
            // Объекты которые содержаться в коллекции
            Feathure extends geometry.json.IFeatureJson<any, FeathureOptions, any>,
            // Опции эмитирующие опции гео-объекта соответствующего геометрии этого Feathure (Feathure.geometry.type."Point" => {@link ymaps.PlacemarkOptions})
            GeoObjectLikeOptions extends IOptionManagerData,

            Options extends IOptionManagerData = ObjectCollectionOptions<FeathureOptions, GeoObjectLikeOptions>
        > implements ICollection, ICustomizable<Options> {
            /** Балун объекта в составе менеджера */
            balloon: Balloon

            /** Хинт объекта в составе ObjectManager. */
            hint: Hint

            /** Менеджер опций */
            options: option.Manager<Options>

            /** @todo нужно дописать типизацию overlays */
            overlays: any

            events: IEventManager

            /** Метод полностью дублирует логику {@link ObjectManager.add}. */
            add(object: Feathure | Feathure[]): this

            /** Метод, вызывающий переданную функцию-обработчик для всех элементов коллекции. */
            each(callback: (object: Feathure) => void, context?: object): void

            /** Возвращает массив объектов, содержащихся в коллекции. */
            getAll(): Feathure[]

            /** Возвращает объект или null, если объекта с переданным id не существует. */
            getById(id: string | null): Feathure | null

            /** Возвращает итератор по коллекции. */
            getIterator(): IIterator

            /** Возвращает количество объектов в коллекции. */
            getLength(): number

            /** Возвращает родительский слой объектов коллекции. */
            getObjectManager(): any

            /** Метод полностью дублирует логику {@link ObjectManager.remove}. */
            remove(object: Feathure | Feathure[]): this

            /** Удаляет все элементы коллекции. */
            removeAll(): this

            /** Метод, позволяющий динамически обновлять опции объекта. Метод следует использовать в случаях, когда вы хотите, чтобы новые опции мгновенно применились к отображению объекта на карте. Обратите внимание, менеджер не учитывает опцию 'visible'. */
            setObjectOptions(objectId: string, options: FeathureOptions & GeoObjectLikeOptions): this
        }
    }

    /**
     * Опции.
     * - Можно задавать все опции, указанные в описании Clusterer, за исключением опций hasBalloon и hasHint.
     * - Опции для кластеров задаются с префиксом cluster. Список опций указан в описании класса ClusterPlacemark;
     * - Опции для одиночных объектов задаются с префиксом geoObject. Список опций определен в классе GeoObject. Обратите внимание, менеджер не учитывает опцию 'visible'.
     */
    type LoadingObjectManagerOptions<
        FeathureOptions extends IOptionManagerData,
        GeometryEditorOptions extends IOptionManagerData,
        GeoObjOpt = RemapType<"geoObject", Omit<GeoObjectOptions<FeathureOptions, GeometryEditorOptions>, "visible">>
    > = Omit<IClustererOptions, "hasBalloon" | "hasHint"> & RemapType<"cluster", ClusterPlacemarkOptions> & GeoObjOpt & {
        /**
         * Флаг, показывающий, нужно ли кластеризовать объекты. Обратите внимание, что на данный момент кластеризация работает только для точечных объектов. При включенном режиме кластеризации все неточечные объекты будут игнорироваться.
         * @default false
         */
        clusterize?: boolean | undefined

        /**
         * Размер тайла для загрузки данных.
         * @default 256
         */
        loadTileSize?: number | undefined

        /**
         * Имя GET-параметра, который содержит значение jsonp-колбека.
         * @default 'callback'
         */
        paddingParamName?: string | undefined

        /**
         * Шаблон для jsonp-колбека. Поддерживает те же подстановки, что и urlTemplate. Все символы, не являющиеся буквой или цифрой, будут заменены на '_'. Если параметр не задан, то имя jsonp-колбека будет сгенерировано автоматически. Примеры преобразований при tileNumber=[3, 1], zoom=9:
         * - 'myCallback=%x' => 'myCallback_3'
         * - '%c' => 'x_3_y_1_z_9'
         * - 'callback2_%c' => 'callback2_x_3_y_1_z_9'
         * - 'callback%test' => 'callback_test'
         * - 'callback_%b' => 'callback_85_0841__180_0000_85_0841_180_0000'
         * Обратите внимание, что если не использовать в значении опции подстановки, то это может привести к ошибке. Все запросы будут обращаться к одной callback-функции.
         * @default null
         */
        paddingTemplate?: string | undefined

        /**
         * Разделять запросы за данными на запросы за одиночными тайлами. По умолчанию запросы делаются за данными для прямоугольной области, содержащей несколько тайлов.
         * @default false
         */
        splitRequests?: boolean | undefined

        /**
         * Флаг, разрешающий создавать оверлеи для объектов синхронно. Обратите внимание, что при синхронном создании оверлея нужно самостоятельно обеспечить загрузку нужного класса, реализующего интерфейс IOverlay. По умолчанию оверлеи создаются асинхронно, при этом класс оверлея загружается по требованию.
         * @default false
         */
        syncOverlayInit?: boolean | undefined
    }

    type LoadingObjectManagerChildStates<
        Feathure extends geometry.json.IFeatureJson<any, any, any>
    > = {
        found: true
        isFilteredOut: boolean
        isShown: boolean
        isClustered: boolean
        cluster: geometry.json.IClusterJson<
            geometry.json.Point, ymaps.PlacemarkOptions, {}, Feathure
        >
    } | { found: false }

    /**
     * Менеджер объектов, осуществляющий их оптимальную подгрузку с сервера.
     * Позволяет оптимально загружать, отображать, кластеризовать и управлять видимостью объектов.
     * Менеджер отправляет запрос за данными по указанному url в JSONP-формате.
     * Описание формата соответствует формату добавляемых в ObjectManager объектов (см. ObjectManager.add).
     * Обратите внимание, что у объектов, отрисованных на карте через данный менеджер,
     * нельзя включать режимы редактирования и перетаскивания.
     */
    class LoadingObjectManager<
        // Все объекты карты в итоге отображаются как GeoObject'ы, при генерации учитываются соответствующие опции (Placemark Polyline Polygon Circle Rectangle)
        FeathureOptions extends IOptionManagerData,
        // LoadingObjectManager загружает по ссылке данные об объектах карты которые после генерирует на карте. Это тип загружаемых объедков
        Feathure extends geometry.json.IFeatureJson<any, FeathureOptions, any>,
        // алиасы в опциях на опции своего Editor'а (geometryEditor.LineString, geometryEditor.Polygon, geometryEditor.Point)
        GeometryEditorOptions extends IOptionManagerData,
        // если Feathure.geometry.type === "Point", то это PlacemarkOptioms; Дальше по аналогии
        GeoObjectLikeOptions extends IOptionManagerData,
            
        // Кластеры
        ClusterOptions extends IOptionManagerData = ClusterPlacemarkOptions,
        Cluster extends geometry.json.IClusterJson<geometry.json.Point, ClusterOptions, {}, Feathure> = geometry.json.IClusterJson<geometry.json.Point, ClusterOptions, {}, Feathure>,

        Options extends IOptionManagerData = LoadingObjectManagerOptions<FeathureOptions, GeometryEditorOptions>
    > implements ICustomizable<Options>, IEventEmitter, IGeoObject<Options>, IParentOnMap {
        constructor(urlTemplate: string, options: Options)

        /** Коллекция кластеров, сгенерированных менеджером */
        clusters: objectManager.ClusterCollection<FeathureOptions, Feathure, this, ClusterOptions, Cluster>

        /** Коллекция объектов, добавленных в слой */
        objects: objectManager.ObjectCollection<FeathureOptions, Feathure, GeoObjectLikeOptions>

        /** Менеджер событий */
        events: IEventManager

        /** Менеджер опций */
        options: IOptionManager<Options>

        /** Геометрия геообъекта */
        geometry: null

        /** Данные геообъекта */
        properties: data.Manager<{}>

        /** Состояние геообъекта */
        state: data.Manager<{}>

        /** Вычисляет границы области в геокоординатах, охватывающей все загруженные объекты в составе менеджера */
        getBounds(): coordinate[] | null

        /** Получение информации о текущем состоянии объекта, добавленного в менеджер. Кластеры не считаются. */
        getObjectState(id: string): LoadingObjectManagerChildStates<Feathure>

        /** Вычисляет границы области в глобальных пиксельных координатах, охватывающей все загруженные объекты в составе менеджера */
        getPixelBounds(): coordinate[] | null

        /** Возвращает URL тайла с данными */
        getTileUrl(): string|null

        /** Возвращает URL шаблона данных */
        getUrlTemplate(): string

        /** Метод, удаляющий все загруженные ранее данные и отправляющий запрос за новыми данными */
        reloadData(): void

        /**
         * шаблон URL данных. Поддерживаются специальные конструкции по аналогии с Layer. Также поддерживаются подстановки:
         * - %b заменяется на массив географических координат, описывающих прямоугольную область, для которой требуется загрузить данные.
         * - %t заменяется на массив номеров тайлов, описывающих прямоугольную область, для которой требуется загрузить данные.
         */
        setUrlTemplate(urlTemplate: string): void


        /** Возвращает ссылку на карту */
        getMap(): Map

        /** Метод предоставляет aсинхронный доступ к оверлею */
        getOverlay(): Promise<IOverlay | null>

        /** Метод предоставляет синхронный доступ к оверлею */
        getOverlaySync(): IOverlay | null

        /** 
         * Возвращает ссылку на родительский объект или null, если родительский элемент не был установлен
         * @todo этот интерфейс типизован неправильно
         */
        getParent(): IControlParent | null

        /**
         * Устанавливает родительский объект. Если передать значение null, то элемент управления будет только удален из текущего родительского объекта
         * @todo этот интерфейс типизован неправильно
         */
        setParent<P extends {}>(parent: P | null): P extends {} ? IChild<P> : this
    }

    namespace modules {
        type ResolveCallbackFunction = (provide: (module: any, error?: any) => void, ...depends: any[]) => void;

        function define(module: string, depends?: string[], resolveCallback?: ResolveCallbackFunction, context?: object): typeof modules;
        function define(module: string, resolveCallback?: ResolveCallbackFunction, context?: object): typeof modules;

        function require(modules: string | string[]): vow.Promise;

        function isDefined(module: string): boolean;
    }

    class Hotspot implements IHotspot {
        constructor(shape: IShape, zIndex?: number);

        events: IEventManager;
    }

    interface IHotspot extends IDomEventEmitter {
        events: IEventManager;
    }
}

declare const ymaps: ymaps
