declare namespace projectsLoader {
    type Feathure = ymaps.geometry.json.IFeatureJson<
        ymaps.geometry.json.Point,
        PlacemarkOptions,
        {} & ProjectJsonProperties
    > & {
        /** Стадия проекта */
        t: number
        /** Id отрасли */
        s: number
        /** Id региона */
        o: number | null
        /** Номер типа гос-компании */
        g: number
        /** неизвестный параметр */
        c: number
        /** Код страны */
        z: number
        /** неизвестный параметр */
        l: number | null
        /** неизвестный параметр */
        u: number | null
        /** Номер типа работ */
        wt: number
        /** Id экономической зоны */
        iz: number | null
    }

    type ProjectJsonProperties = {
        /** какая-то фигня (равно Id проекта) */
        clusterCaption: number
    }

    type PlacemarkOptions = ymaps.PlacemarkOptions

    type PointOptions = ymaps.geometryEditor.PointOptions
}