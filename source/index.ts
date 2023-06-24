import { Browser } from "./Browser/Browser.js"
import { YandexMapAdapter } from "./Map/YandexMapAdapter.js"
import { Guest } from "./User/Guest.js"
import { Registrant } from "./User/Registrant.js"
import { Subscriber } from "./User/Subscriber.js"
import { UserInterface } from "./UserInterface/UserInterface.js"

const mapAdapter = new YandexMapAdapter('#map')
globalThis.mapAdapter = mapAdapter

const user = getUserImplementation()
globalThis.user = user

const userInterface = new UserInterface(mapAdapter, mapAdapter, user.languageLocale)
globalThis.userInterface = userInterface

const investBrowser = new Browser(mapAdapter, userInterface, user)
globalThis.investBrowser = investBrowser

/** Ищет подходящую имплементациюю класса InvestBrowserUser */
function getUserImplementation() {
    if (globalThis.isGuest) return new Guest()
    if (globalThis.isRegistrant) return new Registrant()
    if (globalThis.isSubscriber) return new Subscriber()
    throw new TypeError("Не определены необходимые глqweобальные переменные")
}