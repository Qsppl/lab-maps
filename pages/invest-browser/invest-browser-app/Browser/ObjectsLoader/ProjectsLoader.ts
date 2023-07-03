const ymaps = globalThis.ymaps

type F = projectsLoader.Feathure
type C = projectsLoader.PlacemarkOptions
type I = projectsLoader.PointOptions

export default class ProjectsLoader {
    protected readonly _loader: Promise<ymaps.LoadingObjectManager<F, C, I>>

    constructor() {
        this._loader = new Promise((resolve) => {
            ymaps.ready().then(() => {
                resolve(new ymaps.LoadingObjectManager<F, C, I>(
                    'jsonp-projects.js?bounds=%b',
                    { clusterize: true, gridSize: 36 }
                ))
            })
        })
    }

    get loader() {
        return this._loader
    }
}