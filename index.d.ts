declare var isZoomRestricted: boolean

declare var isAdmin: boolean

declare var get_searchword: undefined | string

declare var gos_global: [{ id: string, name: string }]

type EconomicZones = {
    id: string;
    name: string;
    company_id: string;
    project_id: string;
    adress: string;
}

interface CompanyProdAddressType {
    id: number
    company_id: number
    name: string
}

type IEconomicZonesCollection<TObj extends EconomicZones> = {
    [k in TObj['id']]: TObj
}

declare var industrial_global: IEconomicZonesCollection<EconomicZones>;
