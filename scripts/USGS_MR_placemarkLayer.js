requirejs([
        './newGlobe',
        './customPK',
        '../config/clientConfig',
        ], function (newGlobe, customPK) {

    "use strict";

    let arrPL = [];

    // create Placemark Layers base on the LayerName column in LayerMenu table
    $.ajax({
        url: '/allLayerMenu',
        type: 'GET',
        dataType: 'json',
        async: false,
        success: function (resp) {
            // console.log(resp);
            if (!resp.error) {
                resp.data.forEach(function (ele, i) {
                    if (ele.LayerType === 'USGSMR_PKLayer') {
                        let commN = ele.LayerName.split("_");
                        let commodName = commN[2];

                        arrPL.push({Name: commodName, Layer: new WorldWind.RenderableLayer(ele.LayerName)});
                    }
                })
            } else {
                alert(resp.error)
            }
        }
    });

    // create placemarks base on each commodity
    $.ajax({
        url: '/mrdsData',
        type: 'GET',
        dataType: 'json',
        async: false,
        success: function (resp) {
            if (!resp.error) {
                arrPL.forEach(function (e) {
                    let rows = resp.data.filter(ele => ele.commod1.includes(e.Name) || ele.commod2.includes(e.Name)  || ele.commod3.includes(e.Name) );
                    // console.log(rows);
                    rows.forEach(function (v) {

                        // create customized placemark and wrap it up with its own userProperties.
                        let commodPK = new customPK(config.MR_COMM_Color[e.Name], v.latitude, v.longitude);
                        commodPK.placemark.userProperties.site_name = v.site_name;
                        commodPK.placemark.userProperties.country = v.country;
                        commodPK.placemark.userProperties.stat = v.stat;
                        commodPK.placemark.userProperties.mrds_id = v.mrds_id;
                        commodPK.placemark.userProperties.url = v.url;

                        // add this placemark onto placemarkLayer object
                        e.Layer.addRenderable(commodPK.placemark);
                    });

                    // add customized placemarkLayer onto worldwind layers
                    e.Layer.enabled = false;
                    newGlobe.addLayer(e.Layer);
                    // console.log(newGlobe.layers);
                });
            } else {
                alert(resp.error)
            }
        }
    })
});
