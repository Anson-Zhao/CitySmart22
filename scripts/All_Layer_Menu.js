define(['../src/WorldWind'], function (WorldWind) {

    let arrWT = [];
    let arrMR = [];
    let arrCS = [];
    let categoryN = [];
    let arrColor = [];
    let category;

    $.ajax({
        url: '/allLayerMenu',
        type: 'GET',
        dataType: 'json',
        async: false,
        success: function (resp) {
            if (!resp.error) {
                resp.data.forEach(function (ele, i) {
                    if (ele.LayerType === 'USGSWT_PKLayer') {

                        category = ele.LayerName.split("_");
                        categoryN = category[2];

                        arrWT.push({Name: categoryN, Layer: new WorldWind.RenderableLayer(ele.LayerName)});

                    } else if (ele.LayerType === 'USGSMR_PKLayer') {

                        category = ele.LayerName.split("_");
                        categoryN = category[2];

                        arrMR.push({Name: categoryN, Layer: new WorldWind.RenderableLayer(ele.LayerName)});

                    } else if (ele.LayerType === 'CS_PKLayer') {

                        arrColor = ele.Color.split(" ");

                        arrCS.push({Row: ele, Layer: new WorldWind.RenderableLayer(ele.LayerName), Color: arrColor});

                    }
                })
            } else {
                alert(resp.error)
            }
        }
    });

    return {arrWT, arrMR, arrCS}
});