declare var isZoomRestricted: boolean

declare var isAdmin: boolean

declare namespace YmapsExtendedNS {
    class LoadingObjectManager<T = ymaps.IGeometry> implements ymaps.ICustomizable, ymaps.IEventEmitter, ymaps.IGeoObject, ymaps.IParentOnMap {
        options: ymaps.IOptionManager;
    
        events: ymaps.IEventManager;
        
        geometry: T | null;
        properties: ymaps.IDataManager;
        state: ymaps.IDataManager;
    
        getOverlay(): Promise<ymaps.IOverlay | null>;
    
        getOverlaySync(): ymaps.IOverlay | null;
    
        getMap(): ymaps.Map;
    }
}

declare const ymapsExt: (typeof YmapsExtendedNS & typeof ymaps)