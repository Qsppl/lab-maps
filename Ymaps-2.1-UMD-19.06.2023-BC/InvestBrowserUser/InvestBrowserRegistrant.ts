class InvestBrowserRegistrant extends InvestBrowserFreeRestrictedUser implements IInvestBrowserUser {
    /** Пользователь не зарегистрирован */
    readonly isGuest = false

    /** пользователь зарегистрирован, но не имеет подписки */
    readonly isRegistrant = true
}