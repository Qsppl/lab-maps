"use strict"

import { GeoTerritory } from "../../GeoTerritory/GeoTerritory.js"

export interface IMap {
    setCenter(coordinate: [number, number]): Promise<void>

    setZoom(zoom: number): Promise<void>

    addObjectsManager(objectManager: ymaps.LoadingObjectManager<any, any, any, any> | ymaps.ObjectManager<any, any, any>): any

    addGeoTerrirory(territory: GeoTerritory): Promise<void>

    removeGeoTerritory(territory: GeoTerritory): Promise<void>

    viewTerritories(territories: GeoTerritory[]): void
}