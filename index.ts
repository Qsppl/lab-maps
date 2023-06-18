'use strict'

var textFile: any = null

var balloon = null
var needOpenBaloon = true
let projects_global = null
let get_project_id = null
let get_zone_id = null
let zonesModel = null
let projects_all = { 'features': [] }
let industrials_active = []
let projectsInActiveIndustrialsOnly = false
let search_projects = []
let borders_onMap = null
let quantityTotal = 1
let getProjectsData = null
let getCompanyData = null
let selectedFoldersProjects = []
let onlyFolders = true
let excludeFolders = false
let seenVisible = false

var MyClusterIconContentLayout = null
var MyClusterIconContentLayoutHover = null

var map = null
var objectManager = null
var objectManagerZones = null
const companiesPlacemarks = []
const inServicePlacemarks = []
let projectsProductSearch = []
let toBase = 'Перейти в базу'
let km = 'км'
let radiusKm = 'радиус, км'
let products = 'продукция'
let register = 'Зарегистрироваться'
let cityVillage = 'Город, поселок'
let projectsList = 'Список проектов'
let phase = 'Стадия'
let investments = 'Инвестиции'
let locationTitle = 'Местоположение'
let rub = 'руб.'
let mln = 'млн.'
let address = 'Адрес'
let caption1 = 'Оформите подписку для получения полного доступа к функционалу карт'
let caption2 = 'Карта строящихся объектов России</h1>Для незарегистрированных пользователей функционал ограничен'
let addLocation = 'Добавить адрес'
let findProducts = 'Поиск продукции'
let myAddresses = 'Мои адреса'
let myFolders = 'Мои папки'
let seenChbx = 'Просмотренные'
let lb_show_more = 'Показать еще'
let lb_debitedLimit = 'будет списано с лимитов просмотра проектов на карте'

// START EXECUTION CODE

if (app.languageLocale === 'en') {
    km = 'km'
    radiusKm = 'radius, km'
    products = 'product name'
    register = 'SignUp'
    toBase = 'Go to Projects'
    cityVillage = 'City, town'
    projectsList = 'Projects on the screen'
    phase = 'Phase'
    address = 'Address'
    investments = 'Investment'
    locationTitle = 'Location'
    addLocation = 'Add location'
    findProducts = 'Find procuts'
    myAddresses = 'My locations'
    myFolders = 'My folders'
    seenChbx = 'Already seen'
    rub = 'rub.'
    mln = 'mln.'
    caption1 = 'Please subscribe to use all map functions'
    caption2 = 'Map of construction projects in Russia</h1>All map functions are only available to subscribers'
    lb_show_more = 'Show more'
    lb_debitedLimit = 'will be taken from the limits of the allowed projects on the map'
}

var selected_stage = []
var selected_work_type = []
var selected_laststage = []
var selected_sector = []
var selected_region = []
var selected_gos = []
var selected_cost = []
var selected_country = []
var selected_layers = []

let minX = null
let minY = null
let maxX = null
let maxY = null
const maxRestrictedZoom = 10
const maxNormalZoom = 18
const maxZoom = isZoomRestricted ? 10 : 18
const minZoom = 4
const regionZoom = 6

const mapCenterX = 55
const mapCenterY = 100

const gosByCode = {
    1: 1,
    0: 2,
    2: 3,
    3: 4
}

let clickedObjectId = null
let clickedObjectType = null
let clickedObjectStage = null
let clicked_balloon = null
let currentTypingRadius = 0
let totalFilteredProjects = 0
let screenFilteredProjects = 0
let renderedCustomControl = null
let filtersTopY = 10
let currentZoom = null
let searchMarks = []

let selectizeParams = {
    closeAfterSelect: false,
    selectOnTab: false,
    persist: true,
    plugins: ['remove_button']
}


let stage_filter_box = $('#stage_filter')
let work_type_filter_box = $('#work_type_filter')
let sector_filter_box = $('#sector_filter')
let fo_filter_box = $('#fo_filter')
let region_filter_box = $('#region_filter')
let gos_filter_box = $('#gos_filter')

let searchBoxCnt = $('<div>', { 'class': 'ymap__search_input_cnt' })
let filterLayers = $('#filter_layers')

// START EXECUTION CODE

let searchBox = $('<input>', { 'id': 'ymapSearchInput', 'class': 'ymap__search_input form-control form-control-sm', 'placeholder': cityVillage })
    .appendTo(searchBoxCnt)
let seachBoxSearchBtn = $('<img>', { 'id': 'search_button', 'class': 'icon_search', 'src': 'https://investprojects.info/web/img/map/i_search.svg' })
    .appendTo(searchBoxCnt)
let totalSummBox = $('<div>', { 'id': app.languageLocale === 'en' ? 'ymapTotalSummDiv_en' : 'ymapTotalSummDiv', 'class': 'ymap__number_div' })
let totalSummBoxPic = $('<img>', { 'class': 'ymap__number_div_icon', 'src': '/web/img/iconsFolder/all-projects.svg' })
let arrowPic = $('<svg height="100%" width="100%">', { 'viewBox': '0 0 12 12', 'xmlns': 'http://www.w3.org/2000/svg' })
    .html('<path class="arrow" d="M6 10C8.20914 10 10 8.20914 10 6C10 3.79086 8.20914 2 6 2C3.79086 2 2 3.79086 2 6C2 8.20914 3.79086 10 6 10Z" fill="currentColor" /> <path class="circle" d="M12 6C12 2.7 9.3 0 6 0C2.7 0 0 2.7 0 6C0 9.3 2.7 12 6 12C9.3 12 12 9.3 12 6ZM6.4 8.6C6.4 8.8 6.2 9 6 9C5.8 9 5.6 8.8 5.6 8.6V4.3L4 5.9C3.9 6 3.6 6 3.5 5.9C3.4 5.8 3.4 5.5 3.5 5.4L5.7 3.2C5.9 3 6.1 3 6.3 3.1L8.5 5.3C8.6 5.4 8.6 5.7 8.5 5.8C8.4 5.9 8.1 6 8 5.9L6.4 4.3V8.6Z" fill="currentColor" />')
let toggleFilterBtn = $('<button>', { 'type': 'button', 'class': 'toggle-filter-btn' })
    .append(arrowPic)

/** панель для работы со складами */
let wh_control_panel = $('<div>', { 'id': 'ymapWhPanel', 'class': 'ymap__wh_panel ymap__wh_panel-new' })
/** панель для работы спапками */
let folders_control_panel = $('<div>', { 'id': 'ymapFoldersPanel', 'class': 'ymap__folders_panel ymap__folders_panel-new' })
let canvas_control_button = $('<div>', { 'id': 'ymapCanvasButton', 'class': 'ymap__canvas_button ymap__canvas_panel-new' })
let g_warehouses_pm = []
let g_warehouses_circles = []

// START EXECUTION CODE

let demoWarningBlock = $('<div>', { class: 'alert-primary default-content-box p-1 demo_warning_block' })
    .html('<div class="row align-items-center">  <div class="col-lg-12 col-md-12 col-12 m-auto"><div class="mb-2 pl-3 pt-2 pr-3 d-flex justify-content-between align-items-center plashka"><span class="pr-3">' + caption1 + '. </span></div>  </div></div>')
