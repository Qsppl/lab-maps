const investBrowserClient: IInvestBrowserClient = InvestBrowserUser.getImplementation()

const mapAdapter = new YandexMapAdapter('#map')
if (isZoomRestricted) mapAdapter.restrictZoom()

const investBrowser = new InvestBrowser(
    mapAdapter,
    new InvestBrowserUI(mapAdapter, globalThis.app.languageLocale),
    client
)