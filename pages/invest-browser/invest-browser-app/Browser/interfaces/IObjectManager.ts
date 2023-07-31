import { IUserFocusEmmiter } from "../../UserInterface/interfaces/IUserFocusEmmiter.js"
import { Emitter } from "/node_modules/mitt/index.js"

type GeoObject = ymaps.geometry.json.IFeatureJson<ymaps.geometry.json.Point, any, any>
type GeoObjectsCluster = ymaps.geometry.json.IClusterJson<ymaps.geometry.json.Point, any, any, GeoObject>

export interface IObjectManager extends IUserFocusEmmiter {
    _loadingManager: Promise<ymaps.LoadingObjectManager<any, any, any, any>>


    addFocusFistener(f: (feathure: ymaps.geometry.json.IFeatureJson<any, any, any>) => Promise<boolean>): void

    deleteFocusFistener(f: (feathure: ymaps.geometry.json.IFeatureJson<any, any, any>) => Promise<boolean>): void

    defocus(): void

    events: Emitter<{
        "load-object": GeoObject
        "create-cluster": GeoObjectsCluster
    }>
}