let guestWarningBlock = $('<div>', { class: 'alert-primary default-content-box p-1 demo_warning_block' })
    .html('<div class="row align-items-center">  <div class="col-lg-12 col-md-12 col-12 m-auto"><div class="mb-2 pl-3 pt-2 pr-3 d-flex justify-content-between align-items-center plashka"><span class="pr-3"><h1 style="font-size: 14px;">' + caption2 + '.</span><a href="/register" class="btn btn btn-danger">' + register + '</a></div>  </div></div>')

let nowLoading = false
const isGuest = $('#company_id').val() == 'guest'
const isRegistrant = $('#registrant').val() == 'registrant'


// START EXECUTION CODE

var link_from = app.getUrlParameter('link_from') || false

if (app.getUrlParameter('project_id')) get_project_id = +app.getUrlParameter('project_id')
if (app.getUrlParameter('zone_id')) get_zone_id = +app.getUrlParameter('zone_id')

let getFilter_stage = app.getUrlParameter('stages')
    ? app.getUrlParameter('stages').split(',').map(t => +t)
    : []
let getFilter_work_type = app.getUrlParameter('work_type')
    ? app.getUrlParameter('work_type').split(',').map(t => +t)
    : []
let getFilter_laststage = app.getUrlParameter('laststages')
    ? app.getUrlParameter('laststages').split(',').map(t => +t)
    : []
let getFilter_sector = app.getUrlParameter('sectors')
    ? app.getUrlParameter('sectors').split(',').map(t => +t)
    : []
let getFilter_fo = app.getUrlParameter('fos')
    ? app.getUrlParameter('fos').split(',').map(t => +t)
    : []
let getFilter_region = app.getUrlParameter('regions')
    ? app.getUrlParameter('regions').split(',').map(t => +t)
    : []
let getFilter_gos = app.getUrlParameter('gos')
    ? app.getUrlParameter('gos').split(',').map(t => +t)
    : []
let getFilter_cost = app.getUrlParameter('cost')
    ? app.getUrlParameter('cost').split(',').map(t => +t)
    : []
let getFilter_country = app.getUrlParameter('countries')
    ? app.getUrlParameter('countries').split(',').map(t => +t)
    : []
let getFilter_inv = app.getUrlParameter('cost')
    ? app.getUrlParameter('cost').split(',').map(t => +t)
    : []
let get_x = app.getUrlParameter('x')
    ? app.getUrlParameter('x')
    : null
let get_y = app.getUrlParameter('y')
    ? app.getUrlParameter('y')
    : null
let reloadStorage = app.getUrlParameter('clean_storage')
    ? app.getUrlParameter('clean_storage')
    : null
let firstLoadFolders = app.getUrlParameter('folders')
    ? app.getUrlParameter('folders').split(',').map(t => +t)
    : []
let firstLoadLayers = app.getUrlParameter('layers')
    ? app.getUrlParameter('layers').split(',').map(t => t)
    : []

const filterTypes = ['stage', 'work_type', 'laststage', 'sector', 'gos', 'region', 'country', 'cost']
const filterTypesIndex = ['stages', 'work_type', 'laststages', 'sectors', 'gos', 'regions', 'countries', 'investments_filter']
const gosByID = {
    1: 1,
    2: 0,
    3: 2,
    4: 3
}

let guestTimer = null
let fpPromise = null
let fpId = null
let fpOurId = null
let isFpOK = true

const guestMSecondsAvailable = 60000 * 5
const guestProjectsAvailable = 10

// START EXECUTION CODE

// Делаем кнопочку CLOSE для плашки на странице карты
$('#prod_addr_container')
    .append('<span class="close"><img src="https://investprojects.info/web/img/map/i_-07.png" class="fas fa-times"></img></span>')
$('#prod_addr_container .close')
    .on('click', function () {
        $('#prod_addr_container')
            .addClass('d-none')
    })
$('#prod_addr_container .form-control')
    .addClass('form-control-sm')

document.activeElement.blur()

$(document).ready(function () {
    $('.map-controls__full-screen--turn-on').click(function () {
        $(this).removeClass('map-controls__full-screen--active')
        $('.map-controls__full-screen--turn-off').addClass('map-controls__full-screen--active')

        toggleFullScreen()
    })
    $('.map-controls__full-screen--turn-off').click(function () {
        $(this).removeClass('map-controls__full-screen--active')
        $('.map-controls__full-screen--turn-on').addClass('map-controls__full-screen--active')

        toggleFullScreen()
    })
})

// ...сделали.

