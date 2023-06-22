/** @deprecated */
export interface ProjectData extends ProjectsDataDTO {
    properties: {
        /** какая-то фигня (равно Id проекта) */
        clusterCaption: number

        // Динамические данные

        /** Проект состоят в какой-либо папке */
        isFolderItem?: boolean

        /** Это иностранный проект */
        isForeign?: boolean

        /** Пользователь уже нажимал на этот поинт? */
        isVisited?: boolean
    }
}