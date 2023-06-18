const prodImgPath = 'https://investprojects.info/web/img/map/icons/svg/'
const localImgPath = 'http://i.i/img/map/icons/svg/'
const imgType = '.svg'

const projectIconSize = [24, 24]
const projectIconOffset = [-12, -12]

const projectIconSizeBig = [32, 32]
const projectIconOffsetBig = [-16, -16]

const clusterIconSize = [24, 24]
const clusterIconOffset = [-12, -12]
const clusterIconSizeBig = [32, 32]
const clusterIconOffsetBig = [-16, -16]
const clusterIconSizeBigHover = [40, 40]
const clusterIconOffsetBigHover = [-20, -20]

const clusterFontSize = '7px'

function getIconPath(type = 'p', stage = 2, typeVisited = 'normal', feature = null, isFolder = false) {
    let path = prodImgPath//localImgPath

    stage = parseInt(stage, 10)
    if (type === 'com') {
        path += 'company_'
    } else {
        if (type === 'p' || type === 'project') {
            switch (stage) {
                case 17:
                    path += 'st_1_'
                    break
                case 2:
                    path += 'st_2_'
                    break
                case 3:
                    path += 'st_3_'
                    break
                case 7:
                    path += 'st_4_'
                    break
                case 4:
                    path += 'st_5_'
                    break
                case 5:
                    path += 'st_6_'
                    break
                case 8:
                    path += 'st_upgrade_'
                    break
                case 10:
                    path += 'st_stop_'
                    break
                case 6:
                    path += 'st_pause_'
                    break
            }
        } else {
            path += 'few_'
        }
        if (feature) {
            if (type === 'p' || type === 'project') {
                //пометим как просмотренный если надо (массив My)
                if (typeVisited !== 'active' && typeof _seenGroupMy !== 'undefined' && _seenGroupMy.includes(parseInt(feature.id, 10))) typeVisited = 'visited'
                if (feature.o && getIsForeignFeature(feature)) {
                    path += 'eaeu_'
                }
            } else if (type === 'c' || type === 'company') {
                let isForeignFeature = false
                if (!feature.features) {
                    isForeignFeature = getIsForeignFeature(feature)
                } else {
                    feature.features.forEach(f => {
                        if (getIsForeignFeature(f)) {
                            isForeignFeature = true
                            return
                        }
                    })
                }
                if (isForeignFeature) {
                    path += 'eaeu_'
                }
            }
        }
    }

    path += typeVisited

    if (isFolder) path += '_f'

    path += imgType

    return path
}

function makeFeaturesArray(resp_projects) {
    let endFeatures = []
    let features = resp_projects.features;
    if (features) {
        features.forEach((project) => {
            if (+project[1] === 5 && !app.isAdmin) {
                return true
            }
            let this_feature = {}
            this_feature.id = project[0]
            this_feature.t = project[1]
            this_feature.s = project[2]
            this_feature.y = project[3]
            this_feature.o = project[4]//region_id
            this_feature.g = project[5]
            this_feature.c = project[6]
            this_feature.x = {
                c: [project[7], project[8]]
            }
            this_feature.b = {
                c: project[0]
            }
            this_feature.z = project[9]//country
            this_feature.l = project[10]
            this_feature.u = project[11]
            this_feature.wt = project[12]
            this_feature.iz = project[13]//industrial
            endFeatures.push(this_feature)
        })
        resp_projects.features = endFeatures
    }
    return resp_projects
}

function parseFeaturesArray(resp_projects) {
    let endFeatures = []
    let features = resp_projects.features;
    if (features) {
        features.forEach((project) => {
            let this_feature = {}
            this_feature.type = 'Feature'
            this_feature.id = project.id
            this_feature.t = project.t
            this_feature.s = project.s
            this_feature.y = project.y
            this_feature.o = project.o//region_id
            this_feature.g = project.g
            this_feature.c = project.c
            this_feature.z = project.z//country
            this_feature.l = project.l
            this_feature.u = project.u
            this_feature.wt = project.wt
            this_feature.iz = project.iz//industrial
            this_feature.geometry = {
                coordinates: [project.x.c[0], project.x.c[1]],
                type: 'Point'
            }
            this_feature.properties = {
                clusterCaption: project.b.c
            }
            endFeatures.push(this_feature)
        })
        resp_projects.features = endFeatures
    }
    return resp_projects
}

