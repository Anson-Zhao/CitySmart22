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

    // $(document).ready(function() {
    //
    //     // Listen for mouse moves and highlight the placemarks that the cursor rolls over.
    //     // $(function () {
    //     //
    //     //     let placemark = [];
    //     //     let autoSuggestion = [];
    //     //     // let suggestedLayer;
    //     //     // let clickedLayer;
    //     //
    //     //     // reading configGlobal from mainconf.js
    //     //     let config.= config;
    //     //     // console.log(config.;
    //     //
    //     //     // newGlobe.worldWindowController.__proto__.handleWheelEvent = function (event) {
    //     //     //     let navigator = this.newGlobe.navigator;
    //     //     //     // Normalize the wheel delta based on the wheel delta mode. This produces a roughly consistent delta across
    //     //     //     // browsers and input devices.
    //     //     //     let normalizedDelta;
    //     //     //     if (event.deltaMode === WheelEvent.DOM_DELTA_PIXEL) {
    //     //     //         normalizedDelta = event.deltaY;
    //     //     //     } else if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
    //     //     //         normalizedDelta = event.deltaY * 40;
    //     //     //     } else if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
    //     //     //         normalizedDelta = event.deltaY * 400;
    //     //     //     }
    //     //     //
    //     //     //     // Compute a zoom scale factor by adding a fraction of the normalized delta to 1. When multiplied by the
    //     //     //     // navigator's range, this has the effect of zooming out or zooming in depending on whether the delta is
    //     //     //     // positive or negative, respectfully.
    //     //     //     let scale = 1 + (normalizedDelta / 1000);
    //     //     //
    //     //     //     // Apply the scale to this navigator's properties.
    //     //     //     navigator.range *= scale;
    //     //     //     this.applyLimits();
    //     //     //     this.newGlobe.redraw();
    //     //     //
    //     //     //     autoSwitch();
    //     //     //     totalWTCap();
    //     //     //     layerMenu();
    //     //     //     clearHighlight(true, true);
    //     //     // };
    //     //     //
    //     //     // newGlobe.worldWindowController.allGestureListeners[0].__proto__.handleZoom = function(e, control) {
    //     //     //     let handled = false;
    //     //     //     // Start an operation on left button down or touch start.
    //     //     //     if (this.isPointerDown(e) || this.isTouchStart(e)) {
    //     //     //         this.activeControl = control;
    //     //     //         this.activeOperation = this.handleZoom;
    //     //     //         e.preventDefault();
    //     //     //         if (this.isTouchStart(e)) {
    //     //     //             this.currentTouchId = e.changedTouches.item(0).identifier; // capture the touch identifier
    //     //     //         }
    //     //     //         // This function is called by the timer to perform the operation.
    //     //     //         let thisLayer = this; // capture 'this' for use in the function
    //     //     //         let setRange = function () {
    //     //     //             if (thisLayer.activeControl) {
    //     //     //                 if (thisLayer.activeControl === thisLayer.zoomInControl) {
    //     //     //                     thisLayer.newGlobe.navigator.range *= (1 - thisLayer.zoomIncrement);
    //     //     //                 } else if (thisLayer.activeControl === thisLayer.zoomOutControl) {
    //     //     //                     thisLayer.newGlobe.navigator.range *= (1 + thisLayer.zoomIncrement);
    //     //     //                 }
    //     //     //                 thisLayer.newGlobe.redraw();
    //     //     //
    //     //     //                 // autoSwitch();
    //     //     //                 // console.log(newGlobe.layers[0].eyeText.text);
    //     //     //                 setTimeout(function() {autoSwitch(); totalWTCap(); layerMenu(); clearHighlight(true, true);}, 25);
    //     //     //
    //     //     //                 setTimeout(setRange, 50);
    //     //     //             }
    //     //     //         };
    //     //     //
    //     //     //         setTimeout(setRange, 50);
    //     //     //         handled = true;
    //     //     //     }
    //     //     //     return handled;
    //     //     // };
    //     //     //
    //     //     // newGlobe.worldWindowController.allGestureListeners[0].__proto__.handlePan = function(e, control) {
    //     //     //     let handled = false;
    //     //     //     // Capture the current position.
    //     //     //     if (this.isPointerDown(e) || this.isPointerMove(e)) {
    //     //     //         this.currentEventPoint = this.newGlobe.canvasCoordinates(e.clientX, e.clientY);
    //     //     //     } else if (this.isTouchStart(e) || this.isTouchMove(e)) {
    //     //     //         let touch = e.changedTouches.item(0);
    //     //     //         this.currentEventPoint = this.newGlobe.canvasCoordinates(touch.clientX, touch.clientY);
    //     //     //     }
    //     //     //     // Start an operation on left button down or touch start.
    //     //     //     if (this.isPointerDown(e) || this.isTouchStart(e)) {
    //     //     //         this.activeControl = control;
    //     //     //         this.activeOperation = this.handlePan;
    //     //     //         e.preventDefault();
    //     //     //         if (this.isTouchStart(e)) {
    //     //     //             this.currentTouchId = e.changedTouches.item(0).identifier; // capture the touch identifier
    //     //     //         }
    //     //     //         // This function is called by the timer to perform the operation.
    //     //     //         let thisLayer = this; // capture 'this' for use in the function
    //     //     //         let setLookAtLocation = function () {
    //     //     //             if (thisLayer.activeControl) {
    //     //     //                 let dx = thisLayer.panControlCenter[0] - thisLayer.currentEventPoint[0],
    //     //     //                     dy = thisLayer.panControlCenter[1]
    //     //     //                         - (thisLayer.newGlobe.viewport.height - thisLayer.currentEventPoint[1]),
    //     //     //                     oldLat = thisLayer.newGlobe.navigator.lookAtLocation.latitude,
    //     //     //                     oldLon = thisLayer.newGlobe.navigator.lookAtLocation.longitude,
    //     //     //                     // Scale the increment by a constant and the relative distance of the eye to the surface.
    //     //     //                     scale = thisLayer.panIncrement
    //     //     //                         * (thisLayer.newGlobe.navigator.range / thisLayer.newGlobe.globe.radiusAt(oldLat, oldLon)),
    //     //     //                     heading = thisLayer.newGlobe.navigator.heading + (Math.atan2(dx, dy) * Angle.RADIANS_TO_DEGREES),
    //     //     //                     distance = scale * Math.sqrt(dx * dx + dy * dy);
    //     //     //                 Location.greatCircleLocation(thisLayer.newGlobe.navigator.lookAtLocation, heading, -distance,
    //     //     //                     thisLayer.newGlobe.navigator.lookAtLocation);
    //     //     //                 thisLayer.newGlobe.redraw();
    //     //     //
    //     //     //                 // console.log(newGlobe.navigator.lookAtLocation);
    //     //     //                 // layerMenu();
    //     //     //                 // clearHighlight(true, true);
    //     //     //                 setTimeout(function() {totalWTCap(); layerMenu(); clearHighlight(true, true);}, 25);
    //     //     //
    //     //     //                 setTimeout(setLookAtLocation, 50);
    //     //     //             }
    //     //     //         };
    //     //     //         setTimeout(setLookAtLocation, 50);
    //     //     //         handled = true;
    //     //     //     }
    //     //     //     return handled;
    //     //     //
    //     //     // };
    //     //     //
    //     //     // function autoSwitch() {
    //     //     //     if ($("#switchMethod").is(':checked')) {
    //     //     //         let altitude = newGlobe.layers[0].eyeText.text;
    //     //     //
    //     //     //         if (altitude.substring(altitude.length - 2, altitude.length) === "km") {
    //     //     //             altitude = altitude.replace(/Eye  |,| km/g, '');
    //     //     //         } else {
    //     //     //             altitude = (altitude.replace(/Eye  |,| m/g, '')) / 1000;
    //     //     //         }
    //     //     //
    //     //     //         if (altitude <= config.eyeDistance_Heatmap && !$("#switchLayer").is(':checked')) {
    //     //     //             $("#switchLayer").click();
    //     //     //             $("#switchNote").html("");
    //     //     //             $("#switchNote").append("NOTE: Toggle switch to temporarily view density heatmap.");
    //     //     //             $("#globeNote").html("");
    //     //     //             $("#globeNote").append("NOTE: Zoom in to an eye distance of more than 4,500 km to view the density heatmap.");
    //     //     //
    //     //     //         } else if (altitude > config.eyeDistance_Heatmap && $("#switchLayer").is(':checked')) {
    //     //     //             $("#switchNote").html("");
    //     //     //             $("#switchNote").append("NOTE: Toggle switch to temporarily view point locations.");
    //     //     //             $("#globeNote").html("");
    //     //     //             $("#globeNote").append("NOTE: Zoom in to an eye distance of less than 4,500 km to view the point locations.");
    //     //     //
    //     //     //             $("#switchLayer").click();
    //     //     //         }
    //     //     //
    //     //     //         if (altitude <= config.eyeDistance_PL && $("#switchLayer").is(':checked')) {
    //     //     //             $("#menuNote").html("");
    //     //     //             $("#menuNote").append("NOTE: Click the items listed below in the menu to fly to and highlight point location(s).");
    //     //     //         } else if (altitude > config.eyeDistance_PL && $("#switchLayer").is(':checked')) {
    //     //     //             $("#menuNote").html("");
    //     //     //             $("#menuNote").append("NOTE: Zoom in to an eye distance of less than 1,500 km to display a menu for wind turbines.");
    //     //     //         }
    //     //     //     }
    //     //     // }
    //     //     //
    //     //     // function totalWTCap() {
    //     //     //
    //     //     //     let totalWT = 0;
    //     //     //     let totalCap = 0;
    //     //     //
    //     //     //     for (let i = layers.length; i < newGlobe.layers.length - 1; i++) {
    //     //     //
    //     //     //         if (newGlobe.layers[i].inCurrentFrame) {
    //     //     //             totalWT++;
    //     //     //             if (newGlobe.layers[i].renderables[0].userProperties.p_avgcap !== "N/A") {
    //     //     //                 totalCap += newGlobe.layers[i].renderables[0].userProperties.p_avgcap;
    //     //     //             }
    //     //     //         }
    //     //     //
    //     //     //         if (i === newGlobe.layers.length - 2) {
    //     //     //             // console.log(totalWT);
    //     //     //             // console.log(totalCap);
    //     //     //             $("#totalWTCap").html("Showing <strong>" + totalWT + "</strong> turbines on screen with a total rated capacity of <strong>" + Math.round(totalCap) + "</strong> MW");
    //     //     //         }
    //     //     //     }
    //     //     // }
    //     //     //
    //     //     // function clearHighlight(suggested, clicked) {
    //     //     //     if (suggestedLayer && suggested) {
    //     //     //         // let layer = newGlobe.layers[suggestedLayer];
    //     //     //         // for (let i = 0; i < layer.renderables.length; i++) {
    //     //     //         //     layer.renderables[i].highlighted = false;
    //     //     //         //
    //     //     //         //     if (i === layer.renderables.length - 1) {
    //     //     //         //         suggestedLayer = "";
    //     //     //         //     }
    //     //     //         // }
    //     //     //
    //     //     //         let layerIndex = suggestedLayer.toString().split('-');
    //     //     //         for (let i = 0; i < layerIndex.length; i++) {
    //     //     //             newGlobe.layers[layerIndex[i]].renderables[0].highlighted = false;
    //     //     //
    //     //     //             if (i === layerIndex.length - 1) {
    //     //     //                 suggestedLayer = "";
    //     //     //             }
    //     //     //         }
    //     //     //     }
    //     //     //
    //     //     //     if (clickedLayer && clicked) {
    //     //     //         // let layer = newGlobe.layers[clickedLayer];
    //     //     //         // for (let i = 0; i < layer.renderables.length; i++) {
    //     //     //         //     layer.renderables[i].highlighted = false;
    //     //     //         //
    //     //     //         //     if (i === layer.renderables.length - 1) {
    //     //     //         //         moveList(clickedLayer);
    //     //     //         //     }
    //     //     //         // }
    //     //     //
    //     //     //         let layerIndex = clickedLayer.toString().split('-');
    //     //     //         for (let i = 0; i < layerIndex.length; i++) {
    //     //     //             newGlobe.layers[layerIndex[i]].renderables[0].highlighted = false;
    //     //     //
    //     //     //             if (i === layerIndex.length - 1) {
    //     //     //                 clickedLayer = "";
    //     //     //             }
    //     //     //         }
    //     //     //     }
    //     //     // }
    //     //
    //     //
    //     // })
    // });
});
