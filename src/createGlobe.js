define(['../scripts/WorldWindShim'],function (WorldWind) {
    let createGlobe = function (canvasID) {
        "use strict";
        // Load Globe
        this.wwd = new WorldWind.WorldWindow(canvasID);

        let layers = [
            // {layer: new WorldWind.BMNGLayer(), enabled: true},
            // {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
            {layer: new WorldWind.BingAerialLayer(), enabled: false},
            {layer: new WorldWind.BingAerialWithLabelsLayer(), enabled: true},
            {layer: new WorldWind.BingRoadsLayer(), enabled: false},
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(this.wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(this.wwd), enabled: true}
        ];

        for (let l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            this.wwd.addLayer(layers[l].layer);
        }

        //Tell wouldwind to log only warnings and errors.
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);
    };

    return createGlobe
});