requirejs([
        './newGlobe',
        '../config/mainconf',
        ], function (newGlobe) {

    "use strict";
    console.log(newGlobe.layers);

    //fetch the data from db and generate plackmarks and placemark layers
    $.ajax({
        url: '/uswtdb',
        type: 'GET',
        dataType: 'json',
        async: false,
        success: function (resp) {
            console.log(resp.data);
            if (!resp.error) {
                let circle = document.createElement("canvas"),
                    ctx = circle.getContext('2d'),
                    radius = 10,
                    r2 = radius + radius;

                circle.width = circle.height = r2;

                let gradient = ctx.createRadialGradient(radius, radius, 0, radius, radius, radius);
                // gradient.addColorStop(0, "rgba(192, 192, 192, 0.25)");
                gradient.addColorStop(0, "rgba(255, 255, 255, 0)");

                ctx.beginPath();
                ctx.arc(radius, radius, radius, 0, Math.PI * 2, true);

                ctx.fillStyle = gradient;
                ctx.fill();
                // ctx.strokeStyle = "rgb(255, 255, 255)";
                // ctx.stroke();

                ctx.closePath();

                // start to create placemarks and placemark layers
                let placemark = [];

                for (let i = 0; i < resp.data.length; i++) {

                    let placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
                    placemarkAttributes.imageSource = new WorldWind.ImageSource(circle);
                    placemarkAttributes.imageScale = 0.5;

                    let highlightAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
                    highlightAttributes.imageScale = 2.0;

                    let placemarkPosition = new WorldWind.Position(resp.data[i].ylat, resp.data[i].xlong, 0);
                    placemark[i] = new WorldWind.Placemark(placemarkPosition, false, placemarkAttributes);
                    placemark[i].altitudeMode = WorldWind.RELATIVE_TO_GROUND;
                    placemark[i].highlightAttributes = highlightAttributes;
                    placemark[i].userProperties.p_name = resp.data[i].p_name;
                    placemark[i].userProperties.t_state = resp.data[i].t_state;
                    placemark[i].userProperties.p_year = (resp.data[i].p_year === -9999) ? 'N/A' : resp.data[i].p_year;
                    placemark[i].userProperties.p_tnum = resp.data[i].p_tnum;
                    placemark[i].userProperties.p_cap = (resp.data[i].p_cap === -9999) ? 'N/A' : resp.data[i].p_cap;
                    placemark[i].userProperties.p_avgcap = (resp.data[i].p_avgcap === -9999) ? 'N/A' : resp.data[i].p_avgcap;
                    placemark[i].userProperties.t_ttlh = (resp.data[i].t_ttlh === -9999) ? 'N/A' : resp.data[i].t_ttlh;
                    placemark[i].userProperties.p_year_color = resp.data[i].p_year_color;
                    placemark[i].userProperties.p_avgcap_color = resp.data[i].p_avgcap_color;
                    placemark[i].userProperties.t_ttlh_color = resp.data[i].t_ttlh_color;

                    let layerFound = newGlobe.layers.find( element => element.displayName === resp.data[i].p_name );
                    let layerIndex = newGlobe.layers.indexOf(layerFound);

                    if (layerIndex != -1) {
                        newGlobe.layers[layerIndex].addRenderable(placemark[i]);
                    } else {
                        let placemarkLayer = new WorldWind.RenderableLayer(resp.data[i].p_name);
                        placemarkLayer.addRenderable(placemark[i]);
                        newGlobe.addLayer(placemarkLayer)
                    }


                    // if (i === resp.data.length - 1) {
                    //     newGlobe.goTo(new WorldWind.Position(37.0902, -95.7129, config.eyeDistance_initial));
                    // }

                    // if (i === 0 || resp.data[i].p_name !== resp.data[i - 1].p_name) {
                    //     autoSuggestion.push({"value": resp.data[i].p_name, "lati": resp.data[i].ylat, "long": resp.data[i].xlong, "i": newGlobe.layers.length - 1});
                    //     // autoSuggestion.push({"value": resp.data[i].p_name, "lati": resp.data[i].ylat, "long": resp.data[i].xlong, "i": [newGlobe.layers.length - 1]});
                    // } else {
                    //     autoSuggestion[autoSuggestion.length - 1].i += ('-' + (newGlobe.layers.length - 1));
                    //     // autoSuggestion[autoSuggestion.length - 1].i.push(newGlobe.layers.length - 1);
                    // }


                }
            } else {alert(resp.error)}
        }
    });
});