function reloadFoldersContent() {
    fetch('/ymap/folders-renew-content')
        .then(res => res.text())
        .then(res => {
            folders_control_panel.find('#folders_container').empty().html(res)
        })
        .catch(err => {
            console.error(err)
        })
}

function highlightRegions(map, ISO) {
    //ISO - array of ISO3166 codes
    if (typeof (map.ymap) !== 'undefined') map = map.ymap
    return ymaps.borders.load('RU', {
        lang: 'ru',
        quality: 2
    })
        .then(function (geojson) {
            for (let i = 0; i < geojson.features.length; i++) {
                if (!ISO.includes(geojson.features[i].properties.iso3166)) continue
                const geoObject = new ymaps.GeoObject(geojson.features[i])
                map.geoObjects.add(geoObject)
            }
        })
}

function highlightCountry(map, iso2) {
    if (typeof (map.ymap) !== 'undefined') map = map.ymap
    return ymaps.borders.load('001', {
        quality: 2
    })
        .then(function (geojson) {
            for (let i = 0; i < geojson.features.length; i++) {
                if (!iso2.includes(geojson.features[i].properties.iso3166)) continue
                const geoObject = new ymaps.GeoObject(geojson.features[i])
                map.geoObjects.add(geoObject)
            }
        })
}

function getIsForeignFeature(f) {
    if (f.o && f.o == 89) return true
    return false
}

function addUsedProjects(projectsIds) {
    //при клике на проекты добавляет в общий массив уникальные
    ymaps.usedProjects = [...(new Set([...ymaps.usedProjects, ...projectsIds]))]
    localStorage.setItem('usedProjects', ymaps.usedProjects)
}

function getUsedProjects() {
    const used = localStorage.getItem('usedProjects')
    if (!used) return []
    return localStorage.getItem('usedProjects').split(',').map(item => parseInt(item, 10))
}

function isProjectInAnyFolder(projectId) {
    let isInFolder = false
    _folders.forEach(f => {
        if (f.projects.includes(projectId)) {
            isInFolder = true
            return
        }
    })
    return isInFolder
}

const tooManyApproximatelyProjects = function (ids) {
    if (!ids || !ids.length) return false
    ids = ids.map(t => parseInt(t, 10))
    const maxApproximProjects = 15
    if (ids.length < maxApproximProjects) return false
    let proj_x, proj_y
    const dubles = []
    let isTooMany = false
    let dublesCounter = 0
    let str = ''

    for (const [key, p] of Object.entries(projects_all.features)) {
        if (!ids.includes(p.id)) continue
        proj_x = parseFloat(p.geometry.coordinates[0])
        proj_y = parseFloat(p.geometry.coordinates[1])
        str = proj_x + '-' + proj_y
        if (dubles.includes(str)) dublesCounter++
        else dubles.push(str)
        if (dublesCounter > maxApproximProjects) {
            isTooMany = true
            break
        }
    }

    return isTooMany
}

const addZoomButtons = function (map) {
    map.controls.add(
        new ymaps.control.ZoomControl({
            options: {
                size: 'small',
                position: {
                    right: 10,
                    top: 200
                }
            }
        })
    )
}

const checkGuestProjectOpen = function (plus) {
    //записываем сколько гость открывал
    const alreadyOpened = +localStorage.getItem('gsp')
    if ((+alreadyOpened + +plus) >= guestProjectsAvailable) {
        localStorage.setItem('gsp', (+alreadyOpened + +plus))
        showGuestWnd()
    } else {
        localStorage.setItem('gsp', (+alreadyOpened || 0) + +plus)
    }

}

const getStageName = function (project) {
    let name = project.stageData.name;
    const nameAttr = app.languageLocale == 'ru' ? 'name' : 'name_en';
    // if (project.stageData.id == 4 && project.subStageData) {
    //     name += ` (${project.subStageData[nameAttr]})`;
    // }
    if (project.stageData.id == 6 && project.laststageData) {
        name += ` (${app.t('на стадии')} ${project.laststageData[nameAttr].toLowerCase()})`;
    }
    return name;
}

