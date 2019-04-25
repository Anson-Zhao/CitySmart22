//get the data from database with certain conditions

// function unpack(rows, key) {
//     return rows.map(function(row) { return row[key]; })
// }

$(document).ready(function () {
    //Main Menu creating starts here
    let parentMenu = document.getElementById("accordion");
    let firstLayer =[];
    let secondRes=[];
    //get data from database table using routes(ajax)
    $.ajax({
        type: "GET",
        url: "/firstLayer",
        dataType: "json",
        // sync:true,
        async:false,
        success: function (res) {
            // draw the first layer
            firstLayer = res;
            for( let i =0; i <firstLayer.length; i++){

                let firstlayerValue = "FirstLayer=" + res[i].FirstLayer; // A condition used to draw the second layer
                let paneldefault1 = document.createElement("div");
                paneldefault1.className = "Menu panel panel-info " + firstLayer[i].FirstLayer;

                let panelheading1 = document.createElement("div");
                panelheading1.className = "panel-heading";

                let paneltitle1 = document.createElement("h4");
                paneltitle1.className = "panel-title";

                let collapsed1 = document.createElement("a");
                collapsed1.className = "collapsed";
                collapsed1.setAttribute("data-toggle", "collapse");
                collapsed1.setAttribute("data-parent", "#accordion");
                // collapsed1.href = "#collapse" + i;
                collapsed1.href = "#" + firstLayer[i].FirstLayer;

                let firstlayername = document.createTextNode(firstLayer[i].FirstLayer + "  ");
                firstlayername.className = "menuwords";
                let collapseone = document.createElement("div");
                collapseone.className = "panel-collapse collapse";
                // collapseone.id = "collapse" + i;
                collapseone.id = firstLayer[i].FirstLayer;

                let panelbody1 = document.createElement("div");
                panelbody1.className = "panel-body";
                let panelgroup1 = document.createElement("div");
                panelgroup1.className = "panel-group " + firstLayer[i].FirstLayer;
                panelgroup1.id = "nested" + i;

                collapsed1.appendChild(firstlayername);
                paneltitle1.appendChild(collapsed1);
                collapseone.appendChild(panelbody1);
                panelbody1.appendChild(panelgroup1);
                panelheading1.appendChild(paneltitle1);
                paneldefault1.appendChild(panelheading1);
                parentMenu.appendChild(paneldefault1);
                paneldefault1.appendChild(collapseone);

//---------------------------second layer starts here-------------------------------------
                //draw second layer using base on the first layer
                $.ajax({
                    type: "GET",
                    url: "/secondLayer",
                    dataType: "json",
                    data:firstlayerValue,
                    // async:true,
                    async: false,
                    success: function (res2) {
                        // console.log(res2);
                        for (let a = 0; a < res2.length; a++) {
                            // let secondResStr = res2[a] +'';
                            // console.log(res2[a]);
                            secondRes.push(res2[a].SecondLayer);

                            let paneldefault2 = document.createElement("div");

                            paneldefault2.id = res2[a].SecondLayer;
                            paneldefault2.className = "Menu panel panel-info " + res2[a].SecondLayer;
                            // console.log(res2[j].SecondLayer);
                            // console.log(paneldefault2);
                            let panelheading2 = document.createElement("div");
                            panelheading2.className = "panel-heading " + res2[a].FirstLayer + "-" + res2[a].SecondLayer;
                            // console.log(res2[j].FirstLayer);
                            // console.log(res2[j].SecondLayer);
                            let paneltitle2 = document.createElement("h4");
                            paneltitle2.className = "panel-title " + res2[a].FirstLayer + "-" + res2[a].SecondLayer;
                            // console.log(paneltitle2);
                            let collapsed2 = document.createElement("a");
                            collapsed2.className = "collapsed";
                            // collapsed2.id = res[i].FirstLayer + "-" + res[i].SecondLayer;
                            collapsed2.setAttribute("data-toggle", "collapse");
                            collapsed2.setAttribute("data-parent", "#nested");
                            collapsed2.href = "#" + res2[a].FirstLayer + "-" + res2[a].SecondLayer;
                            let secondlayername = document.createTextNode(res2[a].SecondLayer + "  ");
                            secondlayername.className = "menuwords";
                            let nested1c1 = document.createElement("div");
                            nested1c1.id = res2[a].FirstLayer + "-" + res2[a].SecondLayer;
                            nested1c1.className = "panel-collapse collapse";
                            let panelbody3 = document.createElement("div");
                            panelbody3.className = "panel-body " + res2[a].SecondLayer;

                            paneldefault2.appendChild(panelheading2);
                            panelheading2.appendChild(paneltitle2);
                            paneldefault2.appendChild(nested1c1);
                            nested1c1.appendChild(panelbody3);
                            collapsed2.appendChild(secondlayername);
                            paneltitle2.appendChild(collapsed2);
                            // console.log(paneldefault2);

                            document.getElementsByClassName("panel-group " + res2[a].FirstLayer)[0].appendChild(paneldefault2);
                        }
                    }
                });
            }
        }
    });

    for(let k =0; k < secondRes.length; k++ ) {
        let secondLayerValue = "SecondLayer=" + secondRes[k];
        $.ajax({
            type: "GET",
            url: "/thirdLayer",
            dataType: "json",
            data: secondLayerValue,
            async: false,
            success: function (res3) {
                // console.log(res3);
                // for(let i = 0 ; i <res3.length; i++){
                //     console.log(res3[i].LayerName);
                //     console.log(res3[i].ThirdLayer);
                // }
                for (let i = 0; i < res3.length; i++) {


                    if (res3[i].LayerType === 'Wmslayer') {
                        let thelayertype = 'wmsLayer';
                    } else if (res3[i].LayerType === 'PlacemarkLayer'){
                        let thelayertype = 'placemarkLayer';
                    } else if (res3[i].LayerType === 'HeatmapLayer'){
                        let thelayertype = 'heatmapLayer';
                    }

                    let Thirdreplace = res3[i].ThirdLayer.replace(/\s+/g, '');
                    let countrynamestr = res3[i].CountryName.replace(/\s+/g, '');
                    let statenamestr = res3[i].StateName.replace(/\s+/g, '');
                    let citynamestr = res3[i].CityName.replace(/\s+/g, '');
                    // console.log(res3[i].ThirdLayer);

                    let checkboxdiv = document.createElement("div");
                    checkboxdiv.className = "State " + Thirdreplace + " " + countrynamestr + statenamestr + citynamestr;
                    // checkboxdiv.className = "State " + res3[i].ThirdLayer + " " + countrynamestr + statenamestr + continentnamestr;
                    let checkboxh5 = document.createElement("h5");
                    let checkboxa = document.createElement("a");
                    let checkaboxat = document.createTextNode(res3[i].ThirdLayer + "   ");
                    let checkboxlabel = document.createElement("label");
                    checkboxlabel.className = "switch right";
                    let checkboxinput = document.createElement("input");
                    checkboxinput.type = "checkbox";
                    // checkboxinput.id = res3[i].LayerType;
                    // console.log(res3[i].ThirdLayer);
                    checkboxinput.className = thelayertype + " input " + Thirdreplace;
                    checkboxinput.setAttribute("value", res3[i].LayerName);
                    let checkboxspan = document.createElement("span");
                    checkboxspan.className = "slider round";

                    checkboxdiv.appendChild(checkboxh5);
                    checkboxa.appendChild(checkaboxat);
                    checkboxh5.appendChild(checkboxa);
                    checkboxh5.appendChild(checkboxlabel);
                    checkboxlabel.appendChild(checkboxinput);
                    checkboxlabel.appendChild(checkboxspan);

                    document.getElementsByClassName("panel-body " + res3[i].SecondLayer)[0].appendChild(checkboxdiv);

                }
            }

        })
    }
});