$(document).ready(function () {
    $('body').addClass('specModalBlackout maps-page')

    if (isGuest || isRegistrant) {
        $('header').hover(function () { $('body').removeClass('modal-open') })
        $('.form-control--search').click(function () { $(this).focus() })
        $('header').addClass('position-relative')
        $('header').css('z-index', '1060')
        registerMapFingerPrint()
            .then(() => {
                if (!isFpOK || localStorage.getItem('gsp') >= guestProjectsAvailable)
                    showGuestWnd()
            })
    }

    if (isAdmin || link_from) {
        app.showToast(null, 'На карте не отображаются отмененные и введенные в эксплуатацию проекты.', 'info', 'bottom-right')
    }

    $('#map').css('height', (window.innerHeight - parseInt($('header:eq(0)').css('height'), 10)) + 'px')

    $('.selectize_me').selectize({
        closeAfterSelect: false,
        selectOnTab: false,
        persist: true,
        plugins: ['remove_button', 'delete_on_click']
    })

    /** уже нажатые проекты из сторэджа */
    ymaps.usedProjects = getUsedProjects()
    if (!ymaps.usedProjects) ymaps.usedProjects = []

    ymaps.ready()

    globalThis.setActiveIcon = function setActiveIcon(type, obj) {
        if (type === 'cluster') {
            let foundInCluster = false
            objectManager.clusters.each((obj) => {
                obj.features.forEach((feature) => {
                    if (+feature.id === +get_project_id || clickedObjectId == +obj.id) {
                        foundInCluster = true
                        clickedObjectId = +obj.id
                        clickedObjectType = 'cluster'
                        objectManager.clusters.setClusterOptions(+obj.id, {
                            clusterIcons: [{
                                href: getIconPath('c', null, 'active', feature, isProjectInAnyFolder(feature.id)),
                                size: clusterIconSizeBig,
                                fontSize: clusterFontSize,
                                offset: clusterIconOffsetBig
                            }]
                        })
                        return true
                    }
                })
            })
            return foundInCluster
        } else if (type === 'project') {
            objectManager.objects.each((obj) => {
                if (+obj.properties.clusterCaption === +get_project_id) {
                    foundInCluster = true
                    clickedObjectId = +obj.id
                    clickedObjectStage = +obj.t
                    clickedObjectType = 'project'
                    objectManager.objects.setObjectOptions(obj.id, {
                        iconImageHref: getIconPath('p', obj.t, 'active', obj, isProjectInAnyFolder(+obj.properties.clusterCaption)),
                        iconImageSize: clusterIconSizeBig,
                    })
                    return
                }
            })
        } else if (type === 'zone') {
            zonesModel.objectManager.objects.each((obj) => {
                if ((obj.id == +get_zone_id) && !balloon.isOpen() && needOpenBaloon) {
                    needOpenBaloon = false
                    balloon.open(
                        obj.geometry.coordinates,
                        '<div style="margin: 0 0 5px;font-size: 120%;font-weight: 700;">'
                        + obj.properties.balloonContentHeader
                        + '</div>'
                        + obj.properties.balloonContent
                    )
                }
            })
            console.log(+get_zone_id)
        }
    }

    let filter_resetting = false

    if (firstLoadFolders.length) {
        appLoadScreen.loading()
        setTimeout(() => {
            for (let f of firstLoadFolders) {
                $('.folders_item[data-id="' + f + '"]').find('input').prop('checked', true)
                selectedFoldersProjects = selectedFoldersProjects.concat($('.folders_item[data-id="' + f + '"]').data('projects_ids'))
            }
            $('#slideFoldersCnt').trigger('click')
            applyFilter([appLoadScreen.hide])
        }, 0)
    }

    const counterPopup = $('#apply_filter_popup')

    const map_div = $('#map').append($('#filter_wrap_cnt'), $('#filter_preview_wrap_cnt'))

    $('#filter_preview_wrap_cnt').append(toggleFilterBtn)
    $('#filter_preview_wrap_cnt').append(totalSummBox)
    $('.toggle-filter-btn').append(arrowPic)
    $('#filter_preview_wrap_cnt').append(filterLayers)
    $('#filter_preview_cnt').append(
        $('<div>', { 'id': 'search_screen_summ_cnt' })
            .append(searchBoxCnt)
    ).show()

    if (isDemo) demoWarningBlock.appendTo(map_div)

    if (isGuest) guestWarningBlock.appendTo(map_div)

    let hideSearch = 'd-none'

    if (get_searchword && get_searchword.length > 1) hideSearch = ''

    const searchCnt = $('<div>', { id: 'filter_projects_pack_cnt', class: hideSearch })
        .appendTo($('#map'))
        .show()

    $('<input>', { type: 'text', id: 'filter_projects_pack_input', class: 'form-control', placeholder: ' Введите ID проекта' }).val(get_searchword || '')
        .appendTo(searchCnt)

    const cross = '<button type="button" class="close clear_search_field"><span aria-hidden="true">×</span></button>'

    $(cross).appendTo(searchCnt)

    $('<button>', { class: 'btn btn-sm btn-default', id: 'filter_projects_pack_btn' })
        .text((app.languageLocale === 'en' ? 'Search' : 'Найти проекты'))
        .appendTo(searchCnt)

    loadProdAddressPanel(companyProdAddresses)


    $('#map').on('wheel', function (e) {
        const currentZoom = map.getZoom()
        const wheelD = e.originalEvent.wheelDelta < 0

        if (wheelD && currentZoom <= minZoom) {
            app.showToast(app.t('Максимальное отдаление карты'), null, 'info', 'bottom-right')
        } else if (isZoomRestricted) {
            let toastText = app.languageLocale === 'en' ? 'Zooming is limited due to the end of the limits of working with the card' : 'Увеличение ограничено из-за окончания лимитов работы с картой'

            if (isRegistrant) {
                toastText = app.languageLocale === 'en' ? 'For a bigger zoom, subscribe or get demo access' : 'Для большего увеличения оформите подписку или получите демо-доступ'
            } else if (isGuest) {
                toastText = app.languageLocale === 'en' ? 'Zooming is limited for unregistered users' : 'Масштабирование ограничено для незарегистрированных пользователей'
            }

            if (currentZoom >= maxRestrictedZoom) {
                app.showToast(toastText, null, 'error', 'bottom-right')
            }
        }
    })

    searchBox.on('keyup', function (e) {
        e.preventDefault()
        const me = $(this)
        const val = $.trim(me.val())

        if (val == '') return

        if (e.keyCode == 13) $('#search_button').click()
    })

    $('body').on('click', '.project_to_folder_btn', function () {
        window.folder_project = $(this).data('project_id')
    }).on('click', '.add-to-folder-ok', function () {
        let folder = $('[name=folders]:checked').val()
        $.ajax({
            method: 'POST',
            url: app.en_prefix + '/ajax/projects/add_to_folder',
            data: {
                projects: [window.folder_project],
                folder: folder
            },
            success: function (data) {
                app.showToast('Проект добавлен в папку', '', 'success', 'bottom-center')
            }
        })
    }).on('change', '.seen_chbx_switch', function () {
        appLoadScreen.loading()
        setTimeout(() => {
            seenVisible = !$(this).prop('checked')
            applyFilter([appLoadScreen.hide])
        }, 0)
    }).on('click', '.folder_chbx_label', function () {
        appLoadScreen.loading()
        setTimeout(() => {
            gatherSelectedFoldersProjects()
            applyFilter([appLoadScreen.hide])
            totalSummRecount()
        }, 0)
    })

    $('body').on('click', '.exclude_folders', function () {
        onlyFolders = false

        if ($('.only_folders input').prop('checked')) {
            $('.only_folders input').prop('checked', false)
        }
        excludeFolders = !!$(this).find('input').prop('checked')
        applyFilter()
    }).on('click', '.only_folders', function () {
        excludeFolders = false

        if ($('.exclude_folders input').prop('checked')) {
            $('.exclude_folders input').prop('checked', false)
        }
        onlyFolders = !!$(this).find('input').prop('checked')
        applyFilter()
    })


    $('body').on('click', '.expand', function () {
        const me = $(this)
        const opened = me.data('first_opened')

        if (opened === 1) {
            me.data('first_opened', 0)
            $('.hidden_c').addClass('hidden_legend')
            $(this).css('background', 'url("https://investprojects.info/web/img/map/icons/dots.png") no-repeat center')
        } else {
            me.data('first_opened', 1)
            $('.hidden_c').removeClass('hidden_legend')
            $(this).css('background', 'url("https://investprojects.info/web/img/map/icons/arrow.png") no-repeat center')
        }
    }).on('click', '.filter_preview_search', function () {
        if (isGuest) {
            $('#no-access').modal('show')
            return
        }
        $('#filter_projects_pack_cnt').toggleClass('d-none')
    }).on('keyup', '#filter_projects_pack_input', function (e) {
        if (e.keyCode == 13) {
            e.preventDefault()
            $('#filter_projects_pack_btn').click()
        }
    }).on('click', '#filter_projects_pack_btn', function (e) {
        const searchField = $('#filter_projects_pack_input')
        const searchText = searchField.val().trim()
        appLoadScreen.loading()
        e.preventDefault()

        if (searchText < 2) {
            search_projects = []
            projects_to_map = []
            applyFilter()
            appLoadScreen.hide()
        } else {
            $.get('/search/search?search=' + searchText + '&searchtype=map')
                .done(function (response) {
                    const projects = JSON.parse(response)

                    if (typeof projects.single_project !== 'undefined') {
                        search_projects = [projects.id]
                        get_project_id = +projects.id
                        map.setZoom(8)
                        map.setCenter([projects.coords[0], projects.coords[1]])

                        if (!setActiveIcon('cluster')) setActiveIcon('project')
                        appLoadScreen.hide()
                    } else {
                        search_projects = projects
                        applyFilter()
                        appLoadScreen.hide()
                    }
                })
                .fail(function () {
                    appLoadScreen.hide()
                })
                .always(function () {
                    appLoadScreen.hide()
                })
        }
        return false
    }).on('click', '#projects_wnd_showmore', function () {
        //"показать еще" в окне проектов кластера
        const me = $(this)
        $.ajax({
            type: 'POST',
            url: app.en_prefix + '/ajax/ymaps/get-additional-projects',
            data: {
                already_rendered: me.data('loaded_ids'),
                all_ids: me.data('all_ids')
            },
            success: function (response) {
                if (response) response = JSON.parse(response)
                response = response.data
                renderedCustomControl.projects = renderedCustomControl.projects.concat(response.projects)//объединяем отрендеренные проекты и те, которые рендерим сейчас
                renderedCustomControl._$content.html(getProjectsString(renderedCustomControl))
                appLoadScreen.hide()
            }
        })
    })

    //FILTERS
    $('body').on('click', '.filter_preview', function () {
        if (isGuest) {
            $('#no-access').modal('show')
            return
        }
        showFilter($(this))
    })

    $('body').on('change', '.filter_select', function () {
        if (filter_resetting) {
            filter_resetting = false
            return
        }
        const me = $(this)
        const val = me.val()
        const num = val.length
        const type = me.data('name')
        window['selected_' + type] = val
        let rl = window[type + '_global'].length
        setLVRV(num, rl, type, true)
    }).on('click', '.reset_filter', function () {
        filter_resetting = true
        const me = $(this)
        const select = me.parents('.filter').find('select')
        const type = select.data('name')
        const num = window[type + '_global'].length
        select[0].selectize.clear()
        window['selected_' + type] = window[type + '_global'].map((st) => +st.id)
        setLVRV(0, num, type, true)
    }).on('click', '.apply-filter, #apply_filter_popup', function (e) {
        e.preventDefault()
        $('#save_filters_button').click()
        counterPopup.hide()
        hideFilters()
        totalSummRecount()
    }).on('click', '.custom-checkbox', function () {
        if (!counterPopup[0]) return
        const clickedLi = $(this).closest('li')

        if ($(this).closest('.left-filter-item').height() > $(this).closest('.filter_data').height()) {
            counterPopup.show()
            counterPopup[0].style.top = $(this).offset().top - 7 + 'px'
            counterPopup[0].style.left = clickedLi.offset().left + clickedLi.width() + 15 + 'px'
        }
    }).on('click', '#save_filters_button', function () {//SAVE FILTERS CLICK
        appLoadScreen.loading()
        const isOpenedFilterRegion = $('#wnd_filter_container').find('#region_filter')//если открыт именно фильтр по регионам
        setTimeout(() => {
            // appLoadScreen.loading()
            removeProjectInfoCnt(renderedCustomControl)
            removeActiveIcon()
            resetRecounter()

            if (isOpenedFilterRegion.length) {
                map.regionChanged = true
                const regions = getFilters().region
                document.getElementById('country_filter').selectize.setValue([app.rusId])

                if (regions.length > 1) {
                    moveMapToCenter()
                    map.regionChanged = false
                } else if (regions.length === 1) {
                    $.post('/ajax/ymaps/get-region-coordinates', { region: regions[0] })
                        .done(function (res) {
                            res = JSON.parse(res).data
                            moveMapToRegion(res.map_x, res.map_y)
                            map.regionChanged = false
                        })
                        .fail(function (e) {
                            console.warn(e)
                        })
                }
            } else {
                getFilters()
                applyFilter([() => {
                    totalSummRecount()
                    appLoadScreen.hide()
                }])
            }
        }, 10)
    })

    $('body').on('click', '#ymapSearchInput', function (e) {
        if (isGuest) {
            $('#no-access').modal('show')
            e.preventDefault()
            return false
        }
    }).on('click', '#search_button', function () {
        if (isGuest) {
            $('#no-access').modal('show')
            return
        }
        let val = $('#ymapSearchInput').val()

        if (val == '' || isDemo) return false
        removeProjectInfoCnt(renderedCustomControl)
        ymaps.geocode(val, {
            results: 1
        }).then(function (res) {
            const firstGeoObject = res.geoObjects.get(0)
            if (!firstGeoObject) return
            const coords = firstGeoObject.geometry.getCoordinates()
            map.setZoom(8)
            map.setCenter([coords[0], coords[1]])
            setMapPoint(ymaps.Placemark, coords, 'islands#blueIcon', 'blue', res.metaData.request)
        }).catch(function (err) {
            console.log(err)
        })
    }).on('click', '.close_project_info_cnt', function () {
        removeProjectInfoCnt(renderedCustomControl)
        removeActiveIcon()
        $('.autoSelectedRegion').removeClass('autoSelectedRegion--projectResponsive')
    }).on('click', '.wh__panel_name', function () {
        let me = $(this)
        const coords = me.data('coordinates')
        const map_x = coords.map_x
        const map_y = coords.map_y

        if (map_x && map_y) {
            map.setZoom(8)
            map.setCenter([map_x, map_y])
        }
    }).on('keyup', '.wh__radius_input', function () {
        const me = $(this)
        const id = me.data('id')
        const val = +me.val()

        if (val > 500) {
            alert('Не больше 500км')
            me.val(500)
            return
        }
        g_warehouses_pm.forEach(wh_placemark => {
            if (wh_placemark.wh_id == id) {
                currentTypingRadius = val
                wh_placemark.events.fire('click')
            }
        })
    }).on('click', '.wh_panel__plus_button, .edit_wh', function () {
        const proj_container = $('#prod_addr_container')

        if (proj_container.hasClass('d-none')) proj_container.removeClass('d-none')
        else proj_container.addClass('d-none')
    }).on('click', '#reload_map_prodaddr', function () {
        $.ajax({
            type: 'POST',
            url: app.en_prefix + '/ajax/ymaps/get-company-prod-address',
            data: { company_id: $('#company_id').val() },
            success: function (response) {
                const data = JSON.parse(response)
                const companyProdAddresses = data.data
                $('#prod_addr_container').addClass('d-none')

                if (companyProdAddresses && companyProdAddresses.length > 0) {
                    loadProdAddressPanel(companyProdAddresses)
                    addWHToTheMap(companyProdAddresses, ymaps.Placemark)
                }
            }
        })
    }).on('click', '#slideAddressCnt', function () {
        let me = $(this)
        let opened = me.data('opened')

        if (opened == 1) {
            $('#ymapWhPanel').animate({ right: '-400px' }, 300)
            me.data('opened', 0)
            me.find('i').removeClass('wh-panel-toggler__active')
        } else {
            $('#ymapWhPanel').animate({ right: '0px' }, 300)
            me.data('opened', 1)
            me.find('i').addClass('wh-panel-toggler__active')
        }
    }).on('click', '#slideFoldersCnt', function () {
        let me = $(this)
        let opened = me.data('opened')

        if (opened == 1) {
            $('#ymapFoldersPanel').animate({ right: '-250px' }, 300)
            me.data('opened', 0)
            me.find('i').removeClass('wh-panel-toggler__active')
        } else {
            $('#ymapFoldersPanel').animate({ right: '0px' }, 300)
            me.data('opened', 1)
            me.find('i').addClass('wh-panel-toggler__active')
        }
    }).on('click', '.close_window', function () {
        hideFilters()
    }).on('click', '.select_all_filter', function () {
        const me = $(this)
        const selectize = me.siblings('.row').find('#wnd_filter_container').find('select')[0].selectize
        const opts = selectize.options
        const selected = []
        Object.keys(opts).map(function (objectKey, index) {
            var obj = opts[objectKey]
            selected.push(+obj.value)
        })
        selectize.setValue(selected)
    }).on('click', '.ymap__ymap_go_proj_base_btn1__wrapper', function (e) {
        e.preventDefault()
        let href = app.en_prefix + '/project-base?'
            + 'filter[gos]=' + getSelectedIds('gos').join('%2C')
            + '&filter[sectors]=' + getSelectedIds('sector').join('%2C')
            + '&filter[stages]=' + getSelectedIds('stage').join('%2C')
            + '&filter[regions]=' + (getSelectedIds('region').join('%2C')
                ? getSelectedIds('region').join('%2C')
                : 'all'
            )
            + '&filter[fos]=' + getSelectedIds('gos').join('%2C')
            + '&filter[folders]=&filter[contacts]=&filter[search]=&filter[date_start]=&filter[date_end]=&filter[pr_start_1]=&filter[pr_start_2]=&filter[pr_end_1]=&filter[pr_end_2]='
            + '&filter[products]=&filter[subproducts]=&sort=&user=&filter[countries]=all'
        window.open(href, '_blank')
        return false

        function getSelectedIds(type) {
            return window['selected_' + type]
        }
    }).on('click', '.clear_search_field', function () {
        const searchField = $(this).siblings('input')
        searchField.val('')
        search_projects = []
        $('#filter_projects_pack_btn').click()
        $('.filter_preview_search').click()
    }).on('click', '.wh_panel__find_products_button', function () {
        findProductsQuery()
    }).on('click', '.autoSelectedRegion .close', function () {
        borders_onMap.removeFromMap(map)
        $('.autoSelectedRegion').hide()
        $('[data-type="regions"]').prop('checked', true)
        $('[data-type="regions"]').trigger('change')
        getFilters()
        objectManager.setFilter(function (elem) {
            return true
        })
        totalSummBox.text(totalProjects)
    })

    $('body').on('click', '.toggle-filter-btn', function () {
        $('#filter_preview_cnt').toggleClass('slide-in-left')
        $('#filter_preview_cnt').toggleClass('slide-out-left')
        $('.toggle-filter-btn').toggleClass('toggle-filter-btn--filter-hidden')
        $('#ymapTotalSummDiv').toggleClass('total-summ-div--filter-hidden')
        $('#filter_layers').toggleClass('filter-layers--filter-hidden')
    })

    filterLayers.click(function () {
        $(this).toggleClass('active')
    })

    function loadCompanies() {
        let featuresDataSet = { type: "FeatureCollection", features: [] }

        $.ajax({
            type: 'POST',
            url: app.en_prefix + '/ajax/ymaps/companies',
            success: function (response) {
                const data = JSON.parse(response).data
                featuresDataSet.features = companyModel.makeFeatures(data.companies)
                companyModel.objectManager.add(featuresDataSet)
                appLoadScreen.hide()
            },
            error: function () {
                appLoadScreen.hide()
                window.nowLoading = false
            }
        })
    }

    function editPolygon(polygon, editingZones) {
        polygon.events.add('click', function (e) {
            if (e.originalEvent.domEvent.originalEvent.ctrlKey) {
                $('#formpolygonedit .industrial_name').text(polygon.properties.get("hintContent"))

                if (!editingZones) {
                    $('#formpolygonedit').removeClass('d-none')
                    $('#industrial_name option:selected')
                    $('#industrial_name option[value=' + polygon.properties.get("myID") + ']').prop('selected', true)
                    window.active_polygon = polygon
                    polygon.editor.startDrawing()
                    editingZones = true
                } else {
                    $('#formpolygonedit').addClass('d-none')
                    window.active_polygon = false
                    polygon.editor.stopEditing()
                    editingZones = false
                    let coordinates = polygon.geometry.getCoordinates()
                    let zoneData = {
                        coordinates: coordinates,
                        options: {
                            fillColor: polygon.options.get("fillColor"),
                            strokeColor: polygon.options.get("strokeColor"),
                            fillOpacity: polygon.options.get("fillOpacity")
                        }
                    }
                    $.ajax({
                        type: 'POST',
                        url: '/ajax/industrials/save-coords',
                        data: {
                            industrialId: polygon.properties.get("myID"),
                            coordinates: JSON.stringify(zoneData)
                        },
                        success: function (response) {
                            console.log(response)
                        }
                    })
                }
            }
        })
    }

    function setMapPoint(type, coordinates, preset, color, caption) {
        searchMarks.forEach((mark) => { map.geoObjects.remove(mark) })
        const searchMark = new type(
            [coordinates[0], coordinates[1]],
            { hasBalloon: false, iconCaption: caption },
            { preset: preset, iconCaptionMaxWidth: '250', iconColor: color }
        )
        map.geoObjects.add(searchMark)
        searchMarks.push(searchMark)
    }

    function hideFilters() {
        $('.filter_data').hide()
    }

    function showFilter(target) {
        const filterData = target.next()
        $('.filter_data').not(filterData).hide()
        filterData.css('left', target.position().left)
        filterData.fadeToggle(100)
    }

    function gatherSelectedFoldersProjects() {
        selectedFoldersProjects = []
        $('.folders_item')
            .filter(function () {
                return $(this).find('input').prop('checked')
            })
            .each(function () {
                selectedFoldersProjects = selectedFoldersProjects
                    .concat($(this).data('projects_ids'))
            })
    }

    function loadProdAddressPanel(companyProdAddresses) {
        wh_panelBody = $('<div>')

        if (companyProdAddresses) {
            companyProdAddresses.forEach((this_wh, i) => {
                const data = {
                    coordinates: { map_x: this_wh.map_x, map_y: this_wh.map_y },
                    id: this_wh.id
                }
                const typeName = '<b style="margin-right: 5px;">' + (i + 1) + '. ' + (this_wh.typeData ? '' + this_wh.typeData.name : (address + ' ' + (i + 1))) + '</b>'
                const editImg = '<img class="edit_wh" src="https://investprojects.info/web/img/map/edit.png">'

                $('<div>', { class: 'wh__panel_line' })
                    .data('wh_id', this_wh.id)
                    .append(
                        $('<div>', { class: 'wh__panel_name' }).html(typeName + editImg).data(data),
                        $('<div>', { class: 'wh__panel_address' }).html(this_wh.prod_address),
                        $('<div>', { class: 'wh_cnt' }).append(
                            $('<input>', { type: 'text', class: 'form-control mt-1 mb-3 form-control-sm wh__radius_input', placeholder: radiusKm })
                                .data(data),
                            isAdmin
                                ? $('<input>', { type: 'text', class: 'form-control mt-1 mb-3 form-control-sm wh__product_input', placeholder: products })
                                    .data('wh_id', this_wh.id)
                                : null
                        )
                    )
                    .appendTo(wh_panelBody)
            })
        }

        if (!isGuest) {
            let spanClass = 'wh_panel__plus_button'
            let dataString = ''

            if (isRegistrant) {
                spanClass = ''
                dataString = 'data-toggle = "modal" data-target = "#no-access"'
            }
            let showProducts = false

            if (isAdmin) showProducts = $('<div>')
                .html('<b class="wh_panel__find_products_button btn btn-sm btn-success mt-2" ' + dataString + '> ' + findProducts + '</b>')
            wh_control_panel.empty()
                .appendTo(map_div)
                .append(
                    $('<div>', { class: 'wh__panel_button ' + app.languageLocale, id: 'slideAddressCnt' })
                        .html((app.languageLocale === 'en' ? 'Locations' : 'Адреса') + '<i class="wh-panel-toggler transition-all"></i>'),
                    $('<div>', { class: 'wh_panel_subcontainer' })
                        .append(
                            $('<div>', { class: 'wh__panel_header' })
                                .html('<h4> ' + myAddresses + '</h4>'),
                            $('<div>', { class: 'wh__panel_body' })
                                .append(
                                    wh_panelBody,
                                    $('<div>')
                                        .html('<span class="' + spanClass + '" ' + dataString + '><b class="btn btn-sm btn-default">+ ' + addLocation + '</b></span>'),
                                    showProducts,
                                )
                        )
                )
            folders_control_panel.empty()
                .appendTo(map_div)
                .append(
                    $('<div>', { class: 'wh__panel_button', id: 'slideFoldersCnt' })
                        .html((app.languageLocale === 'en' ? 'Folders' : 'Папки') + '<i class="wh-panel-toggler transition-all"></i>'),
                    $('<div>', { class: 'wh_panel_subcontainer' })
                        .append(
                            $('#folders_container'),
                            $('<div>', { class: 'wh__panel_header wh__panel_header2' })
                                .html('<h5> ' + seenChbx + '</h5>'),
                            $('#seen_checkbox_container')
                        )
                )

        }
    }

    function whPlacemarkClick(e) {
        /** клик на иконке склада */
        const clicked_wh = e.get('target')

        // показываем круг с заданным радиусом
        // уберем радиус, если он уже раньше был установлен
        g_warehouses_circles.forEach((this_radius, index) => {
            if (this_radius.wh_id === clicked_wh.wh_id) {
                g_warehouses_circles = g_warehouses_circles.filter((rad) => {
                    return rad.wh_id !== clicked_wh.wh_id
                })
                map.geoObjects.remove(this_radius)
                return
            }
        })

        if (currentTypingRadius) {
            const coords = e.get('target').geometry.getCoordinates()
            map.setCenter(coords)
            const color = `rgba(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)}, 0.27)`
            const warehouseRadius = getCircle(coords, currentTypingRadius, color)
            $('.wh__radius_input').each(function () {
                if ($(this).data('id') == clicked_wh.wh_id) {
                    $(this).css('background-color', color)
                }
            })
            warehouseRadius.wh_id = clicked_wh.wh_id
            g_warehouses_circles.push(warehouseRadius)//глобальный массив кликнутых кругов-радиусов
            map.geoObjects.add(warehouseRadius)
        }
    }

    function addWHToTheMap(companyProdAddresses, Placemark) {
        g_warehouses_pm.forEach((old_wh) => { map.geoObjects.remove(old_wh) })
        g_warehouses_pm = []
        //добавляем склады/производства на карту
        companyProdAddresses.forEach((addr, index) => {
            const this_wh_pm = new Placemark(
                [addr.map_x, addr.map_y],
                {
                    hasBalloon: true,
                    balloonContentHeader: '',
                    balloonContentBody: '',
                    iconCaption: ''
                },
                {
                    preset: 'islands#blueDotIcon',
                    iconCaptionMaxWidth: '250',
                    iconColor: '#29659f',
                })
            this_wh_pm.wh_id = addr.id //запишем ид склада прямо в плэйсмарк

            this_wh_pm.events.add(['click'], whPlacemarkClick)
            map.geoObjects.add(this_wh_pm)
            g_warehouses_pm.push(this_wh_pm)// глобальный массив плэйсмарков складов
        })

        setTimeout(() => {
            if (screen.width > 480) $('.expand').click()
        }, 50)

        $('#map').click(function () {
            const exp = $('.expand')
            if (exp.data('first_opened') == 0) {
                exp.data('first_opened', 1)
                exp.click()
            }
        })
    }
})