const getProjectsString = function (this_control) {
    let ret = '<div>'
    //const allSeen = getUsedProjects().concat(_seenGroupMy)
    const allSeen = typeof _seenGroupMy !== 'undefined' ? _seenGroupMy : []
    ret += '<button type="button" class="close close_project_info_cnt"><span aria-hidden="true">×</span></button>'
    let isEmptyContent = false
    const type = this_control.type
    if (type === 'projects') {
        ret += '<div id="projects_lines_cnt">'
        if (typeof projects_all !== 'undefined') {
            if (tooManyApproximatelyProjects(this_control.projects_all_ids)) {
                ret += '<div class="projectsWnd_address_caption text-center">' + app.t('Адреса этих проектов в данный момент уточняются') + '</div>'
            }
        }
        if (isGuest || isRegistrant) {
            checkGuestProjectOpen(1)
        }
        this_control.projects.forEach((project, i) => {
            if (!project) return
            if (project.err) {
                if (typeof map !== 'undefined') removeProjectInfoCnt(map.renderedCustomControl)
                if (typeof sm !== 'undefined') removeProjectInfoCnt(sm.renderedCustomControl)
                switch (project.type) {
                    case 'noaccess':
                        ret = ''
                        $('#no-access').modal('show')
                        isEmptyContent = true
                        return false
                        break
                    case 'limit':
                        // ret = ''
                        app.limitCheck('ymaps_daily_limit', {
                            projects_quantity: this_control.projects_quantity
                        })
                        // isEmptyContent = true
                        // return false
                        break
                    default:
                        ret += '<div><b style="color:red;">' + project.name + '</b></div>'
                }
            } else {
                if (typeof isGuest === 'undefined') window.isGuest = false
                if (Number.isInteger(+project.id)) {
                    project.id = parseInt(project.id, 10)
                }
                let folderBtn = '',
                    foldersText = [],
                    commentsText = '',
                    modalTxt = 'modal-add-to-folder'
                if (isGuest) {
                    modalTxt = 'no-access'
                }
                let fav = false, archive = false
                if (project.myCurrentData) {
                    if (typeof project.myCurrentData.archive !== 'undefined' && project.myCurrentData.archive) archive = +project.myCurrentData.archive
                    if (typeof project.myCurrentData.favorite !== 'undefined' && project.myCurrentData.favorite) fav = +project.myCurrentData.favorite
                }
                if (project.foldersForUser) {
                    project.foldersForUser.forEach(f => {
                        if (f.user_id == app.uid) {
                            let folderName = null;
                            if (typeof f.name !== 'undefined' && f.name) {
                                folderName = f.name;
                            }
                            if (typeof f.userData !== 'undefined' && folderName) {
                                folderName += ` [${f.userData.name}]`;
                            }
                            if (folderName) {
                                foldersText.push(folderName)
                            }
                        }
                    })
                }
                if (project.projectComment) {
                    commentsText += '<div class="mt-1">'
                    project.projectComment.forEach(c => {
                        if (c.user_id == app.uid) {
                            const date = new Date(c.created * 1000)
                            const createdStr = date.toLocaleDateString("ru-RU", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                            })
                            commentsText += `<span class="small d-block comment-text inline-block"><span class="text-muted">${date.getHours()}:${date.getMinutes()} ${createdStr}:</span> ${c.comment}</span>`
                        }
                    })
                    commentsText += '</div>'
                }

                if (!app.isSectorPage() && !app.isRegionPage() && !app.isIndustrialPage()) {
                    folderBtn = `
                        <span ${(!foldersText.length ? 'style="display:none;"' : '')} class="my-proj__info-folder">${foldersText}</span>
                        <a href="#" data-limit_id="project_to_folder" data-toggle="modal" data-target="#${modalTxt}" data-project_id="${project.id}" class="project_to_folder_btn">
                            <i data-placement="top" class="sm-icon" data-toggle="tooltip" data-original-title="Добавить в папку">
                            <img src="/web/svg/edit-pr_2-09.svg" style="width:16px;height:16px;"></i>
                        </a>
                    `

                }

                let seenProject = false
                let projectLink = app.en_prefix + '/project-base/' + project.id;
                let linkAttr = 'target="_blank"';
                let hideMe = (typeof project.hideMe !== 'undefined' || !Number.isInteger(project.id));
                if (hideMe) { // project num is masked
                    linkAttr = 'data-toggle="modal" data-target="#no-access-guest-map"';
                    projectLink = '#';
                } else if (typeof allSeen !== 'undefined' && allSeen && allSeen.length) {
                    seenProject = allSeen.includes(+project.id)
                }
                let projectId = hideMe ? '·····' : project.id;
                let dateUpdatedStr = '';
                if (Number.isInteger(+project.proovetime_)) {
                    const dateUpdated = new Date(project.proovetime_ * 1000)
                    dateUpdatedStr += '<br>' + app.t('Обновлен') + ': ' + dateUpdated.toLocaleDateString("ru-RU", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                    })
                }

                ret += '<div class="mb-0 ' + (i < (this_control.projects.length - 1) ? 'border-bottom' : '') + ' pb-2 project_wnd_line com_project_line">' +
                    '<a href="' + projectLink + '"' + (linkAttr ? ' ' + linkAttr : '') + '><h5 class="mb-0 ' + (seenProject ? 'seen_project_href' : '') + '">' +
                    (archive ? '<span class="my-proj__info-trash small" style="color:#fff">А</span>' : '') +
                    (fav ? '<span class="my-proj__info-favorites small" style="color:#fff">✪</span>' : '') +
                    '<span class="project_id">ID ' + projectId + ' </span>' + project.name + '</h5></a>' +
                    '<div>' + project.contacts_line + '</div>' +
                    '<div class="project_wnd_line_info">' + app.t('Стадия') + ': ' + getStageName(project);
                ret += dateUpdatedStr;
                if (project.sectorData !== null) {
                    ret += `<div class="project_sector_line">${app.t('Отрасль')}: <a target="_blank" href="${app.lang_prefix}/sectors/${app.makeUrlName(project.sectorData.name_en)}">${project.sectorData.name}</a></div>`;
                }

                ret += `${(app.languageLocale === 'en' ? 'Investments' : 'Инвестиции')}: ${project.cost}
                         <br>${(app.languageLocale === 'en' ? 'Own' : 'Собственность')}: ${app.t(project.gosData.name)}` +
                    commentsText +
                    `<div class="d-flex justify-content-between w-100"><div class="mt-3"><a target="_blank" ${linkAttr ? ' ' + linkAttr : ''} href="${projectLink}">${(app.languageLocale === 'en' ? 'Show more >>' : 'Подробнее >>')}</a></div>
                        <div class="projects_folders_cnt" ${!foldersText.length ? 'style="justify-content:flex-end"' : ''}>
                            ${folderBtn}
                        </div></div>
                        
                        ` +

                    '</div>' +
                    '</div>';
            }
            //'<br>Местоположение: ' + (project.place ? project.place : project.ymapsData.address) +

        })
        ret += '</div>'//projects_lines_cnt
        ret += '<div id="proj_wnd_showMore">'
        let ids = !app.isGuest ? this_control.projects.map(p => p.id).join(',') : ''
        if (ids.includes('putty')) ids = ''
        //условия показа кнопки "показать еще 5"
        if (
            this_control.projects.length < this_control.projects_all_ids.length &&
            (this_control.projects_all_ids.length > this_control.projects.length || this_control.projects_all_ids.length > 5)
        ) {
            ret += '<div style="color:#2466b2;cursor:pointer; text-decoration: underline;" id="projects_wnd_showmore" data-all_ids="'
                + this_control.projects_all_ids.join(',') + '" data-loaded_ids="' + ids + '">' + app.t('Показать еще') + '</div><div>(' + app.t('будет списано с лимитов просмотра проектов на карте') + ')</div>'
        }
    } else if (type === 'company') {
        this_control.company.forEach((company) => {
            ret += '<div id="projects_lines_cnt">'
            ret += '<div><a href="/company/' + company.inn + '" target="_blank">' + company.short_name + '</a></div>'
            company.companyOkpdDataset.forEach(okpd => {
                ret += '<div>- '
                ret += okpd.okpdData.name
                ret += '</div>'
            })
            ret += '</div>'//projects_lines_cnt
        })
    }

    ret += '</div>'
    ret += '</div>'//glob div
    if (isEmptyContent) return false
    return ret
}

function removeProjectInfoCnt(control) {
    if (control) control.onRemoveFromMap()
}

function resetRecounter() {
    $('#screenSummboxNumber').html((app.languageLocale === 'en' ? 'Projects on the screen:' : 'Проектов на карте: ') + '<img id="refresh_png" src="https://investprojects.info/web/img/map/refresh.png">')
    $('#loader-1').removeClass('green')
    $('#loader-1').addClass('red')
    $('#screenSummboxNumber').addClass('red')
}