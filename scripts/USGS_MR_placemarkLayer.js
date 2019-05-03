requirejs([
        './newGlobe',
        '../config/mainconf',
        ], function (newGlobe) {

    "use strict";
    console.log(newGlobe.layers);
    let createWTPK = function(color, element) {
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

        let placemarkPosition = new WorldWind.Position(element.latitude, element.longitude, 0);

        this.pk = new WorldWind.Placemark(placemarkPosition, false, placemarkAttributes);
        this.pk.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
        this.pk.highlightAttributes = highlightAttributes;
        this.pk.userProperties.site_name = element.site_name;
        this.pk.userProperties.dev_stat = element.dev_stat;
        this.pk.userProperties.commodity = element.commod1.split(",")[0];
    };
    //fetch the data from db and generate plackmarks and placemark layers
    let an = "USGS_MR_Antimony_Placemark";
    let as = "USGS_MR_Asbestos_Placemark";
    let ch = "USGS_MR_Chromium_Placemark";
    let co = "USGS_MR_Copper_Placemark";
    let go = "USGS_MR_Gold_Placemark";
    let ir = "USGS_MR_Iron_Placemark";
    let le = "USGS_MR_Lead_Placemark";
    let ma = "USGS_MR_Manganese_Placemark";
    let mo = "USGS_MR_Molybdenum_Placemark";
    let ni = "USGS_MR_Nickel_Placemark";
    let si = "USGS_MR_Silver_Placemark";
    let tu = "USGS_MR_Tungsten_Placemark";
    let ur = "USGS_MR_Uranium_Placemark";
    let zi = "USGS_MR_Zinc_Placemark";
    let ot = "USGS_MR_Other_Placemark";

    let arrName = [an, as, ch, co, go, ir, le, ma, mo, ni, si, tu, ur, zi, ot];

    for (let i = 0; i < arrName.length; i++) {
        let layerName = "layerName=" + arrName[i];
        console.log(layerName);
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

                    let newL = new WorldWind.RenderableLayer("" + b + "");
                    // generate placemark layers
                    // let Gold = new WorldWind.RenderableLayer("USGS_MR_Gold_Placemark");
                    // let Silver = new WorldWind.RenderableLayer("USGS_MR_Silver_Placemark");
                    // let Antimony = new WorldWind.RenderableLayer("USGS_MR_Antimony_Placemark");
                    // let Asbestos = new WorldWind.RenderableLayer("USGS_MR_Asbestos_Placemark");
                    // let Chromium = new WorldWind.RenderableLayer("USGS_MR_Chromium_Placemark");
                    // let Copper = new WorldWind.RenderableLayer("USGS_MR_Copper_Placemark");
                    // let Iron = new WorldWind.RenderableLayer("USGS_MR_Iron_Placemark");
                    // let Lead = new WorldWind.RenderableLayer("USGS_MR_Lead_Placemark");
                    // let Manganese = new WorldWind.RenderableLayer("USGS_MR_Manganese_Placemark");
                    // let Molybdenum = new WorldWind.RenderableLayer("USGS_MR_Molybdenum_Placemark");
                    // let Nickel = new WorldWind.RenderableLayer("USGS_MR_Nickel_Placemark");
                    // let Tungsten = new WorldWind.RenderableLayer("USGS_MR_Tungsten_Placemark");
                    // let Uranium = new WorldWind.RenderableLayer("USGS_MR_Uranium_Placemark");
                    // let Zinc = new WorldWind.RenderableLayer("USGS_MR_Zinc_Placemark");
                    // let Other = new WorldWind.RenderableLayer("USGS_MR_Other_Placemark");
                    //
                    // Gold.enabled = Silver.enabled = Antimony.enabled = Asbestos.enabled = Chromium.enabled = Copper.enabled = Iron.enabled = Lead.enabled = Manganese.enabled = Molybdenum.enabled = Nickel.enabled = Tungsten.enabled = Uranium.enabled = Zinc.enabled = Other.enabled = false;

                    newL.enabled = false;
                    let pkColor;
                    if (arrName[0] === b) {
                        pkColor = "#2E4053";
                    } else if (arrName[1] === b) {
                        pkColor = "#1F618D";
                    } else if (arrName[2] === b) {
                        pkColor = "#D5F5E3";
                    } else if (arrName[3] === b) {
                        pkColor = "#E67E22";
                    } else if (arrName[4] === b) {
                        pkColor = "#F7DC6F";
                    } else if (arrName[5] === b) {
                        pkColor = "#CB4335";
                    } else if (arrName[6] === b) {
                        pkColor = "#117864";
                    } else if (arrName[7] === b) {
                        pkColor = "#AED6F1";
                    } else if (arrName[8] === b) {
                        pkColor = "#FAD7A0";
                    } else if (arrName[9] === b) {
                        pkColor = "#F1948A";
                    } else if (arrName[10] === b) {
                        pkColor = "#48C9B0";
                    } else if (arrName[11] === b) {
                        pkColor = "#922B21";
                    } else if (arrName[12] === b) {
                        pkColor = "#9B59B6";
                    } else if (arrName[13] === b) {
                        pkColor = "#BA4A00";
                    } else if (arrName[14] === b) {
                        pkColor = "#A6ACAF";
                    }
                    resp.commN.forEach (function (ele, i) {
                        let newP = new createWTPK(""+ pkColor +"", ele);
                        newL.addRenderable(newP.pk);
                        // let GoldP = new createWTPK("#F7DC6F", ele);
                        // let SilverP = new createWTPK("#48C9B0", ele);
                        // let AntimonyP = new createWTPK("#2E4053", ele);
                        // let AsbestosP = new createWTPK("#1F618D", ele);
                        // let ChromiumP = new createWTPK("#D5F5E3", ele);
                        // let CopperP = new createWTPK("#E67E22", ele);
                        // let IronP = new createWTPK("#CB4335", ele);
                        // let LeadP = new createWTPK("#117864", ele);
                        // let ManganeseP = new createWTPK("#AED6F1", ele);
                        // let MolybdenumP = new createWTPK("#FAD7A0", ele);
                        // let NickelP = new createWTPK("#F1948A", ele);
                        // let TungstenP = new createWTPK("#922B21", ele);
                        // let UraniumP = new createWTPK("#9B59B6", ele);
                        // let ZincP = new createWTPK("#BA4A00", ele);
                        // let OtherP = new createWTPK("#A6ACAF", ele);
                        //
                        // Gold.addRenderable(GoldP.pk);
                        // Silver.addRenderable(SilverP.pk);
                        // Antimony.addRenderable(AntimonyP.pk);
                        // Asbestos.addRenderable(AsbestosP.pk);
                        // Chromium.addRenderable(ChromiumP.pk);
                        // Copper.addRenderable(CopperP.pk);
                        // Iron.addRenderable(IronP.pk);
                        // Lead.addRenderable(LeadP.pk);
                        // Manganese.addRenderable(ManganeseP.pk);
                        // Molybdenum.addRenderable(MolybdenumP.pk);
                        // Nickel.addRenderable(NickelP.pk);
                        // Tungsten.addRenderable(TungstenP.pk);
                        // Uranium.addRenderable(UraniumP.pk);
                        // Zinc.addRenderable(ZincP.pk);
                        // Other.addRenderable(OtherP.pk);

                        // add placemark layers into WorldWind layers object
                        if (i === resp.commN.length - 1) {
                            newGlobe.addLayer(newL);
                            // newGlobe.addLayer(Gold);
                            // newGlobe.addLayer(Silver);
                            // newGlobe.addLayer(Antimony);
                            // newGlobe.addLayer(Asbestos);
                            // newGlobe.addLayer(Chromium);
                            // newGlobe.addLayer(Copper);
                            // newGlobe.addLayer(Iron);
                            // newGlobe.addLayer(Lead);
                            // newGlobe.addLayer(Manganese);
                            // newGlobe.addLayer(Molybdenum);
                            // newGlobe.addLayer(Nickel);
                            // newGlobe.addLayer(Tungsten);
                            // newGlobe.addLayer(Uranium);
                            // newGlobe.addLayer(Zinc);
                            // newGlobe.addLayer(Other);
                        }
                    });
                } else {
                    alert(resp.error)
                }
            }
        });
    }

});