function arrayColumn(arr, n) {
    return arr.map((x, i) => {
        if (i == 0) return x[n]
        return "\n" + x[n]
    })
}

function makeTextFile(text) {
    var data = new Blob([text], { type: 'text/plain' })

    if (textFile !== null) {
        window.URL.revokeObjectURL(textFile)
    }

    textFile = window.URL.createObjectURL(data)

    return textFile
}

function applyFilter(callback = []) {
    totalFilteredProjects = 0
    objectManager.setFilter(filtrateWrap())

    if ($('input[value="industrials"]').is(":checked")) {
        zonesModel.update(setLVRV)
    }
    callback.map(callback => callback())
}

function changeLayers() {
    let checked = []
    /** активно, только если активны слои и проектов и и зон */
    projectsInActiveIndustrialsOnly = true
    map.geoObjects.removeAll()
    $('.filter_preview[data-type="zones"]').hide()
    $('.filter_preview[data-type="stage"]').hide()
    $('.filter_preview[data-type="work_type"]').hide()
    $('.filter_preview[data-type="sector"]').hide()
    $('.filter_preview[data-type="region"]').hide()
    $('.filter_preview[data-type="gos"]').hide()
    $('.filter_preview[data-type="cost"]').hide()
    $('.filter_preview[data-type="country"]').hide()
    $('.filter_preview[data-type="search"]').hide()
    $('[name="layerShow[]"]:checked').each(function () {
        checked.push($(this).val())
    })

    if (checked.includes('projects')) {
        map.geoObjects.add(objectManager)
        $('.filter_preview[data-type="stage"]').show()
        $('.filter_preview[data-type="work_type"]').show()
        $('.filter_preview[data-type="sector"]').show()
        $('.filter_preview[data-type="region"]').show()
        $('.filter_preview[data-type="gos"]').show()
        $('.filter_preview[data-type="cost"]').show()
        $('.filter_preview[data-type="country"]').show()
        $('.filter_preview[data-type="search"]').show()
    } else {
        projectsInActiveIndustrialsOnly = false
    }

    if (checked.includes('industrials')) {
        map.geoObjects.add(zonesModel.objectManager)
        $('.filter_preview[data-type="zones"]').show()
        zonesModel.update(setLVRV)
    } else {
        projectsInActiveIndustrialsOnly = false
    }

    if (checked.includes('companies')) {
        map.geoObjects.add(companyModel.objectManager)
    }

    if (projectsInActiveIndustrialsOnly) {
        applyFilter([appLoadScreen.hide])
    }

    selected_layers = checked
    updateUrl()
    totalSummRecount()
}

