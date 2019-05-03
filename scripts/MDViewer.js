requirejs([
    './newGlobe',
    '../config/mainconf',
], function (newGlobe) {

    "use strict";

    let createMDPK = function(color, element) {

        // wrap up placemark image source
        let circle = document.createElement("canvas"),
            ctx = circle.getContext('2d'),
            radius = 10,
            r2 = radius * 2;

        circle.width = circle.height = r2;

        let gradient = ctx.createRadialGradient(radius, radius, 0, radius, radius, radius);
        gradient.addColorStop(0, color);

        ctx.beginPath();
        ctx.arc(radius, radius, radius, 0, Math.PI * 2, true);

        ctx.fillStyle = gradient;
        ctx.fill();
        // ctx.strokeStyle = "rgb(255, 255, 255)";
        // ctx.stroke();

        ctx.closePath();

        // wrap up World Wind Placemark object
        let placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
        placemarkAttributes.imageSource = new WorldWind.ImageSource(circle);
        placemarkAttributes.imageScale = 0.5;

        let highlightAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
        highlightAttributes.imageScale = 2.0;

        let placemarkPosition = new WorldWind.Position(element.ylat, element.xlong, 0);

        this.pk = new WorldWind.Placemark(placemarkPosition, false, placemarkAttributes);
        this.pk.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
        this.pk.highlightAttributes = highlightAttributes;
        this.pk.userProperties.dep_type = element.dep_type;
        this.pk.userProperties.commodity = element.commodity;
        this.pk.userProperties.dep_name = element.dep_name;

        // var placemarkPosition = new WorldWind.Position(resp.data[i].latitude, resp.data[i].longitude, 0);
        // placemark[i] = new WorldWind.Placemark(placemarkPosition, false, placemarkAttributes);
        // placemark[i].altitudeMode = WorldWind.RELATIVE_TO_GROUND;
        // placemark[i].highlightAttributes = highlightAttributes;
        //
        // this.pk.userProperties.p_name = element.p_name;
        // this.pk.userProperties.t_state = element.t_state;
        // this.pk.userProperties.p_year = (element.p_year === -9999) ? 'N/A' : element.p_year;
        // this.pk.userProperties.p_tnum = element.p_tnum;
        // this.pk.userProperties.p_cap = (element.p_cap === -9999) ? 'N/A' : element.p_cap;
        // this.pk.userProperties.p_avgcap = (element.p_avgcap === -9999) ? 'N/A' : element.p_avgcap;
        // this.pk.userProperties.t_ttlh = (element.t_ttlh === -9999) ? 'N/A' : element.t_ttlh;
        // this.pk.userProperties.p_year_color = element.p_year_color;
        // this.pk.userProperties.p_avgcap_color = element.p_avgcap_color;
        // this.pk.userProperties.t_ttlh_color = element.t_ttlh_color;
    };
    //fetch the data from db and generate plackmarks and placemark layers
    $.ajax({
        url: '/placemarkt',
        type: 'GET',
        dataType: 'json',
        async: false,
        success: function (resp) {
            if (!resp.error) {
                // generate placemark layers
                let MajorCommodity = new WorldWind.RenderableLayer("USGS_MD_MajorCommodity");
                let MajorType = new WorldWind.RenderableLayer("USGS_MD_MajorType");
                // let Gold = new WorldWind.RenderableLayer("USGS_MD_Gold_Placemark");
                // let Nickel = new WorldWind.RenderableLayer("USGS_MD_Nickel_Placemark");
                // let Iron = new WorldWind.RenderableLayer("USGS_MD_Iron_Placemark");
                // let Aluminum = new WorldWind.RenderableLayer("USGS_MD_Aluminum_Placemark");
                // let LeadZinc = new WorldWind.RenderableLayer("USGS_MD_Lead-Zinc_Placemark");
                // let PGE = new WorldWind.RenderableLayer("USGS_MD_PGE_Placemark");
                // let Diamond = new WorldWind.RenderableLayer("USGS_MD_Diamond_Placemark");
                // let Clay = new WorldWind.RenderableLayer("USGS_MD_Clay_Placemark");
                // let Potash = new WorldWind.RenderableLayer("USGS_MD_Potash_Placemark");
                // let RareEarths = new WorldWind.RenderableLayer("USGS_MD_RareEarths_Placemark");
                // let Silver = new WorldWind.RenderableLayer("USGS_MD_Silver_Placemark");
                // let MultipleCommodities = new WorldWind.RenderableLayer("USGS_MD_MultipleCommodities_Placemark");
                // let Unclassified = new WorldWind.RenderableLayer("USGS_MD_Unclassified_Placemark");
                // let Surficial = new WorldWind.RenderableLayer("USGS_MD_Surficial_Placemark");
                // let Metamorphic = new WorldWind.RenderableLayer("USGS_MD_Metamorphic_Placemark");
                // let Igneous = new WorldWind.RenderableLayer("USGS_MD_Igneous_Placemark");
                // let Sedimentary = new WorldWind.RenderableLayer("USGS_MD_Sedimentary_Placemark");
                // let Hydrothermal = new WorldWind.RenderableLayer("USGS_MD_Hydrothermal_Placemark");

                // Gold.enabled = Nickel.enabled = Iron.enabled = Aluminum.enabled = LeadZinc.enabled = PGE.enabled = Diamond.enabled = Clay.enabled = Potash.enabled = RareEarths.enabled = Silver.enabled = MultipleCommodities.enabled = Unclassified.enabled = Surficial.enabled = Metamorphic.enabled = Igneous.enabled = Sedimentary.enabled = Hydrothermal.enabled = false;

                MajorCommodity.enabled = MajorType.enabled = false;


                resp.data.forEach (function (ele, i) {
                    let CommodityPK = new createMDPK(ele.commodity, ele);
                    let TypePK = new createMDPK(ele.dep_type, ele);
                    // let Name = new createMDPK(ele.dep_name, ele);

                    MajorType.addRenderable(TypePK.pk);
                    MajorCommodity.addRenderable(CommodityPK.pk);
                    // heightPLayer.addRenderable(heightPK.pk);

                    // add placemark layers into WorldWind layers object
                    if (i === resp.data.length - 1) {
                        newGlobe.addLayer(MajorCommodity);
                        newGlobe.addLayer(MajorType);
                        // newGlobe.addLayer(heightPLayer);
                    }
                });
            } else {
                alert(resp.error)
            }
        }
    });
});
