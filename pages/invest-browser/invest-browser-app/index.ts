"use strict"

import { Browser } from "./Browser/Browser.js"
import { Guest } from "./Browser/User/Guest.js"
import { Registrant } from "./Browser/User/Registrant.js"
import { Subscriber } from "./Browser/User/Subscriber.js"
import { LoadingGroupsManager } from "./LoadingObjectManager/groups/LoadingGroupsManager.js"
import { LoadingProjectsManager } from "./LoadingObjectManager/projects/LoadingProjectsManager.js"
import { YandexMapAdapter } from "./Map/YandexMapAdapter.js"
import { UserInterface } from "./UserInterface/UserInterface.js"

globalThis.investBrowserAppInitialized = main()

const ymaps = globalThis.ymaps

// for testing
globalThis.investBrowserAppInitialized.then((instances) => {
    for (const instanceKey in instances) globalThis[instanceKey] = instances[instanceKey]
})

/** Функция предоставляет возможность прописать последовательность инициализыции этого модуля и зависимых */
async function main() {
    /** Компонент пользователя. Нужен для работы остальных компонентов. */
    const user = getUserImplementation()
    const { languageLocale } = user

    await prepareBodyElement()
    await prepareMapContainerElement('#map')
    if (user instanceof Guest || user instanceof Registrant) await prepareHeader()
    /** Компонент карты. Он не выполняет самостоятельной работы, просто управляется UserInterface или Browser */
    const mapAdapter = new YandexMapAdapter('#map')

    /**
     * Компонент интерфейса.
     * Прослойка между логикой в Browser и страницей с картой.
     * Предоставляет компоненту Browser возможность размещения данных в пользовательском интерфейсе.
     */
    const userInterface = new UserInterface(mapAdapter, mapAdapter, languageLocale)

    /** Основной компонент, управляет UserInterface, и YandexMapAdapter */
    const investBrowser = new Browser(mapAdapter, userInterface, user)

    // "/ymap/load-projects?bounds=%b"
    const loadingProjectsManager = new LoadingProjectsManager("/pages/invest-browser/ambiance/jsonp-projects.js", user.languageLocale)
    // "/ymap/load-project-groups?bounds=%b"
    const loadingGroupsManager = new LoadingGroupsManager("/pages/invest-browser/ambiance/jsonp-load-project-groups.js", user.languageLocale)

    investBrowser.browseObjectsFromObjectManager(loadingProjectsManager)
    investBrowser.browseObjectsFromObjectManager(loadingGroupsManager)

    return {
        user,
        mapAdapter,
        userInterface,
        investBrowser,
        loadingProjectsManager,
        loadingGroupsManager
    }
}

/** Ищет подходящую имплементациюю класса InvestBrowserUser */
function getUserImplementation() {
    try {
        if (globalThis.isGuest) return new Guest()
        if (globalThis.isRegistrant) return new Registrant()
        if (globalThis.isSubscriber) return new Subscriber()
        throw new TypeError("Не определены необходимые глобальные переменные")
    } catch (error) {
        console.warn(error)

        return new Guest()
    }
}

async function prepareBodyElement() {
    await app.querySelectorPromise('body')
    document.body.classList.add('specModalBlackout', 'maps-page')
}

async function prepareHeader() {
    await app.querySelectorPromise('header')
    $('header').hover(function () { $('body').removeClass('modal-open') })
    await app.querySelectorPromise('.form-control--search')
    $('.form-control--search').click(function () { $(this).trigger("focus") })
    $('header').addClass('position-relative')
    $('header').css('z-index', '1060')
}

async function prepareMapContainerElement(containerElement: string | HTMLElement) {
    if (typeof containerElement === "string") containerElement = await app.querySelectorPromise(containerElement)
    $(containerElement).css('height', (window.innerHeight - parseInt($('header:eq(0)').css('height'), 10)) + 'px')
}