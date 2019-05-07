requirejs([
        './newGlobe',
        './customPK',
        './All_Layer_Menu',
        '../config/clientConfig',
        ], function (newGlobe, customPK, arrPL) {

    "use strict";

    // create placemarks base on each commodity
    $.ajax({
        url: '/mrdsData',
        type: 'GET',
        dataType: 'json',
        async: false,
        success: function (resp) {
            if (!resp.error) {
                arrPL.arrMR.forEach(function (e) {
                    let rows = resp.data.filter(ele => ele.commod1.includes(e.Name) || ele.commod2.includes(e.Name)  || ele.commod3.includes(e.Name) );
                    rows.forEach(function (v) {

                        // create customized placemark and wrap it up with its own userProperties.
                        let categoryPK = new customPK(config.MR_COMM_Color[e.Name], v.latitude, v.longitude);
                        categoryPK.placemark.userProperties.site_name = v.site_name;
                        categoryPK.placemark.userProperties.country = v.country;
                        categoryPK.placemark.userProperties.stat = v.stat;
                        categoryPK.placemark.userProperties.mrds_id = v.mrds_id;
                        categoryPK.placemark.userProperties.url = v.url;

                        // add this placemark onto placemarkLayer object
                        e.Layer.addRenderable(categoryPK.placemark);

                    });

                    // add customized placemarkLayer onto worldwind layers
                    e.Layer.enabled = false;
                    e.Layer.layerType = 'USGSMR_PKLayer';
                    newGlobe.addLayer(e.Layer);
                })

            } else {
                alert(resp.error)
            }
        }
    })
});