function totalSummRecount(download = false) {
    let length = 0
    let total = 0

    if (projects_global && projects_global.features) {
        let filtered = projects_global.features.filter(filtrate)

        if ($('.layers__item input[value="projects"]').is(':checked') || !$('#filter_layers').length) {
            length += filtered.length
            total += totalProjects
        }

        if ($('.layers__item input[value="industrials"]').is(':checked')) {
            length += parseInt($('.preview_zones .lv').text())
            total += parseInt($('.preview_zones .rv').text())
        }

        if ($('.layers__item input[value="companies"]').is(':checked')) {
            length += companyModel.total
            total += companyModel.total
        }

        if ((app.isAdmin && app.uid == 759) || (app.isEmu && app.ruid == 759)) {
            let link = makeTextFile(arrayColumn(filtered, 'id'))
            totalSummBox.html('<a href="' + link + '" download="ymap_projects.txt" target="_blank">' + length + '</a>' + ' / ' + total)
        } else {
            totalSummBox.text(length + ' / ' + total)
        }

        $('.ymap__number_div').prepend(totalSummBoxPic)
    }
}

function filtrate(elem) {
    if (elem.o == 100) return false
    if (isGuest) return true

    let result
    let isOk = true

    elem.id = parseInt(elem.id, 10)

    if (get_project_id && get_project_id == elem.id) {
        return true
    }

    if (selectedFoldersProjects.length && !excludeFolders && selectedFoldersProjects.includes(elem.id)) {
        totalFilteredProjects++
    }

    if (projects_to_map && projects_to_map.length > 0) {
        result = projects_to_map.includes(+elem.id)
    } else if (projectsProductSearch.length > 0) {
        result = projectsProductSearch.includes(+elem.id)
    } else {
        let isSectorOk = false
        let isStageOk = false
        let isLastStageOk = false
        let isWorkTypeOk = false
        let isRegionOk = false
        let isGosOk = false
        let isCostOk = false
        let isCountryOk = false
        let isInsustrialOk = !projectsInActiveIndustrialsOnly
        let isFoldersOk = false
        let isSeenOk = true

        if (seenVisible) {
            isSeenOk = !_seenGroupMy.includes(elem.id)
        }

        if (onlyFolders) {
            if (!selectedFoldersProjects.length) isFoldersOk = true
            else isFoldersOk = selectedFoldersProjects.includes(elem.id)
            isOk = isFoldersOk
        }

        if (excludeFolders) {
            if (!selectedFoldersProjects.length) isFoldersOk = true
            else isFoldersOk = !selectedFoldersProjects.includes(elem.id)
            isOk = isFoldersOk
        }

        isStageOk = !!selected_stage.find((stage) => {
            return +stage == +elem.t
        })

        if (isOk && !isStageOk) {
            if (+elem.t == 4 && !selected_stage.includes(4) && selected_stage.some(r => [13, 14, 15, 16, 18, 19].includes(+r)) && selected_stage.includes(+elem.u)) {
                isStageOk = true
                isOk = true
            } else {
                isOk = false
            }
        }

        if (isOk) {
            isWorkTypeOk = selected_work_type.includes(+elem.wt)

            if (!isWorkTypeOk) isOk = false
        }

        if (isOk && selected_laststage.length) {
            isLastStageOk = !!selected_laststage.find((laststage) => {
                return +laststage == +elem.l
            })

            if (isLastStageOk && +elem.t == 6) {
                isStageOk = true
                isOk = true
            }
        }


        if (isOk) {
            isSectorOk = !!selected_sector.find((sector) => {
                sector = +sector
                elem.s = +elem.s
                elem.y = +elem.y
                return sector == elem.s || sector == elem.y
            })

            if (!isSectorOk) isOk = false
        }

        if (isOk) {
            isGosOk = selected_gos.includes(+elem.g)

            if (!isGosOk) isOk = false
        }

        if (isOk) {
            isCostOk = true

            if (selected_cost) {
                isCostOk = selected_cost.find((c) => {
                    return +c == +elem.c
                })

                if (isCostOk === 0) isCostOk = true
                else isCostOk = !!isCostOk
            }

            if (!isCostOk) isOk = false
        }

        if (elem.o == 89) {
            isRegionOk = true
        } else if (isOk) {
            isRegionOk = !!selected_region.find((region) => {
                return +region == +elem.o
            })

            if (!isRegionOk) isOk = false
        }

        if (isOk) {
            isCountryOk = !!selected_country.find((country) => {
                return +country == +elem.z
            })

            if (!isCountryOk) isOk = false
        }

        if (isOk && projectsInActiveIndustrialsOnly) {
            isInsustrialOk = zonesModel.selected.indexOf(+elem.iz) != -1

            if (isInsustrialOk && +elem.t == 5) {
                isOk = false
            }
        }

        /** isStageOk && isWorkTypeOk && isSectorOk && isRegionOk && isGosOk && isCostOk && isCountryOk && isFoldersOk && isSeenOk */
        result = isOk

        if (search_projects && search_projects.length > 0) {
            result = search_projects.includes(elem.id)
        }
    }

    if (result && excludeFolders) {
        result = !selectedFoldersProjects.includes(elem.id, 10)
    }
    return result
}

