"use strict"

const projectIconsUrl = 'https://investprojects.info/web/img/map/icons/svg/'

const stageToToken = new Map<number, string>([
    [17, "st_1"], [2, "st_2"], [3, "st_3"], [7, "st_4"], [4, "st_5"], [5, "st_6"], [8, "st_upgrade"], [6, "st_pause"], [10, "st_stop"]
])

/** Наличие и отсутствие каждого флага соответствует определенному токену в адресе иконки */
const isForeignToToken = new Map<boolean, string>([[false, ""], [true, "eaeu"]])

/** Наличие и отсутствие каждого флага соответствует определенному токену в адресе иконки */
const isSelectedToToken = new Map<boolean, string>([[false, ""], [true, "active"]])

/** Наличие и отсутствие каждого флага соответствует определенному токену в адресе иконки */
const isVisitedToToken = new Map<boolean, string>([[false, ""], [true, "visited"]])

/** Наличие и отсутствие каждого флага соответствует определенному токену в адресе иконки */
const isFolderItemToToken = new Map<boolean, string>([[false, ""], [true, "f"]])

export function resolveProjectIconUri(stage: number, isForeign: boolean, isSelected: boolean, isVisited: boolean, isFolderItem: boolean): string {
    const parts = ([
        // first: /stage_...
        stageToToken.get(+stage),

        // then: ...foreign_...
        isForeignToToken.get(!!isForeign),

        // and then: ...visited_...
        isSelectedToToken.get(!!isSelected) || isVisitedToToken.get(!!isVisited) || "normal",

        // finnaly: ...folder_...
        isFolderItemToToken.get(!!isFolderItem)
    ].filter(value => value && value.length))

    return `${projectIconsUrl}${parts.join("_")}.svg`
}