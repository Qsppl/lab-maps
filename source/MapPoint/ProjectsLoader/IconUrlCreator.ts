export class IconUrlCreator {
    public static projectIconsUrl = '/web/img/map/icons/svg/'

    private static stageToToken = new Map<number, string>([
        [17, "st_1"], [2, "st_2"], [3, "st_3"], [7, "st_4"], [4, "st_5"], [5, "st_6"], [8, "st_upgrade"], [6, "st_pause"], [10, "st_stop"]
    ])

    private static isForeignToToken = new Map<boolean, string>([[false, ""], [true, "eaeu"]])

    private static isVisitedToToken = new Map<boolean, string>([[false, "normal"], [true, "visited"]])

    private static isFolderItemToToken = new Map<boolean, string>([[false, ""], [true, "f"]])

    public static createFileNameByProjectProperties(stage: number, isForeign: boolean, isVisited: boolean, isFolderItem: boolean): string {
        const tokens = [
            // first: /stage_...
            this.stageToToken.get(stage),
            // then: ...foreign_...
            this.isForeignToToken.get(isForeign),
            // and then: ...visited_...
            this.isVisitedToToken.get(isVisited),
            // finnaly: ...folder_...
            this.isFolderItemToToken.get(isFolderItem)
        ].filter((value) => value.length)
        return `${tokens.join("_")}.svg`
    }
}