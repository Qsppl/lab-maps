"use strict"

import { Browser } from "./Browser/Browser.js"
import { Guest } from "./Browser/User/Guest.js"
import { Registrant } from "./Browser/User/Registrant.js"
import { Subscriber } from "./Browser/User/Subscriber.js"
import { YandexMapAdapter } from "./Map/YandexMapAdapter.js"
import { UserInterface } from "./UserInterface/UserInterface.js"

globalThis.investBrowserAppInitialized = main()

// for testing
globalThis.investBrowserAppInitialized.then(({
    user,
    mapAdapter,
    mapPromise,
    userInterface,
    investBrowser,
    projectsLoadingManagerPromise
}) => {
    globalThis.user = user
    globalThis.mapAdapter = mapAdapter
    globalThis.mapPromise = mapPromise
    globalThis.userInterface = userInterface
    globalThis.investBrowser = investBrowser
    globalThis.projectsLoadingManagerPromise = projectsLoadingManagerPromise
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

    const projectsLoadingManager = investBrowser.addProjects()
    // const groupsLoadingManager = investBrowser.addGroups()

    return {
        user,
        mapAdapter,
        mapPromise: mapAdapter._yandexMap,
        userInterface,
        investBrowser,
        projectsLoadingManagerPromise: projectsLoadingManager
    }
}

/** Ищет подходящую имплементациюю класса InvestBrowserUser */
function getUserImplementation() {
    if (globalThis.isGuest) return new Guest()
    if (globalThis.isRegistrant) return new Registrant()
    if (globalThis.isSubscriber) return new Subscriber()
    throw new TypeError("Не определены необходимые глqweобальные переменные")
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