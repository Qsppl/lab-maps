"use strict"

import { ProjectsLoadingObjectManager } from "../LoadingObjectsManager/dto/project.js"

export interface IMap {
    setCenter(coordinate: [number, number]): Promise<void>

    setZoom(zoom: number): Promise<void>

    addProjectsManager(loadingManager: ProjectsLoadingObjectManager): Promise<void>
}