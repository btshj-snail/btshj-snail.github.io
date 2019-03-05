/*
 * @Author: snail 
 * @Date: 2019-02-27 16:28:43 
 * @Last Modified by: snail
 * @Last Modified time: 2019-03-05 09:40:54
 * 这是一篇使用cesium加载模型的文件
 */
var viewer = null,entity=null;
var pathAry = [[104.0671,30.53813],[104.0671,30.5384],[104.06707,30.53943],[104.06703,30.54041],[104.06693,30.54341],[104.0669,30.54489],[104.06329,30.54489],[104.06086,30.54489],[104.06076,30.5449],[104.06032,30.5443],[104.05948,30.54322],[104.05906,30.54263],
[104.05906,30.54263],[104.05881,30.54217],[104.05842,30.54138],[104.05804,30.54056],[104.05801,30.54036],[104.06033,30.54037],[104.06089,30.54012],[104.06198,30.53944],[104.06295,30.53877],
[104.06431,30.53799],[104.06588,30.53798],[104.06682,30.53806]]
var currentPath = 0;
var pageOper = {
    startAnim:function(){
        if(!entity) return ;
        viewer.clock.shouldAnimate = true;
        if(currentPath>pathAry.length-1){
            currentPath = 0;
        }
        var point = pathAry[currentPath];
        entity.position = Cesium.Cartesian3.fromDegrees(point[0],point[1],0);
        currentPath++;
        requestAnimationFrame(pageOper.startAnim);
        
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
        setInterval(function(){
            if(currentPath>pathAry.length-1){
                currentPath = 0;
            }
            var point = pathAry[currentPath];
            currentPath++;
            entity.position = Cesium.Cartesian3.fromDegrees(point[0],point[1],0)
        },1000)
        // pageOper.startAnim();
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
    },
    initSelect: function () {
        var options = [
            {
                text: 'Milk Truck',
                onselect: function () {
                    pageOper.createModel('../data/models/CesiumMilkTruck/CesiumMilkTruck-kmc.glb', 0);
                }
            },
            {
                text: 'Aircraft',
                onselect: function () {
                    pageOper.createModel('../data/models/CesiumAir/Cesium_Air.glb', 5000)
                }
            },
            {
                text: 'Ground Vehicle',
                onselect: function () {
                    pageOper.createModel('../data/models/GroundVehicle/GroundVehicle.glb', 0);
                }
            },
            {
                text: 'Hot Air Balloon',
                onselect: function () {
                    pageOper.createModel('../data/models/CesiumBalloon/CesiumBalloon.glb', 1000.0);
                }
            }, {
                text: 'Skinned Character',
                onselect: function () {
                    pageOper.createModel('../data/models/CesiumMan/Cesium_Man.glb', 0);
                }
            }, {
                text: 'Draco Compressed Model',
                onselect: function () {
                    pageOper.createModel('../data/models/DracoCompressed/CesiumMilkTruck.gltf', 0);
                }
            }
        ]
        var select = document.getElementById("toolbarSelect");
        // Sandcastle.addToolbarMenu(options);
        for (var i = 0, l = options.length; i < l; i++) {

            var opt = document.createElement("option")
            opt.value = options[i].text;
            opt.text = options[i].text;
            opt.dataset.changeFun = options[i].onSelect;
            select.appendChild(opt);
        }
        select.firstChild && (select.firstChild.selected = "selected");
        options[0].onselect();
        select.onchange = function () {
            var opt = options.find(function (item) {
                return item.text === select.value;
            })
            if (opt) {
                opt.onselect();
            }
        }

    }
}


window.onload = function () {
    initPage.initGis();
    initPage.initSelect();
}