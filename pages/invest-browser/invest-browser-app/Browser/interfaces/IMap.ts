"use strict"

export interface IMap {
    setCenter(coordinate: [number, number]): Promise<void>

    setZoom(zoom: number): Promise<void>

    addObjectsManager(objectManager: ymaps.LoadingObjectManager<any, any, any, any> | ymaps.ObjectManager<any, any, any>): any

    addObject()
}