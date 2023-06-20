class InvestBrowserGuest extends InvestBrowserFreeRestrictedUser implements IInvestBrowserUser {
    /** Пользователь не зарегистрирован */
    readonly isGuest = true

    /** пользователь зарегистрирован, но не имеет подписки */
    readonly isRegistrant = false
}