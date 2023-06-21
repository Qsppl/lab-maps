class Zone {
    /** @type {null | ymaps.ObjectManager} */
    objectManager = null
    total = 0
    selected = []
    filterItem = null

    constructor(dataSet) {
        this.objectManager = new ymaps.ObjectManager({
            clusterize: true,
            gridSize: 36,
            clusterDisableClickZoom: true
        })
        /** @type {FeatureCollection} */
        let featuresDataSet = {
            type: "FeatureCollection",
            features: []
        }
        featuresDataSet.features = this.makeFeatures(dataSet)
        this.setClustersOptions()
        this.total = $('.left-filter-item[data-filter="zones"] li:not(.default-toggler__parent) [type="checkbox"]').length
        this.objectManager.add(featuresDataSet)
    }

    /**
     * @param {IEconomicZonesCollection<EconomicZones>} dataSet 
     * @returns {Feature[]}
     */
    makeFeatures(dataSet) {
        let result = []
        for (let zone in dataSet) {
            let zoneFeature = {}
            let obj = dataSet[zone]
            if (!obj.map_x || !obj.map_y) {
                continue
            }

            let description = obj.description != '' ? '<hr>' + obj.description : ''
            zoneFeature.id = parseInt(obj.id)
            zoneFeature.type = 'Feature'
            zoneFeature.properties = {
                clusterCaption: obj.name.replace('Индустриальный парк', 'Инд. парк<br>'),
                industrial_id: parseInt(obj.id),
                hintContent: '',
                balloonContent: `${obj.address}${description}<br><br><a class="btn btn-primary" href="/industrials/${obj.id}" target="_blank">Открыть</a>`,
                iconContent: obj.name.replace('Индустриальный парк', 'Инд. парк<br>'),
                balloonContentHeader: obj.name,
                iconWithContent: false
            }
            zoneFeature.options = {
                iconLayout: ymaps.templateLayoutFactory.createClass(`<svg width="24" height="24" style="left: -12px;top: -12px;position: relative;">
                                      <circle cx="12" cy="12" r="11" stroke-width="1.33333" fill="#d9944d" stroke="#d9944d" />
                                    </svg>`),
                iconShape: {
                    type: 'Rectangle',
                    coordinates: [[-12, -12], [12, 12]]
                },
                iconContentOffset: [15, 15],
            }
            zoneFeature.geometry = {
                type: 'Point',
                coordinates: [obj.map_x, obj.map_y],
            }
            result.push(zoneFeature)
        }
        return result
    }

    setClustersOptions() {
        this.objectManager.clusters.options.set({
            clusterDisableClickZoom: true,
            clusterBalloonPanelMaxMapArea: 0,
            clusterGridSize: 512,
            clusterOpenBalloonOnClick: true,
            clusterBalloonContentBodyLayout: "cluster#balloonAccordionContent",
            clusterIconLayout: ymaps.templateLayoutFactory.createClass(`<svg width="24" height="24" style="left: -12px;top: -12px;position: relative;">
                  <circle cx="12" cy="12" r="11" stroke-width="1.33333" fill="#ffffff" stroke="#d9944d" />
                  <text x="50%" y="50%" text-anchor="middle" fill="black" font-size="12px" dy=".3em">{{ properties.geoObjects.length }}</text>
                </svg>`),
            clusterIconShape: {
                type: 'Rectangle',
                coordinates: [[-12, -12], [12, 12]]
            },
            clusterIconHref: getIconPath('c'),
            clustericonContentLayout: ymaps.templateLayoutFactory.createClass(
                '{% if properties.geoObjects.length > 100 %}' +
                '<div style="color:FF00FF;font-size:10px;">99+</div>' +
                '{% else %}' +
                '<div style="color:FF00FF;font-size:11px;">{{ properties.geoObjects.length }}</div>' +
                '{% endif %}'
            )
        })
    }

    filter(elem) {
        let isOk = true
        elem.id = parseInt(elem.id, 10)
        isOk = this.selected.indexOf(+elem.id) !== -1
        return isOk
    }

    filtrateWrap() {
        return (elem) => {
            return this.filter(elem)
        }
    }

    update(callback) {
        const me = this
        me.selected = []
        $('.left-filter-item[data-filter="zones"] li:not(.default-toggler__parent) [type="checkbox"]:checked').each(function () {
            me.selected.push($(this).data("item_id"))
        });
        me.objectManager.setFilter(me.filtrateWrap())
        callback(me.selected.length, me.total, 'zones', true)
    }

    /** @deprecated */
    updateIndPolygons() {
    }
}