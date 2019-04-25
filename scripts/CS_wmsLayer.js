
requirejs([
        './newGlobe',
        '../3rdPartyLibs/domReady',
        '../config/mainconf'
    ],
    function (
        newGlobe,
        domReady
    ) {
        "use strict";

        // Web Map Service information from NASA's Near Earth Observations WMS
        let serviceAddress = config.Download_To;
        let preloadWmsLayers = [];//preload entire layer name
        // let preloadLayer = [];
        
        function createWMSLayer (xmlDom) {

            // Create a WmsCapabilities object from the XML DOM
            let wms = new WorldWind.WmsCapabilities(xmlDom);

            // Retrieve a WmsLayerCapabilities object by the desired layer name

            $(".wmsLayer").each(function (i) {

                preloadWmsLayers[i] = $(this).val();

                if (!preloadWmsLayers[i]) return true;
                let wmsLayerCapability = wms.getNamedLayer(preloadWmsLayers[i]);

                // Form a configuration object from the wmsLayerCapability object
                if (!wmsLayerCapability) return true;
                let wmsConfig = WorldWind.WmsLayer.formLayerConfiguration(wmsLayerCapability);

                // Modify the configuration objects title property to a more user friendly title
                if (!wmsLayerCapability) return true;
                wmsConfig.title = preloadWmsLayers[i];

                // Create the WMS Layer from the configuration object
                let wmsLayer = new WorldWind.WmsLayer(wmsConfig);
                wmsLayer.enabled = false;

                // Add the layers to WorldWind and update the layer manager
                newGlobe.addLayer(wmsLayer);

            });
        }

        // Called if an error occurs during WMS Capabilities document retrieval
        function logError (jqXhr, text, exception) {
            console.log("There was a failure retrieving the capabilities document: " + text + " exception: " + exception);
        }

        domReady(function() {

            // let preloadLayerStr = preloadLayer + '';//change preloadLayer into a string
            // preloadWmsLayers = preloadLayerStr.split(",");//split preloadLayerStr with ","

            //preload wmsLayer
            $.get(serviceAddress).done(createWMSLayer).fail(logError);// get the xml file of wmslayer and pass the file into  createLayer function.

        });

    });
