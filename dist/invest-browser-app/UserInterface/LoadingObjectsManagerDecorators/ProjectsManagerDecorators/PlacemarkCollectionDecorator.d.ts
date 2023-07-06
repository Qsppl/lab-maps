/// <reference types="yandex-maps" />
import { ProjectFeathure } from "../../../Browser/LoadingObjectsManager/dto/project.js";
import { PlacemarkCollectionDecorator as SelectablePlacemarkCollectionDecorator, ObjectOptionsAssetKey, ObjectOptionsModifierKey } from "../SelectablePlacemarksManagerDecorator/PlacemarkCollectionDecorator.js";
export declare class PlacemarkCollectionDecorator extends SelectablePlacemarkCollectionDecorator {
    protected createAsset(targetObject: ProjectFeathure, assetKey: ObjectOptionsAssetKey, modifier?: ObjectOptionsModifierKey): Promise<{
        isVisited?: boolean;
        isSelected?: boolean;
    } & {
        balloonAutoPan?: boolean;
        balloonAutoPanCheckZoomRange?: boolean;
        balloonAutoPanDuration?: number;
        balloonAutoPanMargin?: number | number[];
        balloonAutoPanUseMapMargin?: boolean;
        balloonCloseButton?: boolean;
        balloonCloseTimeout?: number;
        balloonContentLayout?: string | import("yandex-maps").IClassConstructor<import("yandex-maps").ILayout>;
        balloonInteractivityModel?: string;
        balloonLayout?: string | import("yandex-maps").IClassConstructor<import("yandex-maps").ILayout>;
        balloonMaxHeight?: number;
        balloonMaxWidth?: number;
        balloonMinHeight?: number;
        balloonMinWidth?: number;
        balloonOffset?: number[];
        balloonOpenTimeout?: number;
        balloonPane?: string;
        balloonPanelContentLayout?: string | import("yandex-maps").IClassConstructor<import("yandex-maps").ILayout>;
        balloonPanelMaxHeightRatio?: number;
        balloonPanelMaxMapArea?: number;
        balloonShadow?: boolean;
        balloonShadowLayout?: string | import("yandex-maps").IClassConstructor<import("yandex-maps").ILayout>;
        balloonShadowOffset?: number[];
        balloonZIndex?: string;
    } & import("yandex-maps").layout.IImageOptionsWithIconPrefix & {
        iconContentLayout?: string | import("yandex-maps").IClassConstructor<import("yandex-maps").ILayout>;
        iconContentOffset?: number[];
        iconContentSize?: number[];
    } & import("yandex-maps").layout.IPieChartOptionsWithIconPrefix & {
        preset?: string;
        iconColor?: string;
        iconLayout?: string | import("yandex-maps").IClassConstructor<import("yandex-maps").ILayout>;
        cursor?: string;
        draggable?: boolean;
        hasBalloon?: boolean;
        hasHint?: boolean;
        hideIconOnBalloonOpen?: boolean;
        iconOffset?: number[];
        iconShape?: any;
        interactiveZIndex?: boolean;
        interactivityModel?: string;
        openBalloonOnClick?: boolean;
        openEmptyBalloon?: boolean;
        openEmptyHint?: boolean;
        openHintOnHover?: boolean;
        pane?: string;
        pointOverlay?: string | ((geometry: import("yandex-maps").IPixelPointGeometry, data?: import("yandex-maps").IOptionManagerData, options?: object) => import("yandex-maps").vow.Promise);
        syncOverlayInit?: boolean;
        useMapMarginInDragging?: boolean;
        visible?: boolean;
        zIndex?: number;
        zIndexActive?: number;
        zIndexDrag?: number;
        zIndexHover?: number;
    } & {
        hasBalloon?: boolean;
        hasHint?: boolean;
    } & {
        __proto__?: {
            isVisited?: boolean;
            isSelected?: boolean;
        } & {
            balloonAutoPan?: boolean;
            balloonAutoPanCheckZoomRange?: boolean;
            balloonAutoPanDuration?: number;
            balloonAutoPanMargin?: number | number[];
            balloonAutoPanUseMapMargin?: boolean;
            balloonCloseButton?: boolean;
            balloonCloseTimeout?: number;
            balloonContentLayout?: string | import("yandex-maps").IClassConstructor<import("yandex-maps").ILayout>;
            balloonInteractivityModel?: string;
            balloonLayout?: string | import("yandex-maps").IClassConstructor<import("yandex-maps").ILayout>;
            balloonMaxHeight?: number;
            balloonMaxWidth?: number;
            balloonMinHeight?: number;
            balloonMinWidth?: number;
            balloonOffset?: number[];
            balloonOpenTimeout?: number;
            balloonPane?: string;
            balloonPanelContentLayout?: string | import("yandex-maps").IClassConstructor<import("yandex-maps").ILayout>;
            balloonPanelMaxHeightRatio?: number;
            balloonPanelMaxMapArea?: number;
            balloonShadow?: boolean;
            balloonShadowLayout?: string | import("yandex-maps").IClassConstructor<import("yandex-maps").ILayout>;
            balloonShadowOffset?: number[];
            balloonZIndex?: string;
        } & import("yandex-maps").layout.IImageOptionsWithIconPrefix & {
            iconContentLayout?: string | import("yandex-maps").IClassConstructor<import("yandex-maps").ILayout>;
            iconContentOffset?: number[];
            iconContentSize?: number[];
        } & import("yandex-maps").layout.IPieChartOptionsWithIconPrefix & {
            preset?: string;
            iconColor?: string;
            iconLayout?: string | import("yandex-maps").IClassConstructor<import("yandex-maps").ILayout>;
            cursor?: string;
            draggable?: boolean;
            hasBalloon?: boolean;
            hasHint?: boolean;
            hideIconOnBalloonOpen?: boolean;
            iconOffset?: number[];
            iconShape?: any;
            interactiveZIndex?: boolean;
            interactivityModel?: string;
            openBalloonOnClick?: boolean;
            openEmptyBalloon?: boolean;
            openEmptyHint?: boolean;
            openHintOnHover?: boolean;
            pane?: string;
            pointOverlay?: string | ((geometry: import("yandex-maps").IPixelPointGeometry, data?: import("yandex-maps").IOptionManagerData, options?: object) => import("yandex-maps").vow.Promise);
            syncOverlayInit?: boolean;
            useMapMarginInDragging?: boolean;
            visible?: boolean;
            zIndex?: number;
            zIndexActive?: number;
            zIndexDrag?: number;
            zIndexHover?: number;
        } & {
            hasBalloon?: boolean;
            hasHint?: boolean;
        } & any;
    }>;
}
