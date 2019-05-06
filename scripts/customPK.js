define(['../src/WorldWind'],function (WorldWind) {
    let customPK = function (color, lat, long) {
        // wrap up placemark image source
        let canvas = document.createElement("canvas"),
            ctx = canvas.getContext('2d'),
            radius = 10, innerR = 10, outerR = 10, gradient;

        canvas.width = canvas.height = radius * 3;

        if (Array.isArray(color)) {
            console.log("Array");
            innerR = 5;
            outerR = 12;
            gradient = ctx.createRadialGradient(radius, radius, innerR, radius, radius, outerR);
            gradient.addColorStop(0, color[0]);
            gradient.addColorStop(0.5, color[1]);
            gradient.addColorStop(1, color[2]);
        } else {
            console.log("Not an array");
            gradient = ctx.createRadialGradient(radius, radius, innerR, radius, radius, outerR);
            gradient.addColorStop(0, color);
        }

        ctx.beginPath();
        ctx.arc(radius, radius, outerR, 0, Math.PI * 2, true);

        ctx.fillStyle = gradient;
        ctx.fill();
        // ctx.strokeStyle = "rgb(255, 255, 255)";
        // ctx.stroke();

        ctx.closePath();

        // wrap up World Wind Placemark object
        let placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
        placemarkAttributes.imageSource = new WorldWind.ImageSource(canvas);
        placemarkAttributes.imageScale = 0.75; //placemark size!

        let highlightAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
        highlightAttributes.imageScale = 1.5;

        let placemarkPosition = new WorldWind.Position(lat, long, 0);

        this.placemark = new WorldWind.Placemark(placemarkPosition, true, placemarkAttributes);
        this.placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
        this.placemark.attributes = placemarkAttributes;
        this.placemark.highlightAttributes = highlightAttributes;
    };

    return customPK
});