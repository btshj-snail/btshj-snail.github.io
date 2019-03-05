(function () {
    "use strict";
    // Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjMWI3NzY4Ny03YWZkLTQ2YTQtYjY0Mi05MDhmMmQ1Njg0ZTAiLCJpZCI6NzU3NCwic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU0OTg3MDQzM30.7vm7B3vgojBDg5zvr8tTE7uEvxq-eNSpkQqSDtCJ9Kk';
    var viewer = new Cesium.Viewer('cesiumContainer',{
        // terrainProvider:new Cesium.CesiumTerrainProvider({
        //     url:Cesium.IonResource.fromAssetId(3956)
        // }),
        scene3DOnly: true,
        selectionIndicator: false,
        baseLayerPicker: false,

    });

    //增加全球地形数据

    viewer.terrainProvider = Cesium.createWorldTerrain({
        requestWaterMask:true,
        requestVertexNormals:true,
    })
    // 打开深度检测，那么在地形以下的对象不可见
    viewer.scene.globe.depthTestAgainstTerrain = true;

     // 开启全球光照
    viewer.scene.globe.enableLighting = true;

    viewer.imageryLayers.remove(viewer.imageryLayers.get(0));
    viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
        url:'http://www.google.cn/maps/vt?lyrs=s&x={x}&y={y}&z={z}',
        tilingScheme:new Cesium.WebMercatorTilingScheme()
    }))

    var initialPosition = new Cesium.Cartesian3.fromDegrees(-73.998114468289017509, 40.674512895646692812, 2631.082799425431)
    var initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(7.1077496389876024807, -31.987223091598949054, 0.025883251314954971306);
    var homeCameraView = {
        destination:initialPosition,
        orientation:{
            heading:initialOrientation.heading,
            pitch:initialOrientation.pitch,
            roll:initialOrientation.roll
        }
    }
    homeCameraView.duration = 2.0;
    homeCameraView.maximumHeight = 2000;
    homeCameraView.pitchAdjustHeight = 2000;
    homeCameraView.endTransform = Cesium.Matrix4.IDENTITY;
    viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function(e){
        e.cancel = true;
        viewer.scene.camera.flyTo(homeCameraView)
    })
    viewer.scene.camera.setView(homeCameraView);
   
    // viewer.scene.camera.flyTo({
    //     destination: Cesium.Cartesian3.fromRadians(-2.6399828792482234, 1.0993550795541742, 5795),
    //     orientation: {
    //         heading: 3.8455,
    //         pitch: -0.4535,
    //         roll: 0.0
    //     }
    // })


    // 设置时钟和时间线
viewer.clock.shouldAnimate = true; // 当viewer开启后，启动动画
viewer.clock.startTime = Cesium.JulianDate.fromIso8601("2017-07-11T16:00:00Z");
viewer.clock.stopTime = Cesium.JulianDate.fromIso8601("2017-07-11T16:20:00Z");
viewer.clock.currentTime = Cesium.JulianDate.fromIso8601("2017-07-11T16:00:00Z");
viewer.clock.multiplier = 2; // 设置加速倍率
viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER; // tick computation mode(还没理解具体含义)
viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; // 循环播放
viewer.timeline.zoomTo(viewer.clock.startTime, viewer.clock.stopTime); // 设置时间的可见范围


var kmlOptions = {
    camera : viewer.scene.camera,
    canvas : viewer.scene.canvas,
    clampToGround : true
};
// 从这个KML的url里加载POI点位  : http://catalog.opendata.city/dataset/pediacities-nyc-neighborhoods/resource/91778048-3c58-449c-a3f9-365ed203e914
var geocachePromise = Cesium.KmlDataSource.load('./Source/SampleData/sampleGeocacheLocations.kml', kmlOptions);
geocachePromise.then(function(dataSource) {
   // 把所有entities添加到viewer中显示
   viewer.dataSources.add(dataSource);

   // 获得entity列表
   var geocacheEntities = dataSource.entities.values;

   for (var i = 0; i < geocacheEntities.length; i++) {
       var entity = geocacheEntities[i];
       if (Cesium.defined(entity.billboard)) {
           
        entity.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM; 
        entity.label = undefined; 
        entity.billboard.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(10.0, 20000.0);
        // 计算经度和纬度（角度表示）
        var cartographicPosition = Cesium.Cartographic.fromCartesian(entity.position.getValue(Cesium.JulianDate.now()));
        var longitude = Cesium.Math.toDegrees(cartographicPosition.longitude);
        var latitude = Cesium.Math.toDegrees(cartographicPosition.latitude);
        // 修改描述信息 
        var description = '<table class="cesium-infoBox-defaultTable cesium-infoBox-defaultTable-lighter"><tbody>' +
            '<tr><th>' + "经度" + '</th><td>' + longitude.toFixed(5) + '</td></tr>' +
            '<tr><th>' + "纬度" + '</th><td>' + latitude.toFixed(5) + '</td></tr>' +
            '</tbody></table>';
        entity.description = description;
    }
   }
});


// // 从CZML中载入无人机轨迹
// var dronePromise = Cesium.CzmlDataSource.load('./Source/SampleData/SampleFlight.czml');

// dronePromise.then(function(dataSource) {

//     viewer.dataSources.add(dataSource);
//     // 使用id获取在CZML 数据中定义的无人机entity
//    var drone = dataSource.entities.getById('Aircraft/Aircraft1');
//     //Attach a 3D model
//     drone.model = {
//         uri : './Source/SampleData/Models/CesiumDrone.gltf',
//         minimumPixelSize : 128,
//         maximumScale : 1000,
//         silhouetteColor : Cesium.Color.WHITE,
//         silhouetteSize : 2
//     };

//     // 基于无人机轨迹的位置点，自动计算朝向
//     drone.orientation = new Cesium.VelocityOrientationProperty(drone.position);
//     // 光滑的路径插值
//     drone.position.setInterpolationOptions({
//         interpolationDegree : 3,
//         interpolationAlgorithm : Cesium.HermitePolynomialApproximation
//     });
// });

    // Load the NYC buildings tileset
    var city = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({ url: Cesium.IonResource.fromAssetId(3839) }));

    // Adjust the tileset height so it's not floating above terrain
    var heightOffset = -32;
    city.readyPromise.then(function(tileset) {
        // Position tileset
        var boundingSphere = tileset.boundingSphere;
        var cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
        var surfacePosition = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
        var offsetPosition = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, heightOffset);
        var translation = Cesium.Cartesian3.subtract(offsetPosition, surfacePosition, new Cesium.Cartesian3());
        tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
    });

}());
