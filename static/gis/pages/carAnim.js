/*
 * @Author: snail 
 * @Date: 2019-02-27 16:28:43 
 * @Last Modified by: snail
 * @Last Modified time: 2019-03-05 09:59:13
 * 这是一篇使用cesium加载模型的文件
 */
var viewer = null,
    entity = null;
    var czml = [{
        "id": "document",
        "name": "CZML Path",
        "version": "1.0",
        "clock": {
            "interval": "2012-08-04T10:00:00Z/2012-08-04T15:00:00Z",
            "currentTime": "2012-08-04T10:00:00Z",
            "multiplier": 10
        }
    },
    {
        "id": "path",
        "name": "path with GPS flight data",
        "description": "<p>Hang gliding flight log data from Daniel H. Friedman.<br>Icon created by Larisa Skosyrska from the Noun Project</p>",
        "availability": "2012-08-04T10:00:00Z/2012-08-04T15:00:00Z",
        "path": {
            "material": {
                "polylineOutline": {
                    "color": {
                        "rgba": [255, 0, 255, 255]
                    },
                    "outlineColor": {
                        "rgba": [0, 255, 255, 255]
                    },
                    "outlineWidth": 5
                }
            },
            "width": 8,
            "leadTime": 10,
            "trailTime": 1000,
            "resolution": 5
        },
        "billboard": {
            "image": "data:image/png;base64,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",
            "scale": 1.5,
            "eyeOffset": {
                "cartesian": [0.0, 0.0, -10.0]
            }
        },
        "position": {
            "epoch": "2012-08-04T10:00:00Z",
            "cartographicDegrees": [
                0, 104.0671, 30.53813, 0,
                10, 104.0671, 30.5384, 0,
                20, 104.06707, 30.53943, 0,
                30, 104.06703, 30.54041, 0,
                40, 104.06693, 30.54341, 0,
                50, 104.0669, 30.54489, 0,
                60, 104.06329, 30.54489, 0,
                70, 104.06086, 30.54489, 0,
                80, 104.06076, 30.5449, 0,
                90, 104.06032, 30.5443, 0,
                100, 104.05948, 30.54322, 0,
                110, 104.05906, 30.54263, 0,
                120, 104.05906, 30.54263, 0,
                130, 104.05881, 30.54217, 0,
                140, 104.05842, 30.54138, 0,
                150,104.05804, 30.54056, 0,
                160,104.05801, 30.54036, 0,
                170,104.06033, 30.54037, 0,
                180,104.06089, 30.54012, 0,
                190,104.06198, 30.53944, 0,
                200,104.06295, 30.53877, 0,
                210,104.06431, 30.53799, 0,
                220,104.06588, 30.53798, 0,
                230,104.06682, 30.53806, 0,
                
            ]
        }
    }
];
var pageOper = {
    startAnim: function () {
        viewer.dataSources.add(Cesium.CzmlDataSource.load(czml)).then(function (ds) {
            viewer.trackedEntity = ds.entities.getById('path');
        });

    },
    createModel: function (url, height) {
        viewer.entities.removeAll();

        var position = Cesium.Cartesian3.fromDegrees(104.066424, 30.540946, height); //通过经纬度 转换为 笛卡儿积表示的坐标位置...
        var heading = Cesium.Math.toRadians(135); //角度转弧度. heading就是航向的意思.右手水平方向为0度,顺时针旋转一周为360度.
        var pitch = 0; //纵倾
        var roll = 0; //横摇
        var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll); //以航向、纵倾和横摇表示的旋转。航向是围绕负Z轴的旋转。螺距是围绕负Y轴的旋转。滚动是围绕正X轴的旋转。
        var orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr); //从参考坐标系计算四元数，坐标轴是从以提供的原点为中心的航向俯仰滚转角度计算得出的。航向是从正角度向东增加的局部北向旋转。螺距是指从局部的东北面开始的旋转。正俯仰角在平面上方。负的螺距角在平面以下。滚动是围绕局部东轴应用的第一个旋转。
        entity = viewer.entities.add({
            name: url,
            position: position,
            orientation: orientation,
            model: {
                uri: url,
                minimumPixelSize: 128,
                maximumScale: 20000,
            }
        })
        entity.model.color = Cesium.Color.fromAlpha(Cesium.Color['RED'], 1)
        entity.model.silhouetteColor = Cesium.Color.fromAlpha(Cesium.Color['BLUE'], 1)
        entity.model.silhouetteSize = 1;
        viewer.trackedEntity = entity; //获取或设置摄像头当前正在跟踪的实体实例。
        pageOper.startAnim();
    }
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
        initPage.initCarModel();
    },
    initCarModel: function () {
        pageOper.createModel('../data/models/CesiumMilkTruck/CesiumMilkTruck-kmc.glb', 0);
    }

}


window.onload = function () {
    initPage.initGis();
    initPage.initCarModel();
}





