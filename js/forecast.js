var ForeCast = function() {
	this.API_URL = 'https://api.caiyunapp.com/v2/TAkhjf8d1nlSlspN/121.6544,25.1552/forecast.jsonp?callback=?';
	this.getForeCastInfo = function(location) {
		var self = this;
		try{
			$.getJSON(this.API_URL, {'dtype': 'jsonp'})
    	 		.done(function(res) {
    	 			self.showForeCast(res,location)
    	 		})
    	 		.fail(this.whenErrorsCome);
		}catch(e) {
            console.log(e);
		}
    	
	}

	this.showForeCast = function(res,location) {
		if('failed' === res.status) {
			mapControl.createAndShowInfoWindow('对不起，查询PM2.5出错了',location); 
		}else {
			mapControl.createAndShowInfoWindow('PM2.5:' + res.result.hourly.pm25[0].value, location); 
		}		
	}

	this.whenErrorsCome = function(res) {
		createAndShowInfoWindow('对不起，出错了'); 
	}
}

window.foreCast = new ForeCast();