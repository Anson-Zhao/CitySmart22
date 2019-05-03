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
    $.ajax({
        url: '/mrdsData',
        type: 'GET',
        dataType: 'json',
        async: false,
        success: function (resp) {
            console.log(resp.data);
            if (!resp.error) {
                // generate placemark layers
                let Gold = new WorldWind.RenderableLayer("Gold_Placemark");
                let Silver = new WorldWind.RenderableLayer("Silver_Placemark");
                let Antimony = new WorldWind.RenderableLayer("Antimony_Placemark");
                let Asbestos = new WorldWind.RenderableLayer("Asbestos_Placemark");
                let Chromium = new WorldWind.RenderableLayer("Chromium_Placemark");
                let Copper = new WorldWind.RenderableLayer("Copper_Placemark");
                let Iron = new WorldWind.RenderableLayer("Iron_Placemark");
                let Lead = new WorldWind.RenderableLayer("Lead_Placemark");
                let Manganese = new WorldWind.RenderableLayer("Manganese_Placemark");
                let Molybdenum = new WorldWind.RenderableLayer("Molybdenum_Placemark");
                let Nickel = new WorldWind.RenderableLayer("Nickel_Placemark");
                let Tungsten = new WorldWind.RenderableLayer("Tungsten_Placemark");
                let Uranium = new WorldWind.RenderableLayer("Uranium_Placemark");
                let Zinc = new WorldWind.RenderableLayer("Zinc_Placemark");
                let Other = new WorldWind.RenderableLayer("Other_Placemark");

                Gold.enabled = Silver.enabled = Antimony.enabled = Asbestos.enabled = Chromium.enabled = Copper.enabled = Iron.enabled = Lead.enabled = Manganese.enabled = Molybdenum.enabled = Nickel.enabled = Tungsten.enabled = Uranium.enabled = Zinc.enabled = Other.enabled = false;

                resp.data.forEach (function (ele, i) {
                    let GoldP = new createWTPK("#F7DC6F", ele);
                    let SilverP = new createWTPK("#48C9B0", ele);
                    let AntimonyP = new createWTPK("#2E4053", ele);
                    let AsbestosP = new createWTPK("#1F618D", ele);
                    let ChromiumP = new createWTPK("#D5F5E3", ele);
                    let CopperP = new createWTPK("#E67E22", ele);
                    let IronP = new createWTPK("#CB4335", ele);
                    let LeadP = new createWTPK("#117864", ele);
                    let ManganeseP = new createWTPK("#AED6F1", ele);
                    let MolybdenumP = new createWTPK("#FAD7A0", ele);
                    let NickelP = new createWTPK("#F1948A", ele);
                    let TungstenP = new createWTPK("#922B21", ele);
                    let UraniumP = new createWTPK("#9B59B6", ele);
                    let ZincP = new createWTPK("#BA4A00", ele);
                    let OtherP = new createWTPK("#A6ACAF", ele);

                    Gold.addRenderable(GoldP.pk);
                    Silver.addRenderable(SilverP.pk);
                    Antimony.addRenderable(AntimonyP.pk);
                    Asbestos.addRenderable(AsbestosP.pk);
                    Chromium.addRenderable(ChromiumP.pk);
                    Copper.addRenderable(CopperP.pk);
                    Iron.addRenderable(IronP.pk);
                    Lead.addRenderable(LeadP.pk);
                    Manganese.addRenderable(ManganeseP.pk);
                    Molybdenum.addRenderable(MolybdenumP.pk);
                    Nickel.addRenderable(NickelP.pk);
                    Tungsten.addRenderable(TungstenP.pk);
                    Uranium.addRenderable(UraniumP.pk);
                    Zinc.addRenderable(ZincP.pk);
                    Other.addRenderable(OtherP.pk);

                    // add placemark layers into WorldWind layers object
                    if (i === resp.data.length - 1) {
                        newGlobe.addLayer(Gold);
                        newGlobe.addLayer(Silver);
                        newGlobe.addLayer(Antimony);
                        newGlobe.addLayer(Asbestos);
                        newGlobe.addLayer(Chromium);
                        newGlobe.addLayer(Copper);
                        newGlobe.addLayer(Iron);
                        newGlobe.addLayer(Lead);
                        newGlobe.addLayer(Manganese);
                        newGlobe.addLayer(Molybdenum);
                        newGlobe.addLayer(Nickel);
                        newGlobe.addLayer(Tungsten);
                        newGlobe.addLayer(Uranium);
                        newGlobe.addLayer(Zinc);
                        newGlobe.addLayer(Other);
                    }
                });
            } else {
                alert(resp.error)
            }
        }
    });
});
