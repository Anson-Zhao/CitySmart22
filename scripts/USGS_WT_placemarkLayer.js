requirejs([
    './newGlobe',
    './customPK',
    './All_Layer_Menu'
], function (newGlobe, customPK, arrPL) {

    "use strict";

    // create placemarks base on each category
    $.ajax({
        url: '/usgsWT',
        type: 'GET',
        dataType: 'json',
        async: false,
        success: function (resp) {
            if (!resp.error) {
                arrPL.arrWT.forEach(function (e) {
                    resp.data.forEach(function (v) {

                        // create customized placemark and wrap it up with its own userProperties.
                        let categoryPK = new customPK(v[e.Name+'_Color'], v.ylat, v.xlong);
                        categoryPK.placemark.userProperties.p_name = v.p_name;
                        categoryPK.placemark.userProperties.t_state = v.t_state;
                        categoryPK.placemark.userProperties.p_year = (v.p_year === -9999) ? 'N/A' : v.p_year;
                        categoryPK.placemark.userProperties.p_tnum = v.p_tnum;
                        categoryPK.placemark.userProperties.p_cap = (v.p_cap === -9999) ? 'N/A' : v.p_cap;
                        categoryPK.placemark.userProperties.p_avgcap = (v.p_avgcap === -9999) ? 'N/A' : v.p_avgcap;
                        categoryPK.placemark.userProperties.t_ttlh = (v.t_ttlh === -9999) ? 'N/A' : v.t_ttlh;
                        categoryPK.placemark.userProperties.p_year_color = v.Year_Color;
                        categoryPK.placemark.userProperties.p_avgcap_color = v.Capacity_Color;
                        categoryPK.placemark.userProperties.t_ttlh_color = v.Height_Color;

                        // add this placemark onto placemarkLayer object
                        e.Layer.addRenderable(categoryPK.placemark);

                    });

                    // add customized placemarkLayer onto worldwind layers
                    e.Layer.enabled = false;
                    e.Layer.layerType = 'USGSWT_PKLayer';
                    newGlobe.addLayer(e.Layer);

                })
            } else {
                alert(resp.error)
            }
        }
    })

});
