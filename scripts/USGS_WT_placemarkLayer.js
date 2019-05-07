requirejs([
    './newGlobe',
    './customPK'
], function (newGlobe, customPK) {

    "use strict";

    // let createWTPK = function(color, element) {
    //
    //     // wrap up placemark image source
    //     let circle = document.createElement("canvas"),
    //         ctx = circle.getContext('2d'),
    //         radius = 10,
    //         r2 = radius * 2;
    //
    //     circle.width = circle.height = r2;
    //
    //     let gradient = ctx.createRadialGradient(radius, radius, 0, radius, radius, radius);
    //     gradient.addColorStop(0, color);
    //
    //     ctx.beginPath();
    //     ctx.arc(radius, radius, radius, 0, Math.PI * 2, true);
    //
    //     ctx.fillStyle = gradient;
    //     ctx.fill();
    //     // ctx.strokeStyle = "rgb(255, 255, 255)";
    //     // ctx.stroke();
    //
    //     ctx.closePath();
    //
    //     // wrap up World Wind Placemark object
    //     let placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
    //     placemarkAttributes.imageSource = new WorldWind.ImageSource(circle);
    //     placemarkAttributes.imageScale = 0.5;
    //
    //     let highlightAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
    //     highlightAttributes.imageScale = 2.0;
    //
    //     let placemarkPosition = new WorldWind.Position(element.ylat, element.xlong, 0);
    //
    //     this.pk = new WorldWind.Placemark(placemarkPosition, false, placemarkAttributes);
    //     this.pk.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
    //     this.pk.highlightAttributes = highlightAttributes;
    //     this.pk.userProperties.p_name = element.p_name;
    //     this.pk.userProperties.t_state = element.t_state;
    //     this.pk.userProperties.p_year = (element.p_year === -9999) ? 'N/A' : element.p_year;
    //     this.pk.userProperties.p_tnum = element.p_tnum;
    //     this.pk.userProperties.p_cap = (element.p_cap === -9999) ? 'N/A' : element.p_cap;
    //     this.pk.userProperties.p_avgcap = (element.p_avgcap === -9999) ? 'N/A' : element.p_avgcap;
    //     this.pk.userProperties.t_ttlh = (element.t_ttlh === -9999) ? 'N/A' : element.t_ttlh;
    //     this.pk.userProperties.p_year_color = element.p_year_color;
    //     this.pk.userProperties.p_avgcap_color = element.p_avgcap_color;
    //     this.pk.userProperties.t_ttlh_color = element.t_ttlh_color;
    // };

    //fetch the data from db and generate plackmarks and placemark layers
    // $.ajax({
    //     url: '/usgsWT',
    //     type: 'GET',
    //     dataType: 'json',
    //     async: false,
    //     success: function (resp) {
    //         if (!resp.error) {
    //             // generate placemark layers
    //             let yearPLayer = new WorldWind.RenderableLayer("USGS_WT_Year");
    //             let capPLayer = new WorldWind.RenderableLayer("USGS_WT_Capacity");
    //             let heightPLayer = new WorldWind.RenderableLayer("USGS_WT_Height");
    //             yearPLayer.enabled = capPLayer.enabled = heightPLayer.enabled = false;
    //
    //             resp.data.forEach (function (ele, i) {
    //                 let yearPK = new createWTPK(ele.p_year_color, ele);
    //                 let capPK = new createWTPK(ele.p_avgcap_color, ele);
    //                 let heightPK = new createWTPK(ele.t_ttlh_color, ele);
    //
    //                 yearPLayer.addRenderable(yearPK.pk);
    //                 capPLayer.addRenderable(capPK.pk);
    //                 heightPLayer.addRenderable(heightPK.pk);
    //
    //                 // add placemark layers into WorldWind layers object
    //                 if (i === resp.data.length - 1) {
    //                     newGlobe.addLayer(yearPLayer);
    //                     newGlobe.addLayer(capPLayer);
    //                     newGlobe.addLayer(heightPLayer);
    //                 }
    //             });
    //         } else {
    //             alert(resp.error)
    //         }
    //     }
    // });

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
                    if (ele.LayerType === 'USGSWT_PKLayer') {
                        let category = ele.LayerName.split("_");
                        let categoryN = category[2];

                        arrPL.push({Name: categoryN, Layer: new WorldWind.RenderableLayer(ele.LayerName)});
                    }
                })
            } else {
                alert(resp.error)
            }
        }
    });

    // create placemarks base on each category
    $.ajax({
        url: '/usgsWT',
        type: 'GET',
        dataType: 'json',
        async: false,
        success: function (resp) {
            // console.log(resp.data);
            if (!resp.error) {
                arrPL.forEach(function (e) {
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
                    newGlobe.addLayer(e.Layer);

                })
            } else {
                alert(resp.error)
            }
        }
    })

});
