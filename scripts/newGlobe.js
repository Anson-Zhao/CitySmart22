// exports the globe to at top-level

define(['./WorldWindShim'],function (WorldWind) {
    "use strict";
    // Load Globe
    let globe = new WorldWind.WorldWindow('canvasOne');

    let layers = [
        // {layer: new WorldWind.BMNGLayer(), enabled: true},
        // {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
        {layer: new WorldWind.BingAerialLayer(), enabled: false},
        {layer: new WorldWind.BingAerialWithLabelsLayer(), enabled: true},
        {layer: new WorldWind.BingRoadsLayer(), enabled: false},
        {layer: new WorldWind.CompassLayer(), enabled: true},
        {layer: new WorldWind.CoordinatesDisplayLayer(globe), enabled: true},
        {layer: new WorldWind.ViewControlsLayer(globe), enabled: true}
    ];

    for (let l = 0; l < layers.length; l++) {
        layers[l].layer.enabled = layers[l].enabled;
        globe.addLayer(layers[l].layer);
    }

    //Tell wouldwind to log only warnings and errors.
    WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

    return globe
});