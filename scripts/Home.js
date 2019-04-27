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
        './OptionList',
        './CS_placemarkLayer',
        './mrds'
        ],
    function (
        newGlobe
    ) {
        // "use strict";

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
                            layers[a].setAttribute("id", layer[a].displayName);
                        } else {
                            bob = $(this).val().split(",");
                            bob.forEach(function (eleValue) {
                                if (layers[a].displayName === eleValue) {
                                    layers[a].enabled = true;
                                    layers[a].setAttribute("id", layer[a].displayName);
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
        });
    });
