import { Browser } from "./Browser/Browser.js"
import { YandexMapAdapter } from "./Map/YandexMapAdapter.js"
import { Guest } from "./User/Guest.js"
import { Registrant } from "./User/Registrant.js"
import { Subscriber } from "./User/Subscriber.js"
import { UserInterface } from "./UserInterface/UserInterface.js"

const mapAdapter = new YandexMapAdapter('#map')

const user = getUserImplementation()

const userInterface = new UserInterface(mapAdapter, user.languageLocale)

const investBrowser = new Browser(mapAdapter, userInterface, user)

/** Ищет подходящую имплементациюю класса InvestBrowserUser */
function getUserImplementation() {
    if (globalThis.isGuest) return new Guest()
    if (globalThis.isRegistrant) return new Registrant()
    if (globalThis.isSubscriber) return new Subscriber()
    throw new TypeError("Не определены необходимые глобальные переменные")
}