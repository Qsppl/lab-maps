"use strict"

const ymaps = globalThis.ymaps

export interface IFolderItemsManager {
    hasFolderItems: true

    checkIsFolderItemHook?: (feathure: ymaps.geometry.json.IFeatureJson<any, any, any>) => boolean
}