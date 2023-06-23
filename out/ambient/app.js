globalThis.ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream

globalThis.testIsMobile = function () {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent) || screen.width <= 480
}

globalThis.mobile = testIsMobile()

globalThis.app = {
    languageLocale: $('html').attr('lang'),

    scroll_speed: 200,

    cookieCoords: null,

    cookieCountry: null,

    isGuest: $('#is_guest_hidden').val(),

    isAdmin: parseInt($('#is_admin').val(), 10),

    isEmu: parseInt($('#is_emu').val(), 10),

    isFrozen: parseInt($('#is_frozen').val(), 10) ? true : false,

    rusCode: 643,

    rusId: 1,

    $body: $('body'),

    $document: $(document),

    isEn: ($('html').attr('lang') == 'en'),

    en_prefix: ($('html').attr('lang') == 'en' ? '/en' : ''),

    lang_prefix: ($('html').attr('lang') != 'ru' ? '/' + $('html').attr('lang') : ''),

    uid: $('#current-user').val() || $('#current_user_id').val(),

    ruid: $('#real_user_id').val(),

    ajax_company: '/ajax/company/',

    eventCounter: 0,

    clickedLeftFilterCheckbox: null,

    currentSelectedFiltersInstance: null,

    declination(names, count) {
        const cases = [2, 0, 1, 1, 1, 2]
        let str = ''
        str = names[
            (count % 100 > 4 && count % 100 < 20)
                ? 2
                : cases[
                (count % 10 < 5)
                    ? count % 10
                    : 5
                ]
        ]

        return str
    },

    /** уникальный id */
    uniqueId(pref) {
        return (pref ? pref : '') + Math.random().toString(16).slice(2)
    },

    getCookie(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ))
        return matches ? decodeURIComponent(matches[1]) : undefined
    },

    setCookie(name, value, options = {}) {
        options = {
            path: '/',
            // при необходимости добавьте другие значения по умолчанию
            ...options
        }

        if (options.expires instanceof Date) {
            options.expires = options.expires.toUTCString()
        }

        let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value)

        for (let optionKey in options) {
            updatedCookie += "; " + optionKey
            let optionValue = options[optionKey]
            if (optionValue !== true) {
                updatedCookie += "=" + optionValue
            }
        }

        document.cookie = updatedCookie
    },

    t(str) {
        if (typeof i18n_messages[this.languageLocale] === 'undefined' || typeof i18n_messages[this.languageLocale][str] === 'undefined') {
            return str
        }
        return i18n_messages[this.languageLocale][str]
    },

    isIE() {
        return navigator.userAgent.indexOf('MSIE') > -1 || navigator.userAgent.indexOf('Trident') > -1
    },

    onPageLoad(callback) {
        //$.cookie('base_coords')
        app.cookieCoords = app.getCookie('base_coords1')
        app.cookieCountry = app.getCookie('country')
        app.$document.on('load', callback)
        app.$document.on('pjax:end', callback)
    },

    onPageReady(callback) {
        app.$document.ready(callback)
        app.$document.on('pjax:end', callback)
    },

    currentHref() {
        return location.protocol + '//' + location.host + location.pathname
    },

    pjaxReload(container, url, timeout) {
        if (!timeout) timeout = 60 * 6 * 1000
        if (!container) container = "#" +
            $('[data-pjax-container]:first').prop('id')
        let opts = { container: container, timeout: timeout }
        if (url) {
            opts.url = url
        }
        if ($.support.pjax) {
            $.pjax.reload(opts)
        }
        else {
            if (url) location.assign(url)
            else location.reload()
        }

    },

    async getBase64ImageFromURL(url) {
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.setAttribute('crossOrigin', 'anonymous')
            img.src = url
            img.onload = function () {
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')
                canvas.width = Math.round(img.width / 3)
                canvas.height = Math.round(img.height / 3)
                ctx.drawImage(img, 0, 0)
                const dataURL = canvas.toDataURL('image/png')
                resolve(dataURL)
            }
            img.onerror = error => {
                reject(error)
            }
        })
    },

    getSortedKeys(obj) {//сортирует "ассоц массив" по убыванию
        return Object.keys(obj).sort(function (a, b) { return obj[b] - obj[a] })
    },

    debounce(f, ms) {
        let timer = null
        return function (arg) {
            const onComplete = function () {
                f.apply(this, arg)
                timer = null
            }
            if (timer) {
                clearTimeout(timer)
            }
            timer = setTimeout(onComplete, ms)
        }
    },

    parseUrl(href) {
        href = decodeURIComponent(href)
        let url = '', get = {}, hash = ''

        let tmp = href.split('#')
        if (tmp[1]) hash = tmp[1]
        href = tmp[0]

        tmp = href.split('?')
        url = tmp[0]
        if (tmp[1]) {
            get = app.parseSerialized(tmp[1])
        }
        return {
            url: url,
            data: get,
            hash: hash,
            toString() {
                let tmp = this.url
                if (this.data && !app.isEmptyObject(this.data)) tmp = tmp + '?' + $.param(this.data)
                if (this.hash) tmp = tmp + '#' + this.hash
                return decodeURIComponent(tmp)
            }
        }
    },

    /** @param {string} name  */
    getUrlParameter(name) {
        /** like `['zoom=7', 'center=59.919999999982025%2C30.34130000000002', 'stages=17%2C2%2C3%2C7%2C4%2C13%2C14%2C15%2C16%2C19%2C8%2C6', 'laststages=', 'gos=4%2C1', 'layers=projects']` */
        const paramToEncodedValue = window.location.search.replace('?', '').split('&')

        /** @type {{[x: string]: string}} like `{zoom: '7', center: '59.919999999982025,30.34130000000002', stages: '17,2,3,7,4,13,14,15,16,19,8,6', laststages: '', gos: '4,1', …}` */
        const paramToValue = {}

        for (const encodedValue of paramToEncodedValue) {
            const [property, value] = encodedValue.split('=')
            if (property) paramToValue[decodeURIComponent(property)] = decodeURIComponent(value)
        }

        return name in paramToValue ? paramToValue[name] : undefined
    },

    stageSwitch() {
        $.post('https://stage.investprojects.info/admin/sergey/' + ($(this).data('type') === 'on' ? 'open-stage' : 'close-stage'))
    },

    parseSerialized(str) {
        let get = {}
        str = str.split('&')
        let count = str.length
        for (let i = 0; i < count; i++) {
            let item = str[i]
            item = item.split('=')
            let key = item[0]
            let value = null
            if (item.length > 1) value = item[1]
            if (key !== '') {
                if (key.indexOf('[]') !== -1) {
                    if (get[key] === undefined) get[key] = []
                    get[key].push(value)
                }
                else {
                    get[key] = value
                }
            }

        }
        return get
    },

    addGET(url, data) {
        let href = app.parseUrl(url)
        for (let key in data) {
            if (!data.hasOwnProperty(key)) continue
            if (key.indexOf('[]') !== -1) {
                if (href.data[key] !== undefined) {
                    href.data[key].push(data[key])
                }
                else {
                    href.data[key] = [data[key]]
                }
            }
            else {
                href.data[key] = data[key]
            }
        }
        return href.toString()
    },

    pushGET(data) {
        let url = location.href
        url = app.addGET(url, data)
        history.pushState(data, null, url)
    },

    replaceGET(data) {
        let url = app.parseUrl(location.href)
        url.data = data
        url = url.toString()
        history.pushState(data, null, url)
    },

    getRandomFromRange(min, max) {
        return Math.floor(Math.random() * (max - min) + min)
    },

    pjaxContainer(id, timeout, url) {
        let selector = '#' + id
        if (!timeout) timeout = 1000
        let $object = {}
        Object.defineProperty($object, 'id', {
            get() {
                return id
            }
        })
        Object.defineProperty($object, 'url', {
            get() {
                return url
            }
        })
        Object.defineProperty($object, 'selector', {
            get() {
                return selector
            }
        })
        Object.defineProperty($object, 'obj', {
            get() {
                return $(selector)
            }
        })
        $object.timeout = timeout
        $object.reload = function () {
            let opts = { container: selector, timeout: this.timeout }
            return $.pjax.reload(opts)
        }
        $object.load = function (url, data, replaceUrl) {
            if (!url) url = this.url
            if (!url) return this.reload
            if (data) {
                url = app.addGET(url, data)
            }
            if (!replaceUrl) replaceUrl = false
            let opts = {
                container: selector,
                timeout: this.timeout,
                url: url,
                replace: replaceUrl
            }
            return $.pjax.reload(opts)
        }
        return $object
    },

    isEmptyObject(object) {
        for (let key in object) if (object.hasOwnProperty(key)) return false
        return true
    },

    timestampToLocal(timestamp) {
        let offset = (new Date).getTimezoneOffset() * 6000
        timestamp = timestamp - offset
        return timestamp
    },

    emptyDomElement(elem) {
        //очищает внутри нативный дом элемент
        while (elem.hasChildNodes()) {
            elem.removeChild(elem.lastChild)
        }
    },

    checkLimit(callback, type_p) {
        const me = $(this),
            id = me.data('limit_id')
        let ids = [], data = null
        if (id.toString().indexOf(',') !== -1) {
            ids = id.toString().replace(/(,\s)+/g, ',').split(',')
        }
        let answer = null,
            type = me.data('limit_type') || type_p
        if (!type || !id || (id && (!$.isNumeric(id) && !Array.isArray(ids) && !ids.length))) {
            console.error('Неверные `data-` на кнопке. Укажите `-limit_type` + `-limit_id`')
            return false
        }
        if (Array.isArray(ids) && ids.length) {
            data = { limit_type: type, limit_id: ids }
        } else {
            data = { limit_type: type, limit_id: id }
        }
        appLoadScreen.loading()
        let promise = new Promise(function (resolve) {
            $.post(app.en_prefix + '/ajax/site/check-limit', data)
                .done(function (ans) {
                    answer = JSON.parse(ans).data//пихаем в замыкание ответ, вдруг понадобится
                    if (!answer) return
                    let isOk = false
                    if (answer.isOk) isOk = true
                    let modalId = answer.modalId || 'no-access'
                    callback(isOk, type, modalId)
                    resolve(modalId)
                })
                .fail(function (ans) { console.log('Check Limit Error: ' + ans) })
                .always(function () { appLoadScreen.hide() })
        })
        return promise.then(
            function (result) {
                appLoadScreen.hide()
                return result
            }
        )
    },

    limitCheckInProgress: false,

    limitCheck(type, params = null) {
        if (typeof isProjectRead !== 'undefined' && isProjectRead === true && type === 'project') {
            return
        }
        if (typeof isCompanyRead !== 'undefined' && isCompanyRead === true && type === 'company') {
            return
        }
        let csrfName = $("meta[name=csrf-param]").attr("content")
        let csrfToken = $("meta[name=csrf-token]").attr("content")
        let query_params = {
            limit_type: type,
            params: params,
        }
        query_params[csrfName] = csrfToken
        let $cnt = $('#ajaxModal')
        let _self = this

        ///*if(typeof projectsQuantity === undefined)*/ let projectsQuantity = [];
        if (type && !_self.limitCheckInProgress) {
            _self.limitCheckInProgress = true
            //appLoadScreen.loading()
            $.post(app.en_prefix + '/ajax/site/limit-check', query_params)
                .done(function (data) {
                    appLoadScreen.hide()
                    try {
                        data = JSON.parse(data).data
                        if ($.inArray(data.data, [255, 355, 455]) == '-1') {
                            htmlId = data.id
                            let a = 0
                            let $exist
                            /*do {
                                $exist = $('#' + htmlId);
                                if ($exist.length > 0) {
                                    $exist.remove();
                                    console.log($exist);
                                }
                                $exist = $('#' + htmlId);
                                a++;
                            } while ($exist.length > 0 && a < 5);*/
                            // откр модалку закр чат
                            if (typeof (TalkMe) == 'function') {
                                TalkMe("closeSupport")
                            }
                            $cnt.html(data.data)
                            $cnt.find('#' + htmlId).modal('show')
                        }
                    } catch (e) {
                        //console.error('err')
                    }
                    _self.limitCheckInProgress = false
                }
                ).fail(function () {
                    _self.limitCheckInProgress = false
                    appLoadScreen.hide()
                })
        }
        //appLoadScreen.hide();
    },

    scrollTextareaDown(textarea) {
        if (!textarea) return false
        textarea.scrollTop = textarea.scrollHeight
    },

    scrollTextareaUp(textarea) {
        if (!textarea) return false
        textarea.scrollTop = textarea
    },

    scrollTo(element_id, speed = null) {
        if (!element_id) return false
        $('html, body').animate({ scrollTop: $('#' + element_id).offset().top - 50 }, speed ?? this.scroll_speed)
    },

    isIos() {
        return ios
    },

    isMobile() {
        return testIsMobile()
    },

    isMobileOrTablet() {
        return screen.width <= 1200
    },

    makeSelectLimit() {

        let fromSelect = $('.select-limit-from'),
            toSelect = $('.select-limit-to')
        if (fromSelect.length < 1 || toSelect.length < 1) { return false };
        disableOption()

        function disableOption() {
            let selectFrom = fromSelect.children()
            let selectTo = toSelect.children()

            const findSelected = function () {
                return $(this).prop('selected')
            }

            let indexFrom = selectFrom.filter(findSelected).index()
            let indexTo = selectTo.filter(findSelected).index()

            selectFrom.removeAttr('disabled')
            selectTo.removeAttr('disabled')

            selectFrom.eq(indexTo).nextAll('option').attr('disabled', 'disabled')
            selectTo.eq(indexFrom).prevAll('option').attr('disabled', 'disabled')
        };

        $('.select-limit').on('change', function () {
            disableOption()
        })
    },

    makeUrlName(name_en) {
        return name_en.replaceAll(' ', '-')
    },

    showToast(toastHead, toastText, color, position) {
        if (typeof position === 'undefined') position = 'bottom-right'
        if (typeof toastText === 'undefined' || !toastText) toastText = ''
        $.toast({
            heading: toastHead,
            text: toastText,
            showHideTransition: 'fade',
            icon: color,
            position: position,
            hideAfter: 3000,
            allowToastClose: false,
            loader: false,
            class: 'toast_larger-font toast_map_alert',
            stack: false
        })
    },
    /** раскрыть значение переменной если она задана замыканием */
    expandVar(value) {
        if (!value) {
            return value
        }
        if (typeof value == "function") {
            return value.call(this)
        }
        return value
    },

    modal(_title, _content, _opt) {
        let options = $.extend({
            start: true,
            onShow(domEl, options) { },
            onHide(domEl, options) { },
            buttons: [
                {
                    text: 'Закрыть',
                    dismiss: true,
                    onClick(e) { },
                    classes: 'btn btn-secondary'
                }
            ],
        }, _opt)
        let t = '<div class="modal" tabindex="-1"><div class="modal-dialog"><div class="modal-content">'
        let title = this.expandVar(_title)
        let content = this.expandVar(_content)
        if (title) {
            t += '<div class="modal-header"><h5 class="modal-title">' + title + '</h5>'
            t += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
        }
        t += '<div class="modal-body">' + content + '</div>'
        t += '<div class="modal-footer">'
        let countOnClick = 0
        const btnHandlers = {}
        for (let i in options.buttons) {
            options.buttons[i]['id'] = options.buttons[i]['id'] ? options.buttons[i]['id'] : this.uniqueId('btn')
            t += '<button type="button" class="' + this.expandVar(options.buttons[i]['classes']) + '" id="' + options.buttons[i]['id'] + '"'
            if (this.expandVar(options.buttons[i]['dismiss'])) {
                t += ' data-dismiss="modal"'
            }
            t += '>' + this.expandVar(options.buttons[i]['text']) + '</button>'
            if (typeof options.buttons[i]['onClick'] == 'function') {
                btnHandlers[options.buttons[i]['id']] = options.buttons[i]['onClick']
                countOnClick++
            }
        }
        t += '</div>' // btn
        t += '</div></div></div>'
        const domEl = $(t)
        domEl.on('shown.bs.modal', function (e) {
            options.onShow.call(this, domEl, options)
        }).on('hidden.bs.modal', function (e) {
            options.onHide.call(this, domEl, options)
            domEl.remove()
        })
        if (countOnClick > 0) {
            domEl.on('click', function (e) {
                console.log('win click', e)
                let btnId = e.target.id
                for (let i in btnHandlers) {
                    if (i == btnId) {
                        (btnHandlers[i])(e, domEl)
                        break
                    }
                }
            })
        }
        if (options.start) {
            domEl.modal('show')
        }
        return domEl
    },

    deleteFolderPopupText: 'Вы собираетесь удалить папку. После этого папка исчезнет и Вы не сможете больше ей пользоваться. Подтвердите удаление',

    handleLinkedChbxClickfunction() {
        const me = $(this)
        const isParent = me.hasClass('linked-chbx-parent')
        const container = me.parents('.linked-chbx-container:eq(0)')
        const parent = container.find('.linked-chbx-parent').first()
        const children = container.find('.linked-chbx-child')
        if (isParent) {
            children.prop('checked', parent.prop('checked'))
        } else {
            let checkedCounter = 0
            children.each(function () {
                if ($(this).prop('checked')) checkedCounter++
            })
            parent.prop('checked', checkedCounter === children.length)
        }
    },

    isSectorPage() {
        return window.location.pathname.includes('sectors')
    },

    isRegionPage() {
        return window.location.pathname.includes('districts')
    },

    isIndustrialPage() {
        return window.location.pathname.includes('industrials')
    },

    removeLastZero(num) {
        num = parseFloat(num)
        let fixedNum = 1
        let tmp = num.toFixed(1) - num.toFixed(0)
        if (tmp === 0) fixedNum = 0
        return num.toFixed(fixedNum)
    },

    preloadImage(url) {
        let img = new Image()
        img.src = url
    },

    /** загрузить скрипт и выполнить колбэк при загрузке */
    loadScript(url, callback) {
        let script = document.createElement('script')
        if (callback) {
            script.onload = function () {
                callback()
            }
        }
        script.src = url
        document.getElementsByTagName('head')[0].appendChild(script)
    },

    /**
     * загрузить скрипт
     * @param {string} url
     * @returns {Promise<HTMLScriptElement>}
     */
    loadScriptPromise(url) {
        return new Promise((resolve, reject) => {
            let script = document.createElement('script')
            script.onload = () => { resolve(script) }
            script.src = url
            document.getElementsByTagName('head')[0].appendChild(script)
        })
    },

    requestBuy(callback, errorCallback) { // заявка на продление подписки
        $.ajax({
            url: '/ajax/user-request-buys/send',
            type: 'POST',
            dataType: 'json',
            data: {},
            error() {
                console.log("Error send request buys!")
                if (typeof errorCallback == 'function') {
                    errorCallback()
                }
            },
            success(res) {
                if (typeof callback == 'function') {
                    callback(res)
                }
            },
        })
    },

    requestIncreaseLimit(limitName, callback, errorCallback) { // запрос на увеличение лимита
        $.ajax({
            url: '/ajax/user-request-limit/send',
            type: 'POST',
            dataType: 'json',
            data: {
                limit: limitName
            },
            error() {
                console.log("Error send request limit!")
                if (typeof errorCallback == 'function') {
                    errorCallback()
                }
            },
            success(res) {
                if (typeof callback == 'function') {
                    callback(res)
                }
            },
        })
    },

    /** список id в виде массива */
    getIdArray(projects) {
        let ids = []
        if (typeof projects == 'object') {
            for (let i in projects) {
                ids.push(projects[i])
            }
        } else {
            ids = ids.push(projects)
        }
        return ids
    },

    /** проект(ы) в избранное/из избранного - projects = список или один id */
    toggleFavProjects(projects, callback) {
        let ids = this.getIdArray(projects)
        if (ids.length == 0) {
            return
        }
        $.ajax({
            method: 'POST',
            url: app.en_prefix + '/ajax/projects/toggle-fav',
            data: {
                projects: ids
            },
            success(data) {
                if (typeof callback == 'function') {
                    callback(data)
                }
            }
        })
    },

    /** проект(ы) из архива/в архив */
    toggleArchiveProjects(projects, callback) {
        let ids = this.getIdArray(projects)
        if (ids.length == 0) {
            return
        }
        $.ajax({
            method: 'POST',
            url: app.en_prefix + '/ajax/projects/toggle-archive',
            data: {
                projects: ids
            },
            success(data) {
                if (typeof callback == 'function') {
                    callback(data)
                }
            }
        })
    },

    /** создать папку - при успехе callbackSuccess получает id папки */
    createFolder(folder_name, callbackSuccess, callbackErr) {
        let sendData = { folder: folder_name }
        $.ajax({
            method: 'POST',
            url: app.en_prefix + '/ajax/projects/add_folder',
            data: sendData,
            success(data) {
                try {
                    data = JSON.parse(data)
                    if (data.data && data.data != false && data.data != 'unique_name_err') {
                        // ok
                        if (typeof callbackSuccess == 'function') {
                            callbackSuccess(data.data) // id папки
                        }
                    } else {
                        if (typeof callbackErr == 'function') {
                            let errMess = 'Название папки должно состоять из 3 или более символов!'
                            if (data.data == 'unique_name_err') {
                                errMess = 'Такое название папки уже используется Вами или Вашими коллегами'
                            }
                            callbackErr(data.data, errMess)
                        }
                    }
                } catch (e) {
                    //return false;
                    if (typeof callbackErr == 'function') {
                        callbackErr(false, '')
                    }
                }
            }
        })
    },

    removeFromFolderProjects(projects, callback) {
        let ids = this.getIdArray(projects)
        if (ids.length == 0) {
            return
        }
        $.ajax({
            method: 'POST',
            url: app.en_prefix + '/ajax/projects/remove_from_folder',
            data: {
                projects: ids
            },
            success(data) {
                if (typeof callback == 'function') {
                    callback(data)
                }
            }
        })
    },

    /** добавить проекты в в папку */
    addToFolderProjectsOld(projects, folder, callback) {
        let ids = this.getIdArray(projects)
        $.ajax({
            method: 'POST',
            url: app.en_prefix + '/ajax/projects/add_to_folder',
            data: {
                projects: ids,
                folder: folder
            },
            success(data) {
                if (typeof callback == 'function') {
                    callback(data)
                }
            }
        })
    },

    /** добавить проекты в в папку */
    addToFolderProjects(projects, folder, callback) {
        let ids = this.getIdArray(projects)
        $.ajax({
            method: 'POST',
            url: app.en_prefix + '/ajax/projects/add-to-folder',
            data: {
                projects: ids,
                folder: folder
            },
            success(data) {
                if (typeof callback == 'function') {
                    callback(data)
                }
            }
        })
    },

    createFolderAddProjects(folder_name, projects, callback) {
        let self = this
        let c = (typeof callback == 'function' ? callback : function (ok) { })
        self.createFolder(folder_name, function (folder_id) {
            self.addToFolderProjects(projects, folder_id, function () {
                c(true)
            })
        }, function (data, mess) {
            c(false)
        })
    },

    /** добавить проекты в папку и одновременно убрать из остальных */
    addToFolderWithDelOtherProjects(projects, folder, callback) {
        let ids = this.getIdArray(projects)
        $.ajax({
            method: 'POST',
            url: app.en_prefix + '/ajax/projects/add-to-folder-with-delete',
            data: {
                projects: ids,
                folder: folder
            },
            success(data) {
                if (typeof callback == 'function') {
                    callback(data)
                }
            }
        })
    },

    /** компании в/из избранное */
    toggleFavCompanies(companies, callback) {
        let ids = this.getIdArray(companies)
        if (ids.length == 0) {
            return
        }
        let reqParams = {
            company_id: ids
        }
        $.ajax({
            url: '/ajax/folders-widget/company-toggle-fav',
            type: 'POST',
            data: reqParams,
            error() {
                console.log("Error update!")
            },
            success(res) {
                if (typeof callback == 'function') {
                    callback(res)
                }
            },
        })
    },

    /** компании в/из избранное */
    toggleArchiveCompanies(companies, callback) {
        let ids = this.getIdArray(companies)
        if (ids.length == 0) {
            return
        }
        let reqParams = {
            company_id: ids
        }
        $.ajax({
            url: '/ajax/folders-widget/company-toggle-archive',
            type: 'POST',
            data: reqParams,
            error() {
                console.log("Error update!")
            },
            success(res) {
                if (typeof callback == 'function') {
                    callback(res)
                }
            },
        })
    },

    /** компании из папки */
    removeFromFolderCompanies(companies, callback) {
        let ids = this.getIdArray(companies)
        if (ids.length == 0) {
            return
        }
        let reqParams = {
            company_id: ids
        }
        $.ajax({
            url: '/ajax/folders-widget/company-remove-all-folders',
            type: 'POST',
            data: reqParams,
            error() {
                console.log("Error update!")
            },
            success(res) {
                if (typeof callback == 'function') {
                    callback(res)
                }
            },
        })
    },

    initOperationBlocked() {
        this.$body.on('click', '[data-operation-blocked]', function (e) {
            let btn = this
            let text = 'Действие не доступно'
            if (typeof btn.dataset.blockedMessage != 'undefined') {
                text = btn.dataset.blockedMessage
            }
            let title = 'Запрещено'
            if (typeof btn.dataset.blockedTitle != 'undefined') {
                title = btn.dataset.blockedTitle
            }
            app.showToast(title, text, 'error', 'mid-center')
            e.preventDefault()
            e.stopPropagation()
        })
    },

    /**
     * @param {string} selectors 
     * @returns {Promise<HTMLElement | null>}
     */
    querySelectorPromise(selectors) {
        if (typeof selectors !== 'string') new TypeError()
        return new Promise((resolve, reject) => {
            if (document.readyState === "complete") resolve(document.querySelector(selectors))
            else document.addEventListener('DOMContentLoaded', () => {
                resolve(document.querySelector(selectors))
            })
        })
    }
}