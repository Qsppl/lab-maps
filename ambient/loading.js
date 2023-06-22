var appLoadScreen = (function AppLoader(){
    var ret = {},
        loader = false
    let loader_all
    let loaderStart = false

    let loaderLast = false
    let loaderLastStart = false

    ret.init = function () {
        loader = (!!$.fn.jquery || false) ? $('.loader__anim') : false
        loader_all = loader;
        if (loader) {
            if (loader.length > 1) {
                loader = loader.first()
                loaderLast = loader_all.last()
                // закрыть остальные
                loader_all.each(function (i, e) {
                    if (e != loader[0]) {
                        e.style.display = 'none'
                    } else {
                        if (e.style.display != 'none') {
                            loaderStart = true
                        }
                    }
                })
            } else {
                loaderLast = loader;
            }
        }
    }
    ret.init()

    ret.loading = function() {
        if (loader) {
            loader.show()
            loader.addClass('show')
            loaderStart = true
            loader.trigger('loader.show')
        }
    },
    ret.hide = function() {
        if (loader) {
            $('.loader__anim').hide()
            loaderStart = false
            $('body').trigger('loader.hide')
        }
    },
    ret.displayed = function () {
        return loaderStart
    };
    ret.hideAll = function () {
        loader_all.each(function (i, e) {
            e.style.display = 'none'
            loaderStart = false
        });
        $('body').trigger('loader.hide')
    };
    ret.loadingLast = function () {
        if (loaderLast) {
            loaderLast.show()
            loaderLastStart = true
            loaderLast.trigger('loader_last.show')
        }
    }
    ret.isLoading = loaderStart
    return ret
})()


$(document).ready(function(e){
    appLoadScreen.hide()
});
$(document).on('pjax:send', function(e){
    appLoadScreen.loading()
});
$(document).on('pjax:complete', function(e){
    appLoadScreen.hide()
    appLoadScreen.init()
});

