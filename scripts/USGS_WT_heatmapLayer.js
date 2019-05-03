requirejs([
        './newGlobe',
        '../config/mainconf'
    ],
    function (newGlobe) {

        "use strict";

        $.ajax({
            url: '/usgsWT',
            type: 'GET',
            dataType: 'json',
            async: false,
            success: function (resp) {
                if (!resp.error) {
                    let data = [];
                    for (let i = 0; i < resp.data.length; i++) {
                        data[i] = new WorldWind.MeasuredLocation(resp.data[i].ylat, resp.data[i].xlong, 1000);
                        if (i === resp.data.length - 1) {

                            let heatmapLayer = new WorldWind.HeatMapLayer("USGS_WT_HeatMap", data);
                            heatmapLayer.scale = [
                                // '#0071ff',
                                '#65d6ff',
                                '#74ff7c',
                                '#fffd55',
                                '#ffac5b',
                                // '#ff7500',
                                '#FF3A33'
                            ];

                            heatmapLayer.radius = 4.3;
                            // heatmapLayer.gradient = [0, 0.3, 0.5, 0.7, 0.8, 0.9, 0.95];
                            heatmapLayer.incrementPerIntensity = 0.2;

                            heatmapLayer.enabled = false;

                            newGlobe.addLayer(heatmapLayer)
                        }
                    }
                }
            }
        })
    });
