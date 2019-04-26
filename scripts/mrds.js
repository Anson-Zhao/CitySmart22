requirejs([
        './newGlobe',
        '../3rdPartyLibs/domReady',
        './worldwind.min',
        './LayerManager',
        './RadiantCircleTile',
        '../src/util/WWMath',
        '../src/geom/Angle',
        '../src/geom/Location',
        '../config/mainconf'],
    function (newGlobe,
              domReady,
              WorldWind,
              LayerManager,
              RadiantCircleTile,
              WWMath,
              Angle,
              Location) {
        "use strict";

        $(document).ready(function() {
            $(function () {

                // newGlobe.redraw;
                //
                // newGlobe.goTo(new WorldWind.Position(37.0902, -95.7129, 9000000));

                // Web Map Service information from NASA's Near Earth Observations WMS
                // let serviceAddress = "https://cors.aworldbridgelabs.com:9084/http://cs.aworldbridgelabs.com:8080/geoserver/ows?service=wms&version=1.3.0&request=GetCapabilities";
                // let serviceAddress = "../config/ows.xml";

                // let preloadWMSLayerName = [];
                // // let highlightedItems= [];
                // let preloadLayer = []; //preload entire layer name
                // let layers = newGlobe.layers;
                // let bob=[];
                let placemark = [];
                let allCheckedArray=[];
                var mainconfig = config;
                // console.log(mainconfig);




                    // var category = this.id;
                    // console.log(category);
                    var color = {


                        'Antimony': "#2E4053",
                        'Asbestos': "#1F618D",
                        'Chromium': "#D5F5E3",
                        'Copper': "#E67E22",
                        'Gold': "#F7DC6F",
                        'Iron': "#CB4335",
                        'Lead': "#117864",
                        'Manganese': "#AED6F1",
                        'Molybdenum': "#FAD7A0",
                        'Nickel': "#F1948A",
                        'Silver': "#48C9B0",
                        'Tungsten': "#922B21",
                        'Uranium': "#9B59B6",
                        'Zinc': "#BA4A00",
                        'Other': "#A6ACAF",

                        'Past Producer': "#D98880",
                        'Producer': "#A93226",
                        'Occurrence': "#82E0AA",
                        'Prospect': "#28B463",
                        'Unknown': "#A6ACAF",

                        'undefined': "#ffffff"
                    };




                    for (var i = 0; i < placemark.length; i++) {
                        var circle = document.createElement("canvas"),
                            ctx = circle.getContext('2d'),
                            radius = 10,
                            r2 = radius + radius;

                        circle.width = circle.height = r2;

                        var gradient = ctx.createRadialGradient(radius, radius, 0, radius, radius, radius);
                        // console.log(placemark[i].userProperties[category]);
                        // console.log(color[placemark[i].userProperties[category]]);

                        // if (!color[placemark[i].userProperties[category]]) {
                        //     gradient.addColorStop(0, color['Other']);
                        // } else {
                            gradient.addColorStop(0, color[placemark[i].userProperties[category]]);
                        // }

                        ctx.beginPath();
                        ctx.arc(radius, radius, radius, 0, Math.PI * 2, true);

                        ctx.fillStyle = gradient;
                        ctx.fill();
                        // ctx.strokeStyle = "rgb(255, 255, 255)";
                        // ctx.stroke();

                        ctx.closePath();

                        placemark[i].attributes.imageSource.image = circle;
                        placemark[i].updateImage = true;

                        // if (i === placemark.length - 1) {
                        //     // console.log("B");
                        //     // console.log(placemark);
                        //     // console.log(wwd.layers);
                        // }
                    }






                    $.ajax({
                        url: '/mrdsData',
                        type: 'GET',
                        dataType: 'json',
                        // data: data,
                        async: false,
                        success: function (resp) {
                            if (!resp.error) {
                                var data = [];
                                // var layerNames = [];
                                // var placemarkLayers = [];

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
                                // console.log(new Date());

                                // var placemarkLayer = new WorldWind.RenderableLayer("USWTDB");

                                // console.log(wwd.goToAnimator);

                                for (var i = 0; i < resp.data.length; i++) {
                                    data[i] = new WorldWind.IntensityLocation(resp.data[i].latitude, resp.data[i].longitude, 1);

                                    var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
                                    placemarkAttributes.imageSource = new WorldWind.ImageSource(circle);
                                    placemarkAttributes.imageScale = 0.5;

                                    var highlightAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
                                    highlightAttributes.imageScale = 2.0;

                                    var placemarkPosition = new WorldWind.Position(resp.data[i].latitude, resp.data[i].longitude, 0);
                                    placemark[i] = new WorldWind.Placemark(placemarkPosition, false, placemarkAttributes);
                                    placemark[i].altitudeMode = WorldWind.RELATIVE_TO_GROUND;
                                    placemark[i].highlightAttributes = highlightAttributes;

                                    placemark[i].userProperties.site_name = resp.data[i].site_name;
                                    placemark[i].userProperties.dev_stat = resp.data[i].dev_stat;
                                    placemark[i].userProperties.commodity = resp.data[i].commod1.split(",")[0];



                                    var placemarkLayer = new WorldWind.RenderableLayer(resp.data[i].mrds_id);
                                    placemarkLayer.addRenderable(placemark[i]);
                                    wwd.addLayer(placemarkLayer);


                                }
                            }
                        }
                    });

                function handleMouseMove(o) {

                    if ($("#popover").is(":visible")) {
                        $("#popover").hide();
                    }

                    // The input argument is either an Event or a TapRecognizer. Both have the same properties for determining
                    // the mouse or tap location.
                    var x = o.clientX,
                        y = o.clientY;

                    // Perform the pick. Must first convert from window coordinates to canvas coordinates, which are
                    // relative to the upper left corner of the canvas rather than the upper left corner of the page.

                    var pickList = wwd.pick(wwd.canvasCoordinates(x, y));
                    // console.log(pickList.objects);
                    for (var q = 0; q < pickList.objects.length; q++) {
                        var pickedPL = pickList.objects[q].userObject;
                        // console.log(pickedPL);
                        if (pickedPL instanceof WorldWind.Placemark) {
                            // console.log("A");

                            var xOffset = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
                            var yOffset = Math.max(document.documentElement.scrollTop, document.body.scrollTop);

                            var popover = document.getElementById('popover');
                            popover.style.position = "absolute";
                            popover.style.left = (x + xOffset - 3) + 'px';
                            popover.style.top = (y + yOffset - 3) + 'px';

                            var content = "<p><strong>Site Name:</strong> " + pickedPL.userProperties.site_name +
                                "<br>" + "<strong>Commodity:</strong> " + pickedPL.userProperties.commodity +
                                "<br>" + "<strong>Development Status:</strong> " + pickedPL.userProperties.dev_stat + "</p>";

                            $("#popover").attr('data-content', content);
                            $("#popover").show();
                        }
                    }

                    pickList = [];
                }

                    // Listen for mouse moves and highlight the placemarks that the cursor rolls over.
                    wwd.addEventListener("mousemove", handleMouseMove);
                    $("#popover").popover({html: true, placement: "top", trigger: "hover"});



            })
        });
    });
