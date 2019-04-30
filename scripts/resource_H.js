
requirejs([
        './newGlobe',
        '../config/mainconf'

    ],
    function (
        newGlobe

    ) {
        "use strict";

        // Web Map Service information from NASA's Near Earth Observations WMS
        // let serviceAddress = config.Download_To;
        // let preloadheatmapLayers = [];//preload entire layer name
        // let placemark = [];
        // let preloadLayer = [];

        console.log("this is resource H");
        $.ajax({
            url: '/mrdsData',
            type: 'GET',
            dataType: 'json',
            // data: data,
            async: false,
            success: function (resp) {
                if (!resp.error) {
                    var data = [];
                    /*var layerNames = [];
                    var placemarkLayers = [];

                    var circle = document.createElement("canvas"),
                        ctx = circle.getContext('2d'),
                        radius = 10,
                        r2 = radius + radius;

                    circle.width = circle.height = r2;

                    var gradient = ctx.createRadialGradient(radius, radius, 0, radius, radius, radius);
                    // gradient.addColorStop(0, "rgba(192, 192, 192, 0.25)");
                    gradient.addColorStop(0, "rgba(255, 255, 255, 0)");

                    ctx.beginPath();
                    ctx.arc(radius, radius, radius, 0, Math.PI * 2, true);

                    ctx.fillStyle = gradient;
                    ctx.fill();
                    // ctx.strokeStyle = "rgb(255, 255, 255)";
                    // ctx.stroke();

                    ctx.closePath();
                    console.log(new Date());

                    var placemarkLayer = new WorldWind.RenderableLayer("USWTDB");

                    console.log(wwd.goToAnimator);*/

                    for (var i = 0; i < resp.data.length; i++) {
                        data[i] = new WorldWind.MeasuredLocation(resp.data[i].latitude, resp.data[i].longitude, 1);

                        // var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
                        // placemarkAttributes.imageSource = new WorldWind.ImageSource(circle);
                        // placemarkAttributes.imageScale = 0.5;
                        //
                        // var highlightAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
                        // highlightAttributes.imageScale = 2.0;
                        //
                        // var placemarkPosition = new WorldWind.Position(resp.data[i].latitude, resp.data[i].longitude, 0);
                        // placemark[i] = new WorldWind.Placemark(placemarkPosition, false, placemarkAttributes);
                        // placemark[i].altitudeMode = WorldWind.RELATIVE_TO_GROUND;
                        // placemark[i].highlightAttributes = highlightAttributes;
                        //
                        // placemark[i].userProperties.site_name = resp.data[i].site_name;
                        // placemark[i].userProperties.dev_stat = resp.data[i].dev_stat;
                        // placemark[i].userProperties.commodity = resp.data[i].commod1.split(",")[0];
                        //
                        // var placemarkLayer = new WorldWind.RenderableLayer(resp.data[i].mrds_id);
                        // placemarkLayer.addRenderable(placemark[i]);
                        // wwd.addLayer(placemarkLayer);

                        if (i === resp.data.length - 1) {
                            console.log(data);
                            var heatmapLayer = new WorldWind.heatmapLayer("Heatmap", data,
                            //     {
                            //     // tile: HeatmapTile,
                            //     currentTiles: newGlobe.ImageTile,
                            //     incrementPerIntensity: 0.05,
                            //     blur: 10,
                                // scale: ['rgba(255, 255, 255, 0)', 'rgba(172, 211, 236, 0.25)', 'rgba(204, 255, 255, 0.5)', 'rgba(0, 191, 0, 0.5)']
                            //     scale: ['#000000', '#ffffff', '#00ff00', '#ffff00', '#ff0000']
                            // }
                            );
                            heatmapLayer.scale = [
                                '#0071ff',
                                '#65d6ff',
                                '#74ff7c',
                                '#fffd55',
                                '#ffac5b',
                                '#ff7500',
                                '#FF3A33'];
                            heatmapLayer.radius = 6;
                            // heatmapLayer.gradient = [0, 0.3, 0.5, 0.7, 0.9];
                            heatmapLayer.incrementPerIntensity = 0.2;
                            console.log(heatmapLayer);

                            heatmapLayer.enabled = false;
                            newGlobe.addLayer(heatmapLayer);

                            // wwd.goTo(new WorldWind.Position(64.2008, -149.4937, mainconfig.eyeDistance_initial));
                            // console.log(wwd.layers);
                        }
                    }

                    // var locations = [];
                    // for (var i = 0; i < 10000; i++) {
                    //     locations.push(
                    //         new WorldWind.MeasuredLocation(
                    //             -89 + (179 * Math.random()),
                    //             -179 + (359 * Math.random()),
                    //             1
                    //         )
                    //     );
                    // }
                    // console.log(locations);
                    //
                    // // Add new HeatMap Layer with the points as the data source.
                    // newGlobe.addLayer(new WorldWind.heatmapLayer("HeatMap", locations));
                }
            }
        });
        
        /*function createWMSLayer (xmlDom) {

            // Create a WmsCapabilities object from the XML DOM
            let wms = new WorldWind.WmsCapabilities(xmlDom);

            // Retrieve a WmsLayerCapabilities object by the desired layer name

            $(".heatmapLayer").each(function (i) {

                preloadheatmapLayers[i] = $(this).val();

                var heatmapLayer = new WorldWind.heatmapLayer("Heatmap", data, {
                    // tile: RadiantCircleTile,
                    incrementPerIntensity: 0.05,
                    blur: 10,
                    // scale: ['rgba(255, 255, 255, 0)', 'rgba(172, 211, 236, 0.25)', 'rgba(204, 255, 255, 0.5)', 'rgba(0, 191, 0, 0.5)']
                    scale: ['#000000', '#ffffff', '#00ff00', '#ffff00', '#ff0000']
                });

                // heatmapLayer.enabled = false;

                // Add the layers to WorldWind and update the layer manager
                newGlobe.addLayer(heatmapLayer);

            });
        }

        Called if an error occurs during WMS Capabilities document retrieval
        function logError (jqXhr, text, exception) {
            console.log("There was a failure retrieving the capabilities document: " + text + " exception: " + exception);
        }

        $(document).ready(function () {

            let preloadLayerStr = preloadLayer + '';//change preloadLayer into a string
            preloadWmsLayers = preloadLayerStr.split(",");//split preloadLayerStr with ","

            preload wmsLayer
            $.get(serviceAddress).done(createWMSLayer).fail(logError);// get the xml file of wmslayer and pass the file into  createLayer function.

            return heatmapLayer;
        });*/

    });
