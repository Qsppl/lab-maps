import { IUserFocusEmmiter } from "../../UserInterface/interfaces/IUserFocusEmmiter.js"

export interface IFocusEmmitersController {
    deleteFocusEmmiter(emmiter: IUserFocusEmmiter): void

    addFocusEmmiter(emmiter: IUserFocusEmmiter): void
}