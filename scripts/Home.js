/*
* Copyright 2015-2017 WorldWind Contributors
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

requirejs([
        './newGlobe',
        './AutoMenu',
        './CS_wmsLayer',
        './OptionList'
        ],
    function (
        newGlobe
    ) {
        "use strict";

        newGlobe.redraw;

        newGlobe.goTo(new WorldWind.Position(37.0902, -95.7129, 9000000));

        let layers = newGlobe.layers;
        let bob=[];
        let checked = []; //selected toggle switch value
        let alertVal = true;
        let LayerSelected;
        let arrMenu = [];
        let checkedCount=0;
        let j = 0;
        let Altitude;
        let allCheckedArray=[];
        let nextL = $(".next");
        let previousL = $("#previousL");
        let currentSelectedLayer = $("#currentSelectedLayer");
        let infobox;

        function Placemark_Creation (RGB,PKValue, coLat, coLong, LayerName) {
            let placemark;
            let highlightAttributes;
            let placemarkLayer = new WorldWind.RenderableLayer(LayerName);
            let placemarkAttributes = new WorldWind.PlacemarkAttributes(null);

            // Create the custom image for the placemark.
            let canvas = document.createElement("canvas"),
                ctx2d = canvas.getContext("2d"),
                size = 60, c = size / 2, innerRadius = 12, outerRadius = 20;

            canvas.width = size;
            canvas.height = size;
            //This is the color of the placeholder and appearance (Most likely)

            let gradient = ctx2d.createRadialGradient(c, c, innerRadius, c, c, outerRadius);
            gradient.addColorStop(0, RGB[0]);
            gradient.addColorStop(0.5, RGB[1]);
            gradient.addColorStop(1, RGB[2]);


            ctx2d.fillStyle = gradient;
            ctx2d.arc(c, c, outerRadius, 0, 2 * Math.PI, false);
            ctx2d.fill();

            // Set up the common placemark attributes.
            placemarkAttributes.imageScale = 0.75; //placemark size!
            placemarkAttributes.imageOffset = new WorldWind.Offset(
                WorldWind.OFFSET_FRACTION, 0.5,
                WorldWind.OFFSET_FRACTION, 0.5);
            placemarkAttributes.imageColor = WorldWind.Color.WHITE;

            placemark = new WorldWind.Placemark(new WorldWind.Position(coLat, coLong, 1e2), true, null);

            placemark.displayName = LayerName;
            //     + "Lat " + placemark.position.latitude.toPrecision(4).toString() + "\n"
            //     + "Lon " + placemark.position.longitude.toPrecision(5).toString();
            placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;

            // Create the placemark attributes for this placemark. Note that the attributes differ only by their
            // image URL.
            placemarkAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
            placemarkAttributes.imageSource = new WorldWind.ImageSource(canvas);
            placemark.attributes = placemarkAttributes;

            // Create the highlight attributes for this placemark. Note that the normal attributes are specified as
            // the default highlight attributes so that all properties are identical except the image scale.
            highlightAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
            highlightAttributes.imageScale = 1.2;
            placemark.highlightAttributes = highlightAttributes;
            placemark.primarykeyAttributes = PKValue;

            // Add the placemark to the layer.
            placemarkLayer.addRenderable(placemark);
            placemarkLayer.enabled = false;
            newGlobe.addLayer(placemarkLayer);
        }

        function handleMouseCLK (a)   {
            let x = a.clientX,
                y = a.clientY;
            let pickListCLK = newGlobe.pick(newGlobe.canvasCoordinates(x, y));
            for (let m = 0; m < pickListCLK.objects.length; m++) {

                let pickedPM = pickListCLK.objects[m].userObject;
                if (pickedPM instanceof WorldWind.Placemark) {
                    sitePopUp(pickListCLK.objects[m].userObject.primarykeyAttributes);
                }
            }
        }

        function sitePopUp (PKValue) {
            let popupBodyItem = $("#popupBody");
            let c = PKValue;

            for (let k = 0, lengths = infobox.length; k < lengths; k++) {
                if (infobox[k].PK === c) {
                    popupBodyItem.children().remove();

                    let popupBodyName = $('<p class="site-name"><h4>' + infobox[k].LayerName + '</h4></p>');
                    let popupBodyDesc = $('<p class="site-description">' + infobox[k].Site_Description + '</p><br>');
                    let fillerImages = $('<img style="width:100%; height:110%;" src="../images/Pics/' + infobox[k].Picture_Location + '"/>');
                    let imageLinks = $('<p class="site-link" <h6>Site Link: </h6></p><a href="' + infobox[k].Link_to_site_location + '">Click here to navigate to the site&#8217;s website </a>');
                    let copyrightStatus = $('<p  class="copyright" <h6>Copyright Status: </h6>' + infobox[k].Copyright + '</p><br>');
                    let coordinates = $('<p class="coordinate" <h6>Latitude and Longitude: </h6>'+ infobox[k].Latitude + infobox[k].Longitude + '</p><br>');

                    popupBodyItem.append(popupBodyName);
                    popupBodyItem.append(popupBodyDesc);
                    popupBodyItem.append(fillerImages);
                    popupBodyItem.append(imageLinks);
                    popupBodyItem.append(copyrightStatus);
                    popupBodyItem.append(coordinates);
                    break
                }
            }

            let modal = document.getElementById('popupBox');
            let span = document.getElementById('closeIt');

            modal.style.display = "block";

            span.onclick = function () {
                modal.style.display = "none";

                window.onclick = function (event) {
                    if (event.target === modal) {
                        modal.style.display = "none";
                    }
                }
            }
        }

        function globlePosition (layerRequest){
            $.ajax({
                url: '/position',
                type: 'GET',
                dataType: 'json',
                data: layerRequest, //send the most current value of the selected switch to server-side
                async: false,
                success: function (results) {
                    LayerSelected = results[0];//the first object of an array --- Longitude: " ", Latitude: "", Altitude: "", ThirdLayer: "", LayerName: ""console.log(LayerSelected);
                    Altitude = LayerSelected.Altitude * 1000;
                    newGlobe.goTo(new WorldWind.Position(LayerSelected.Latitude, LayerSelected.Longitude, Altitude));
                }
            })
        }

        function buttonControl (allCheckedArray,layer1){
            if (alertVal){
                confirm("Some layers may take awhile to load. Please be patient.")
            }

            if (allCheckedArray.length > checkedCount){ //if there is new array was inserted into the allCheckedArray ( If user choose more than 1 switch)
                checked.push(layer1); //insert current value to "checked" array
                checkedCount = allCheckedArray.length; //checkedCount now equals to the numbers of arrays that were inserted to allCheckedArray
                alertVal = false; //alert (only appear at the first time)
                currentSelectedLayer.prop('value', LayerSelected.ThirdLayer); //if there are new array was inserted into the allCheckedArray,the value of the opened layer button equals to the name of the switch that user selected
                arrMenu.push(LayerSelected.ThirdLayer);

                //insert current ThirdLayer value to arrMenu
                j = arrMenu.length - 1; //count
                if(arrMenu.length === 1){ //if the length of arrMenu is equal to 1 /if user only checks one switch.
                    nextL.prop('disabled',true);
                    previousL.prop('disabled',true);
                    currentSelectedLayer.prop('disabled',false);
                }else{//if user checks over 1 switch
                    previousL.prop('disabled',false);
                    nextL.prop('disabled',true);
                }
                // LayerPosition.push(LayerSelected);
            } else { //if there is not new array was inserted into the allCheckedArray / If user un-checks a switch)
                for( let i = 0 ; i < checked.length; i++) {
                    if (checked[i] === layer1) {
                        checked.splice(i,1); //remove current value from checked array
                        arrMenu.splice(i,1); //remove current ThirdLayer from the array
                        // LayerPosition.splice(i,1); //remove current Latlong from the array
                    }
                }
                // val = checked[checked.length - 1];
                checkedCount = allCheckedArray.length;
                alertVal = false;
                currentSelectedLayer.prop('value',arrMenu[arrMenu.length - 1]);
                // currentSelectedLayer.prop('value',arrMenu[j]);
                // currentSelectedLayer.value = arrMenu[arrMenu.length - 1];
                j = arrMenu.length - 1;
                if(arrMenu.length === 1){
                    nextL.prop('disabled',true);
                    previousL.prop('disabled',true)
                }else{
                    if(arrMenu.length === 0){
                        // currentSelectedLayer.value = "No Layer Selected";
                        currentSelectedLayer.prop('value','No Layer Selected');
                        currentSelectedLayer.prop('disabled',true);
                        previousL.prop('disabled',true);
                        nextL.prop('disabled',true);
                        // newGlobe.goTo(new WorldWind.Position(37.0902, -95.7129, 9000000));
                    } else{
                        previousL.prop('disabled',false);
                        nextL.prop('disabled',true);
                    }
                }
            }

        }

        //preload function
        $(document).ready(function () {
            //preload placemark
            $.ajax({
                url: '/placemark',
                dataType: 'json',
                success: function(result) {
                    if (!result.err) {
                        infobox = result.data;
                        for (let k = 0; k < infobox.length; k++) {

                            let colorAttribute = infobox[k].Color;
                            let cAtwo = colorAttribute.split(" ");
                            let coLat = infobox[k].Latitude;
                            let coLong = infobox[k].Longitude;
                            let PK = infobox[k].PK;
                            let LayerName = infobox[k].LayerName;

                            Placemark_Creation(cAtwo, PK, coLat, coLong, LayerName);
                        }
                    }
                }
            });

            //the beginning value of the button
            currentSelectedLayer.prop('value','No Layer Selected');
            nextL.prop('disabled',true);
            previousL.prop('disabled',true);

            $(".wmsLayer, .placemarkLayer, .heatmapLayer").click(function () {
                let layer1 = $(this).val(); //the most current value of the selected switch
                allCheckedArray = $(':checkbox:checked');

                let layerRequest = 'layername=' + layer1;
                globlePosition(layerRequest);
                buttonControl(allCheckedArray,layer1);


                //turn on/off wmsLayer and placemark layer
                for (let a = 0; a < layers.length; a++) {
                    $(':checkbox:checked').each(function () {
                        if (layers[a].displayName === $(this).val()) {
                            layers[a].enabled = true;
                        } else {
                            bob = $(this).val().split(",");
                            bob.forEach(function (eleValue) {
                                if (layers[a].displayName === eleValue) {
                                    layers[a].enabled = true;
                                }
                            });
                        }
                    });
                    $(':checkbox:not(:checked)').each(function () {
                        if (layers[a].displayName === $(this).val()) {
                            layers[a].enabled = false;
                        } else {
                            bob = $(this).val().split(",");
                            bob.forEach(function (ery) {
                                if (layers[a].displayName === ery) {
                                    layers[a].enabled = false;
                                }
                            });
                        }
                    })
                }
            });

            $('#previousL').click(function(){
                nextL.prop('disabled',false);
                if(j < 1){ //if there was only one switch was checked
                    previousL.prop('disabled',true) //
                }else{//if there was more than one switch was checked
                    j = j - 1;
                    currentSelectedLayer.prop('value',arrMenu[j]); //value of currentSelectedLayer changes to the previous one

                    if (j === 0){
                        previousL.prop('disabled',true);// if there is no previous layer ,then the button would be disabled
                    }
                }
            });

            $('#nextL').click(function(){
                if(j !== arrMenu.length - 1){ // if there is not only one switch was selected
                    if(j === arrMenu.length - 2){
                        nextL.prop('disabled',true);
                    }
                    j = j + 1;
                    previousL.prop('disabled',false);
                    currentSelectedLayer.prop('value',arrMenu[j]);
                }
            });

            //if the opened layer was clicked, the layer shows
            $('#currentSelectedLayer').click(function(){
                // $('.collapse').collapse('hide');
                // let a = document.getElementById("accordion").children; //eight layer menus

                let currentSelectedLayerData = "thirdlayer=" + arrMenu[j];
                $.ajax({
                    url: '/currentLayer',
                    type: 'GET',
                    dataType: 'json',
                    data:currentSelectedLayerData,
                    async: false,
                    success: function (results) {
                        let FirstLayerId = '#' + results[0].FirstLayer;
                        let SecondLayerId = '#' + results[0].FirstLayer + '-' + results[0].SecondLayer;

                        newGlobe.goTo(new WorldWind.Position(results[0].Latitude, results[0].Longitude, results[0].Altitude * 1000));

                        $(FirstLayerId).collapse('show');
                        $(SecondLayerId).collapse('show');

                    }
                });
            });

            $('#globeOrigin').click(function(){
                newGlobe.goTo(new WorldWind.Position(37.0902, -95.7129, 9000000));
            });

            newGlobe.addEventListener("click", handleMouseCLK);
        });
    });