/** фильтруем объекты-проекты на карте */
function filtrateWrap() {
    selected_gos = selected_gos.map(t => +t)
    return (elem) => {
        return filtrate(elem)
    }
}

function setLVRV(numl, numr, type, isClicked = false) {
    if (app.languageLocale === 'en') type += '_en'
    const tmp = $('#filter_preview_wrap_cnt').find('.preview_' + type)
    let nl = String(numl)
    let nr = String(numr)

    if (!nl || nl == undefined || nl == 'undefined') nl = 0

    if (!nr || nr == undefined || nr == 'undefined') nr = 0

    //чтобы цифра фильтра 4/7 работала корректно с подпиской
    if (!isClicked && nr > nl) nr = nl

    tmp.find('.lv').text(nl)
    tmp.find('.rv').text(nr)
    const lrCnt = tmp.find('.preview_value')

    if (nl != nr) {
        lrCnt.addClass('preview_value_blue')
    } else {
        lrCnt.removeClass('preview_value_blue')
    }
}

function moveMapToCenter() {
    map.setZoom(minZoom)
    map.setCenter([mapCenterX, mapCenterY])
    setTimeout(() => { map.events.fire('actionend') }, 1500)
}

function moveMapToRegion(map_x, map_y) {
    map.setZoom(regionZoom)
    map.setCenter([map_x, map_y])
    setTimeout(() => { map.events.fire('actionend') }, 1000)
}

