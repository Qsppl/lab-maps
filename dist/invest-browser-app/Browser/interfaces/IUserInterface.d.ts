import { ProjectsLoadingObjectManager } from "../LoadingObjectsManager/dto/project.js";
export type ZoomRestrictionPresetKeys = "for-guest" | "for-registrant" | "for-subscriber";
export interface IUserInterface {
    /** Ограничить зум карты в соответствии с предустановленным в классе набором параметров */
    setZoomRestriction(presetKey: ZoomRestrictionPresetKeys): void;
    focusOnCompany(company: {
        id: number;
        company_id: number;
        addess: string;
        typeData: CompanyProdAddressType;
    }): void;
    addProjectsManager(loadingManager: ProjectsLoadingObjectManager): Promise<void>;
}
