(function() {
    var Map = function() {
    	this.markers = [];
    	this.selectedRedMarkerIndex = 0;
    	this.redMarkerImageUrl =  'http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png';
    	this.defaultMarkerImageUrl =  'http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png';
    };

    Map.prototype.init = function(selector) {
        var aMap = new AMap.Map(selector, {
            resizeEnable: true
        });
        
        this.selectedRedMarker = this.createIcon('http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png');
        // 第一个大坑，aMap一定必须是全局变量，而不能是对象属性
        window.aMap = aMap;
    }

    // 查找 POI 信息
    Map.prototype.search = function(code) {
    	var that = this;

        AMap.service(["AMap.PlaceSearch"], function() {
            var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
                pageSize: 5,
                pageIndex: 1,
                city: "佛山", //城市
                map: aMap
            });
            // 关键字查询
            placeSearch.search('新华书店', function(status, result) {
                console.log(status, result);

                viewModel.pois.removeAll();
                result.poiList.pois.forEach(function(item) {
                    viewModel.pois.push(item);
                });
                viewModel.filterPois();
                viewModel.recreateMarkers(); 
            });
        });
    }

    // 清除地图上所有的marker
    Map.prototype.clearAllMarkers = function() {
    	aMap.clearMap();
    }

    // 被点击的poi 在地图上变红，前一个被点击的变为默认颜色
    Map.prototype.fastMarkChange = function(index) {
        this.updateMarkerWithIndex(this.selectedRedMarkerIndex, this.defaultMarkerImageUrl);
        this.updateMarkerWithIndex(index, this.redMarkerImageUrl);
        this.selectedRedMarkerIndex = index;

        // 重设地图中心
        this.resetMapCenter(this.markers[index].getPosition());
    }

    //  批量结果创建marker
    Map.prototype.createMarkers = function(pois) {
    	this.markers = [];
    	this.selectedRedMarkerIndex = 0;
        for (var i = 0; i < pois.length; i += 1) { 
        	this.markers.push(this.createMarker(pois[i],i));
        }
    }

    // 更新Marker的外观
    Map.prototype.updateMarkerWithIndex = function (index,url) {
    	this.updateMarker(this.markers[index], url);
    }

    // 更新markdown外观
    Map.prototype.updateMarker = function(marker,url) {
    	// 自定义点标记内容
        var markerContent = document.createElement("div");

    	// 点标记中的图标
        var markerImg = document.createElement("img");
        markerImg.className = "markerlnglat";
        markerImg.src = url;
        markerContent.appendChild(markerImg); 

        marker.setContent(markerContent); //更新点标记内容 
    }

    //  创建单个marker
    Map.prototype.createMarker = function(poi,i) {
        var marker = new AMap.Marker({
            position: [poi.location.lng, poi.location.lat],
            title: poi.name,
            extData: i
        });
        marker.setMap(aMap);

        // 绑定 click 事件
        marker.on('click', this.onMarkerClick.bind(this));

        return marker;
    }

    // marker被点击
    Map.prototype.onMarkerClick = function(obj) {
    	var index = obj.target.getExtData();
    	this.fastMarkChange(index);
    	viewModel.selectedPoiIndex(index);
    	aMap.setCenter(obj.lnglat);
    	return false;
    }

    Map.prototype.createIcon = function(url) {
    	var icon = new AMap.Icon({
	        image : url,//24px*24px
	        //icon可缺省，缺省时为默认的蓝色水滴图标，
	        size : new AMap.Size(24,24)
        });
        return icon;
    }

    // 定位到当前位置（未用上）
    Map.prototype.selfLocation = function() {
        var toolBar,
            customMarker = new AMap.Marker({
                offset: new AMap.Pixel(-14, -34), //相对于基点的位置
                icon: new AMap.Icon({ //复杂图标
                    size: new AMap.Size(27, 36), //图标大小
                    image: "http://webapi.amap.com/images/custom_a_j.png", //大图地址
                    imageOffset: new AMap.Pixel(-28, 0) //相对于大图的取图位置
                })
            });

        aMap.plugin(["AMap.ToolBar"], function() {
            toolBar = new AMap.ToolBar({ locationMarker: customMarker }); //设置地位标记为自定义标记 
        });

        aMap.addControl(toolBar);
        toolBar.doLocation();
    } 

     // 重设地图中心 
    Map.prototype.resetMapCenter = function(obj) { 
    	aMap.setCenter(obj)
    }      

    window.mapControl = new Map();
})();