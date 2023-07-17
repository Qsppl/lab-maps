import { IUserFocusEmmiter } from "../../UserInterface/interfaces/IUserFocusEmmiter.js"

export interface IObjectManager extends IUserFocusEmmiter {
    _loadingManager: Promise<ymaps.LoadingObjectManager<any, any, any, any>>


    addFocusFistener(f: (feathure: ymaps.geometry.json.IFeatureJson<any, any, any>) => Promise<boolean>): void

    deleteFocusFistener(f: (feathure: ymaps.geometry.json.IFeatureJson<any, any, any>) => Promise<boolean>): void

    defocus(): void
}