requirejs([
        './newGlobe',
        '../config/mainconf'
    ],
    function (newGlobe) {
    
        "use strict";

        let an = "USGS_MR_Antimony_HeatMap";
        let as = "USGS_MR_Asbestos_HeatMap";
        let ch = "USGS_MR_Chromium_HeatMap";
        let co = "USGS_MR_Copper_HeatMap";
        let go = "USGS_MR_Gold_HeatMap";
        let ir = "USGS_MR_Iron_HeatMap";
        let le = "USGS_MR_Lead_HeatMap";
        let ma = "USGS_MR_Manganese_HeatMap";
        let mo = "USGS_MR_Molybdenum_HeatMap";
        let ni = "USGS_MR_Nickel_HeatMap";
        let si = "USGS_MR_Silver_HeatMap";
        let tu = "USGS_MR_Tungsten_HeatMap";
        let ur = "USGS_MR_Uranium_HeatMap";
        let zi = "USGS_MR_Zinc_HeatMap";
        let ot = "USGS_MR_Other_HeatMap";

        let arrName = [an, as, ch, co, go, ir, le, ma, mo, ni, si, tu, ur, zi, ot];

        for (let i = 0; i < arrName.length; i++) {
            let layerName = "layerName=" + arrName[i];
            $.ajax({
                url: '/mrdsDataP',
                type: 'GET',
                dataType: 'json',
                async: false,
                data: layerName,
                success: function (resp) {
                    if (!resp.error) {
                        let a = layerName.split("=");
                        let b = a[1];
                        let data = [];
                        console.log(resp.commN);
                        for (let i = 0; i < resp.commN.length; i++) {
                            data[i] = new WorldWind.MeasuredLocation(resp.commN[i].latitude, resp.commN[i].longitude, 1);
                            if (i === resp.commN.length - 1) {
                                // console.log(data);
                                let heatmapLayer = new WorldWind.HeatMapLayer(""+ b +"", data);
                                heatmapLayer.scale = [
                                    '#0071ff',
                                    '#65d6ff',
                                    '#74ff7c',
                                    '#fffd55',
                                    '#ffac5b',
                                    '#ff7500',
                                    '#FF3A33'
                                ];

                                heatmapLayer.radius = 6;
                                // heatmapLayer.gradient = [0, 0.3, 0.5, 0.7, 0.9];
                                heatmapLayer.incrementPerIntensity = 0.2;

                                heatmapLayer.enabled = false;

                                newGlobe.addLayer(heatmapLayer)
                            }
                        }
                    }
                }
            })
        }
    });
