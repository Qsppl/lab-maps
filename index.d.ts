type EconomicZones = {
    id: string
    name: string
    company_id: string
    project_id: string
    adress: string
}

interface CompanyProdAddressType {
    id: number
    company_id: number
    name: string
}

/** @type {string | null | undefined} Поисковый запрос со страницы views\search\search_projects_final.php. Содержит обычную строку с пробелами и без обработки; like ?s=капитатьный ремонт. */
declare var get_searchword: string | null | undefined

/** @type {number[] | undefined} Id-шники моделей ProjectsFinal которые нужно отобразить на карте. Это скорее всего со страницы поиска. */
declare var projects_to_map: number[] | undefined

/**
 * Таблица актуальных Стадий, кроме стадий "Введен в эксплуатацию" и "Отменен".
 * - "дочерние" стадии исключены;
 * - "устаревшие" стадии исключены;
 * - стадии "5: Введен в эксплуатацию" и "10: Отменен" исключены.
 * - поле 'name' локализовано - таблица отсортирована по id 
 * - "запрещенные пользователю" стадии исключены
 * @type {{ id: number; name: string }[] | undefined} 
 */
declare var stage_global: { id: number; name: string }[] | undefined

/**
 * Таблица Типов Работ.
 * - Поле 'name' локализовано
 * @type {{ id: number; name: string }[] | undefined} 
 */
declare var work_type_global: { id: number; name: string }[] | undefined

/**
 * Таблица актуальных Секторов Экономики.
 * - "дочерние" сектора исключены;
 * - "устаревшие" сектора исключены;
 * - поле 'name' локализовано
 * - таблица отсортирована по id
 * - "запрещенные пользователю" сектора исключены
 * @type {{ id: number; name: string }[] | undefined} 
 */
declare var sector_global: { id: number; name: string }[] | undefined

type IEconomicZonesCollection<TObj extends EconomicZones> = {
    [k in TObj['id']]: TObj
}

/** @type {IEconomicZonesCollection<EconomicZones> | undefined} Коллекция Экономических Зон `{EconomicZones.id: EconomicZones, ...}` */
declare var industrial_global: IEconomicZonesCollection<EconomicZones> | undefined

/**
 * Таблица актуальных Субсектор Экономики.
 * - "устаревшие" субсектора исключены;
 * - поле 'name' локализовано
 * @type {{ id: number; name: string }[] | undefined}
 */
declare var subsectors_global: { id: number; name: string }[] | undefined

/**
 * Таблица актуальных Регионов
 * - "устаревшие" регионы исключены;
 * - поле 'name' локализовано
 * - таблица отсортирована по id
 * - "запрещенные пользователю" регионы исключены
 * @type {{ id: number; name: string }[] | undefined}
 */
declare var region_global: { id: number; name: string }[] | undefined

/**
 * Таблица Стран ЕАЭС и Китай.
 * - поле 'name' локализовано
 * - таблица отсортирована по id
 * - "запрещенные пользователю" страны исключены
 * @type {{ id: number; code: number; name: string } | undefined}
 */
declare var country_global: { id: number; code: number; name: string } | undefined

/** @type {number[] | undefined} Коды стран из GET-параметра countries отфильтрованные по вхождению в группу стран ЕАЭС или Китай. */
declare var get_countrys_ids: number[] | undefined

/**
 * Таблица Типов Гос-Компаний.
 * - "устаревшие" типы гос-компаний исключены;
 * - поле 'name' локализовано
 * - "запрещенные пользователю" типы гос-компаний исключены
 * @type {{ id: number; name: string }[] | undefined}
 */
declare var gos_global: { id: number; name: string }[] | undefined

/** @type {{ 'id': number; 'name': string; 'start': number; 'end': number }[] | undefined} Диапазоны инвестиций для фильтра карт. */
declare var cost_global: { 'id': number; 'name': string; 'start': number; 'end': number }[] | undefined

/** @type {{ id: number; name: string; projects: number[] }[] | undefined} */
declare var _folders: { id: number; name: string; projects: number[] }[] | undefined

/** @type {number[] | undefined} */
declare var _seenGroupMy: number[] | undefined

/** 
 * Компания, пренадлежащая текущему пользователю
 * - Пустой массив, если у пользователя нет компании или у компании пользователя не указано ни фактического, ни юридического адреса
 * @type {{ id: number; company_id: number; addess: string; typeData: CompanyProdAddressType }[] | undefined}
 */
declare var companyProdAddresses: { id: number; company_id: number; addess: string; typeData: CompanyProdAddressType }[] | undefined

/** @type {boolean | undefined} Пользователь - администратор? */
declare const isAdmin: boolean | undefined

/** @type {boolean | undefined} Пользователь - администратор или редактор? */
declare const isAdminOrEditor: boolean | undefined

/** @type {boolean | undefined} Не удалось определить что это. */
declare const isDemo: boolean | undefined

/** @type {boolean | undefined} Не удалось определить что это. */
declare const needToClean: boolean | undefined

/** @type {boolean | undefined} Пользователь потратил дневной лимит просмотра проектов. */
declare const isUserSpentDailyLimit: boolean | undefined

declare const g_subs_regions: any

declare const g_subs_sectors: any

declare const g_subs_stages: any

/** @type {number | undefined} Количество активных проектов investproject. */
declare const totalProjects: number | undefined
