import { Browser } from "./Browser/Browser.js"
import { YandexMapAdapter } from "./Map/YandexMapAdapter.js"
import { Guest } from "./User/Guest.js"
import { Registrant } from "./User/Registrant.js"
import { Subscriber } from "./User/Subscriber.js"
import { UserInterface } from "./UserInterface/UserInterface.js"

/** Компонент карты. Он не выполняет самостоятельной работы, просто управляется UserInterface или Browser */
const mapAdapter = new YandexMapAdapter('#map')
globalThis.mapAdapter = mapAdapter

/** Компонент пользователя. Нужен для работы остальных компонентов. */
const user = getUserImplementation()
const { languageLocale } = user
globalThis.user = user

/**
 * Компонент интерфейса.
 * Прослойка между логикой в Browser и страницей с картой.
 * Предоставляет компоненту Browser возможность размещения данных в пользовательском интерфейсе.
 */
const userInterface = new UserInterface(mapAdapter, mapAdapter, languageLocale)
globalThis.userInterface = userInterface

/** Основной компонент, управляет UserInterface, и YandexMapAdapter */
const investBrowser = new Browser(mapAdapter, userInterface, user)
globalThis.investBrowser = investBrowser

/** Ищет подходящую имплементациюю класса InvestBrowserUser */
function getUserImplementation() {
    if (globalThis.isGuest) return new Guest()
    if (globalThis.isRegistrant) return new Registrant()
    if (globalThis.isSubscriber) return new Subscriber()
    throw new TypeError("Не определены необходимые глqweобальные переменные")
}