function updateUrl() {
    if (isGuest) return
    let url = new URL(window.location.href)
    let params = new URLSearchParams(url)
    params.set('zoom', map.getZoom())
    params.set('center', map.getCenter())

    if (get_project_id) {
        params.set('project_id', get_project_id)

        /** тыкнули проект с карточки проекта, нужно его открыть */
        function callbackOpenProject() {
            if (!setActiveIcon('cluster')) {
                setActiveIcon('project')
            }
        }

        if (!setActiveIcon('cluster')) {
            setActiveIcon('project')
        }
    }

    if (get_zone_id) {
        params.set('zone_id', get_zone_id)
        /** тыкнули проект с карточки проекта, нужно его открыть */
        function callbackOpenProject() {
            setActiveIcon('zone')
        }
        setActiveIcon('zone')
    }

    filterTypesIndex.forEach((type, index) => {
        let testNum = 0

        if (type == 'sectors' || type == 'regions') {
            testNum = 1
        }

        if ($('input[data-type="' + type + '"]:not(:checked)').length != testNum) {
            if (type == 'gos') {
                let arr = []
                $('input[data-type="' + type + '"]:checked').each(function () {
                    arr.push(gosByCode[$(this).data('item_id')])
                })
                params.set(type, arr)
            } else if (type == 'countries') {
                let arr = []
                $('input[data-type="' + type + '"]:checked').each(function () {
                    arr.push($(this).data('item_id'))
                })
                params.set(type, arr)
            } else {
                params.set(type, window['selected_' + filterTypes[index]])
            }
        } else {
            params.delete(type)
        }
    })

    params.set('layers', selected_layers)

    let obj = {
        zoom: map.getZoom(),
        center: map.getCenter().toString(),
    }

    url.search = params

    if (window.history.replaceState) {
        window.history.replaceState(null, '', url.pathname + url.search)
    }
}

function getFilters(firstload = false) {
    if (firstload && !isGuest) {
        filterTypesIndex.forEach((type, index) => {
            let filterValues = app.getUrlParameter(type)

            if (type == 'stages' && getFilter_laststage.length && !getFilter_stage.length) {
                $('[data-type="' + type + '"]').prop('checked', false)
                return
            }

            if (type == 'laststages' && !getFilter_laststage.length && getFilter_stage.length) {
                $('[data-type="' + type + '"]').prop('checked', false)
                return
            }

            if (!filterValues || filterValues == 'all') {
                return
            }

            $('[data-type="' + type + '"]').prop('checked', false)
            filterValues.split(',').map(t => +t).forEach(function (val, index) {
                if (type == 'gos') val = gosByID[val]
                $('[name="filter[' + type + '][' + val + ']"]').prop('checked', true)
                $('[name="filter[' + type + '][' + val + ']"]').trigger('change')
            })

            if ($('[data-type="' + type + '"]:checked').length == 0) {
                $('[data-type="' + type + '"]').prop('checked', true)
                $('[name="filter[' + type + ']').trigger('change')
            }
        })
    }
    const filters = {}
    filterTypes.forEach((type, index) => {
        filters[type] = []
        let filterValues = $('.filter-' + filterTypesIndex[index])
        filterValues.each(function (index, input) {
            if ($(input).prop('checked')) filters[type].push($(input).data('item_id'))
        })
        window['selected_' + type] = filters[type]
        let rl = filterValues.length
        let lv = filters[type].length

        if (type == 'laststage') {
            type = 'stage'
            rl += $('.filter-stages').length
            lv += filters[type].length
        }
        setLVRV(lv, rl, type, true)
    })
    updateUrl()

    return filters
}

