/*
 * @Author: snail 
 * @Date: 2019-02-28 14:45:23 
 * @Last Modified by: snail
 * @Last Modified time: 2019-02-28 17:51:41
 */
var viewer = null;
var pageOper = {
    
}
var initPage = {
    initGis: function () {
        viewer = new Cesium.Viewer('cesiumContainer', {
            infoBox: false,
            selectionIndicator: false,
            shadows: false,
            shouldAnimate: true,
            baseLayerPicker: false, //关闭选择地图
        })

        viewer.imageryLayers.remove(viewer.imageryLayers.get(0));
        viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
            url: 'http://www.google.cn/maps/vt?lyrs=s&x={x}&y={y}&z={z}',
            tillingScheme: new Cesium.WebMercatorTilingScheme()
        }))
    },
    
}


window.onload = function () {
    initPage.initGis();
}