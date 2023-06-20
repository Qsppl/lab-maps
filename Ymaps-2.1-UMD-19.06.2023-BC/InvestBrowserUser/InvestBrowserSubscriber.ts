class InvestBrowserSubscriber extends InvestBrowserBaseUser implements IInvestBrowserUser {
    /** Пользователь не зарегистрирован */
    isGuest: boolean = false
    /** пользователь зарегистрирован, но не имеет подписки */
    isRegistrant: boolean = false
    /** Пользователь потратил дневной лимит просмотра проектов */
    isSpentDailyLimit: boolean = false
}