function removeActiveIcon(visited = true) {
    if (visited) visited = 'visited'
    else visited = 'normal'

    if (get_project_id) get_project_id = null

    if (get_zone_id) get_zone_id = null

    if (clickedObjectType === 'cluster') {
        objectManager.clusters.setClusterOptions(clickedObjectId, {
            clusterIcons: [{
                href: getIconPath('c', null, visited, null, isProjectInAnyFolder(clickedObjectId)),
                size: clusterIconSize,
                fontSize: clusterFontSize,
                offset: clusterIconOffset
            }],
            clusterIconContentLayout: MyClusterIconContentLayout
        })
    } else {
        objectManager.objects.setObjectOptions(clickedObjectId, {
            iconImageSize: projectIconSize,
            iconImageOffset: projectIconOffset,
            iconImageHref: getIconPath('p', clickedObjectStage, visited, null, isProjectInAnyFolder(clickedObjectId))
        })
    }
}

function showGuestWnd() {
    if (!$('#no-access').hasClass('show')) {
        localStorage.setItem('gsp', 11)
        $('#no-access-guest-map').modal({
            keyboard: false,
            backdrop: 'static'
        })
    } else {
        setTimeout(showGuestWnd, 3000)
    }

    if (isFpOK) {
        $.post('/ajax/ymaps/set-map-block', { fpOurId: fpOurId })
            .done(function (res) {
                res = JSON.parse(res).data
                fpOurId = res.userFpId
                isFpOK = res.isMapLimited
            })
            .fail(function () { console.log('fail ajax fp') })
    }
}

function registerMapFingerPrint() {
    fpPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.onload = resolve
        script.onerror = reject
        script.async = true
        script.src = 'https://cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@3/dist/fp.min.js'
        document.head.appendChild(script)
    }).then(() => FingerprintJS.load())

    return fpPromise
        .then(fp => fp.get())
        .then(result => {
            fpId = result.visitorId
            return $.get('/ajax/ymaps/test-fp?fpId=' + fpId)
                .done(function (res) {
                    res = JSON.parse(res).data
                    fpOurId = res.userFpId
                    isFpOK = res.isMapLimited == 0

                    if (isFpOK && localStorage.getItem('gsp') >= guestProjectsAvailable) {
                        localStorage.setItem('gsp', 0)
                    }
                })
                .fail(function () { console.log('fail ajax fp') })
        })
}

function random(min, max) {
    return min + Math.random() * (max - min)
}

function getCircle(coords, radius, color = 'rgba(158, 122, 128, 0.27)') {
    return new ymaps.Circle(
        [coords, radius * 1000],
        { balloonContent: radius + ' ' + km, hintContent: radius + ' ' + km },
        { draggable: false, fillColor: color, strokeColor: '#242424', strokeOpacity: 0.8, strokeWidth: 1 }
    )
}

function emptyComPlacemarks() {
    companiesPlacemarks.forEach(p => {
        map.geoObjects.remove(p)
    })
}

function emptyInServicePlacemarks() {
    inServicePlacemarks.forEach(p => {
        map.geoObjects.remove(p)
    })
}

function placemarkClick(id) {
    getProjectsData([id])
}

function placemarkCompanyClick(id) {
    getCompanyData([id])
}

function addPlacemark({ map_x, map_y, iconImageHref, type, id }) {
    const dot = new ymaps.Placemark(
        [map_x, map_y],
        {
            hasBalloon: true,
            balloonContentHeader: '',
            balloonContentBody: '',
            iconCaption: ''
        },
        {
            iconLayout: 'default#image',
            iconImageHref: iconImageHref,
            iconImageSize: projectIconSize,
            iconImageOffset: projectIconOffset
        }
    )
    map.geoObjects.add(dot)

    if (type === 'project') dot.events.add(['click'], () => placemarkClick(id))
    else dot.events.add(['click'], () => placemarkCompanyClick(id))
    return dot
}

function findProductsQuery() {
    const circles = {}
    const productInputs = $('.wh__panel_body .wh__product_input')
    let gotOne = false

    emptyComPlacemarks()
    emptyInServicePlacemarks()
    g_warehouses_circles.forEach(c => {
        const product = productInputs
            .filter(function () { return $(this).data('wh_id') === c.wh_id })
            .val()

        if (product.length < 3) return
        const id = 'c_' + c.wh_id

        if (!circles[id]) circles[id] = {}

        if (!circles[id].circle) circles[id].circle = {}
        circles[id].product = product
        circles[id].circle.radius = c.geometry.getRadius()
        circles[id].circle.coordinates = c.geometry.getCoordinates().join(':')
        circles[id].circle.bounds = c.geometry.getBounds().join(':')
        gotOne = true

    })

    if (!circles || !gotOne) return
    appLoadScreen.loading()
    $.post('/ajax/ymaps/products', { circles })
        .done(function (answer) {
            const circles = JSON.parse(answer).data

            for (const [key, circle] of Object.entries(circles)) {
                const comsSearch = circle['coms_search']
                const projSearch = circle['proj_search']
                const inService = circle['in_service']

                projectsProductSearch = projSearch

                //расставим ВЭ проекты (они уже отобраны по текущей продукции)
                inService.forEach(project => {
                    inServicePlacemarks.push(addPlacemark({
                        map_x: project.map_x,
                        map_y: project.map_y,
                        iconImageHref: getIconPath('p', parseInt(project.projectData.stage_id, 10), 'normal', null, false),
                        type: 'project',
                        id: project.project_id
                    }))
                })
                comsSearch.forEach(company => {
                    companiesPlacemarks.push(addPlacemark({
                        map_x: company.map_x,
                        map_y: company.map_y,
                        iconImageHref: prodImgPath + 'company_normal' + imgType,
                        type: 'company',
                        id: company.companyData.id
                    }))
                })
                applyFilter([() => { projectsProductSearch = [] }])
            }
            appLoadScreen.hide()
        })
        .fail(function () {
            appLoadScreen.hide()
        })

}

function toggleFullScreen() {
    $('#filter_preview_wrap_cnt').toggle()

    if ($('#map').data('height')) {
        $('#map').height($('#map').data('height'))
        $('#map > ymaps').height($('#map').data('height'))
        $('#map > ymaps > ymaps').height($('#map').data('height'))
        $('#map').data('height', false)
    } else {
        $('#map').data('height', $('#map').height())
        $('#map').height('100vh')
        $('#map > ymaps').height('100vh')
        $('#map > ymaps > ymaps').height('100vh')
    }
    $('header').toggle()
    $('.legend_cnt__list').toggle()
    $('.map-controls__wrapper').toggleClass('map-controls__wrapper--off-option-unhidden')
}