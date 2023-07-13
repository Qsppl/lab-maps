export interface IUserFocusEmmiter {
    addFocusFistener(f: () => Promise<boolean>): void

    deleteFocusFistener(f: () => Promise<boolean>): void

    defocus(): void
}