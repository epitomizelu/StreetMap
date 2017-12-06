(function() {
    /**
     * 在 map.js 中声明了两个全局变量 ： mapControl（用户与地图的交互接口） 和 aMap(高德地图对象)
     *
     * 在 app.js 中声明了一个变量： viewModel
     */

    mapControl.init('container');
    mapControl.search(); 

    var ViewModel = function() {
    	this.pois = ko.observableArray();
    	this.selectedPoiIndex = ko.observable(0);
    	this.showOrHidePoiList = ko.observable('block');
    	this.current = ko.observable('');
    	this.filterPoisList = ko.observableArray();

    	var self = this;

        // 点击左侧POI 列表，更新左侧列表和右侧地图
    	this.update = function() {
    		var obj = this;
    		var index = self.filterPoisList.indexOf(obj);
    		self.updateMarker(index);
    		self.updateAsidePoiListView(index);
    	}
        
        // 更新地图
    	this.updateMarker = function (index) {  
    		mapControl.fastMarkChange(index); 
    	}

        // 更新左侧列表
    	this.updateAsidePoiListView = function(index) {
    	    self.selectedPoiIndex(index); 
    	}

        // 给左侧列表选中项增加选中样式
    	this.poiSelected = function(index) {
    		return self.selectedPoiIndex() === index();
    	}

        // 显示 or 隐藏 左侧的POI信息列表
    	this.changeDisplayOfPoiList = function() {
    		var display = this.showOrHidePoiList() === 'block' ? 'none' : 'block';
    		this.showOrHidePoiList(display);
    	}

        // 用户按 enter 键 或者 查询按钮时根据用户输入过滤，如果用户输入为空，则显示全部
    	this.filterPois = function() {
        	var current = self.current().trim(); 

        	self.filterPoisList.removeAll();
        	self.pois().forEach(function(item) {
            	if(item.name.indexOf(current) != -1) {
            		self.filterPoisList.push(item);
            	}
        	});

        	self.recreateMarkers();
    	}

        //  创建marker
    	this.recreateMarkers = function() {
    		mapControl.clearAllMarkers();
    		mapControl.createMarkers(this.filterPoisList()); 
    	}

    	this.asidePoiListClass = ko.pureComputed(function() {
        	return  this.showOrHidePoiList() === 'block' ? 'show' : 'hidden';
    	}, this);
    }


    window.viewModel = new ViewModel();
	ko.applyBindings(viewModel);
})();