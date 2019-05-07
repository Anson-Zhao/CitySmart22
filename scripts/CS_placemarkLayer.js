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
    './customPK'
], function (newGlobe, customPK) {

    "use strict";

    // create Placemark Layers base on the LayerName column in LayerMenu table
    $.ajax({
        url: '/allLayerMenu',
        type: 'GET',
        dataType: 'json',
        async: false,
        success: function (resp) {
            // console.log(resp);
            if (!resp.error) {
                resp.data.forEach(function (ele) {

                    if (ele.LayerType === 'CS_PKLayer') {
                        // create cs placemark
                        let color = ele.Color.split(" ");
                        let csPK = new customPK(color, ele.Latitude, ele.Longitude);
                        csPK.placemark.userProperties.layerType = ele.LayerType;
                        csPK.placemark.userProperties.layerName = ele.LayerName;
                        csPK.placemark.userProperties.siteDesc = ele.Site_Description;
                        csPK.placemark.userProperties.picLocation = ele.Picture_Location;
                        csPK.placemark.userProperties.url = ele.Link_to_site_location;
                        csPK.placemark.userProperties.copyright = ele.Copyright;

                        // create cs placemark layer obj
                        let csPKLayer = new WorldWind.RenderableLayer(ele.LayerName);

                        //add placemark onto placemark layer
                        csPKLayer.addRenderable(csPK.placemark);

                        // add placemark layer onto worldwind layer obj
                        csPKLayer.enabled = false;
                        newGlobe.addLayer(csPKLayer);
                    }
                })
            } else {
                alert(resp.error)
            }
        }
    });

    function handleMouseCLK (e)   {
        let x = e.clientX,
            y = e.clientY;
        let pickListCLK = newGlobe.pick(newGlobe.canvasCoordinates(x, y));

        pickListCLK.objects.forEach(function (value) {
            let pickedPM = value.userObject;
            if (pickedPM instanceof WorldWind.Placemark && pickedPM.userProperties.layerType === 'CS_PKLayer') {
                sitePopUp(pickedPM);
            }
        })
    }

    function sitePopUp (PM) {
        let popupBodyItem = $("#popupBody");
        popupBodyItem.children().remove();

        let popupBodyName = $('<p class="site-name"><h4>' + PM.userProperties.layerName + '</h4></p>');
        let popupBodyDesc = $('<p class="site-description">' + PM.userProperties.siteDesc + '</p><br>');
        let fillerImages = $('<img style="width:100%; height:110%;" src="../images/Pics/' + PM.userProperties.picLocation + '"/>');
        let imageLinks = $('<p class="site-link" <h6>Site Link: </h6></p><a href="' + PM.userProperties.url + '">Click here to navigate to the site&#8217;s website </a>');
        let copyrightStatus = $('<p  class="copyright" <h6>Copyright Status: </h6>' + PM.userProperties.copyright + '</p><br>');
        let coordinates = $('<p class="coordinate" <h6>Latitude and Longitude: </h6>'+ PM.position.latitude + PM.position.longitude + '</p><br>');

        popupBodyItem.append(popupBodyName);
        popupBodyItem.append(popupBodyDesc);
        popupBodyItem.append(fillerImages);
        popupBodyItem.append(imageLinks);
        popupBodyItem.append(copyrightStatus);
        popupBodyItem.append(coordinates);

        let modal = document.getElementById('popupBox');
        let span = document.getElementById('closeIt');

        modal.style.display = "block";

        span.onclick = function () {
            modal.style.display = "none";
        };

        window.onclick = function (event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        }
    }

    $(document).ready(function() {
        newGlobe.addEventListener("click", handleMouseCLK);
    });
});
