/*
---
description: GeoSuggesterJS

license: MIT STYLE

authors:
- Sergio Panagia (http://panaghia.it) 

provides: GeoSuggester

*/    

var GeoSuggester = function(inputEl, options)
{
	this.options = options;
	this.inputName = inputEl;
	this.inputElement = document.getElementById(inputEl);
	this.posx = null;
	this.posy = null; 
	this.canvas = null; 
	this.visible = false;
	that = this;  
	this.results = null; 
	this.mapHUD = null;
	this.mode = options.mode;
		
	this.cache = null;
	
	this.calculate();
	this.applyStyles(); 
	this.inject();
	this.manageEvents(); 
	
	
	this.selected = {
		postalCode: null,
		streetNumber: null,
		route: null,
		locality: null,
		adminArea1: null,
		adminArea2: null,
		country: null,
		latitude: null,
		longitude: null
	}
     	
}    


GeoSuggester.prototype.calculate = function()
{
	this.posx = this.inputElement.offsetLeft;
	this.posy = this.inputElement.offsetTop;
	
	if(document.defaultView)
	{ 
		this.inputWidth = getComputedStyle(this.inputElement, "").getPropertyValue("width").match(/(\d*\.?\d*)(.*)/)[1];
		this.inputHeight = getComputedStyle(this.inputElement, "").getPropertyValue("height");
		this.paddingLeft = getComputedStyle(this.inputElement, "").getPropertyValue("padding-left").match(/(\d*\.?\d*)(.*)/)[1];
		this.paddingRight = getComputedStyle(this.inputElement, "").getPropertyValue("padding-right").match(/(\d*\.?\d*)(.*)/)[1];
		this.paddingTop = getComputedStyle(this.inputElement, "").getPropertyValue("padding-top").match(/(\d*\.?\d*)(.*)/)[1];    
		this.paddingBottom = getComputedStyle(this.inputElement, "").getPropertyValue("padding-bottom").match(/(\d*\.?\d*)(.*)/)[1];    
	}
	else if(this.inputElement.currentStyle)
	{
		this.inputWidth = this.inputElement.currentStyle["width"].match(/(\d*\.?\d*)(.*)/)[1];
		this.inputHeight = this.inputElement.currentStyle["height"];
		this.paddingLeft = this.inputElement.currentStyle["padding-left"];
		this.paddingRight = this.inputElement.currentStyle["padding-right"];
		this.paddingTop = this.inputElement.currentStyle["padding-top"];
		this.paddingBottom = this.inputElement.currentStyle["padding-bottom"];
	}
		
}

GeoSuggester.prototype.applyStyles = function()
{

	if(this.canvas === null)  //first run
	{
		var canvas = this.canvas = document.createElement('div');
		canvas.style.display = "none";
	}
	else //user is resizing window
		var canvas = this.canvas; 

	canvas.setAttribute('class', '_mapCanvas_');
	canvas.style.position = "absolute";
	canvas.style.left = this.posx+"px";
	canvas.style.top = parseInt(this.posy)+parseInt(this.inputHeight)+parseInt(this.paddingTop)+parseInt(this.paddingBottom)+"px";	
	canvas.style.width = (parseInt(this.inputWidth)+parseInt(this.paddingLeft)+parseInt(this.paddingRight))+"px";
 	canvas.style.height = this.options.canvasHeight+"px";
	canvas.style.border = "1px solid #999";
  
}  

GeoSuggester.prototype.inject = function()
{
	document.body.appendChild(this.canvas);
}


GeoSuggester.prototype.manageEvents = function()
{
	//resize event                  
	window.addEventListener("resize", function(e)
	{
		that.calculate();
		that.applyStyles();
	}, false);
    

	//keyup event
	this.inputElement.addEventListener("keyup", function(event)
	{
		var fieldSize = that.inputElement.value.length;   
		//13 enter, 9 tab, 27 esc
		if(event.keyCode == '13' || event.keyCode == '9')
		{
			event.preventDefault();
			event.stopPropagation();
			that.extract();

			that.inputElement.value = that.results[0].formatted_address;
		    
		  	if(that.options.onSelect)
				that.options.onSelect.call(that);
		  	that.showCanvas(false);
			
		}
		else if(event.keyCode == '27') 
		{
			event.preventDefault();
			that.showCanvas(false);
		}
		else
		{
			if(fieldSize > 8)
			{
				that.loadMap();
			}
			if(fieldSize > 8 && that.visible === false)
			{  
				that.showCanvas(true);
			}
			else if(fieldSize == 0)
			{
				that.showCanvas(false);
			}			
		}
  	
	}, false);
    
}  

GeoSuggester.prototype.showCanvas = function(flag)
{
	if(flag)
	{
		this.canvas.style.display = "block"; 
		this.visible = true;
	}
	else
	{
		this.canvas.style.display = "none";
		this.visible = false;
	}
} 

GeoSuggester.prototype.loadMap = function()
{ 
	var address = this.inputElement.value; 
 
	geocoder = new google.maps.Geocoder();
	if(geocoder)
	{
		geocoder.geocode({
			'address':address
		},
		function(results, status)
		{
			if(status == google.maps.GeocoderStatus.OK)
			{
				center = results[0].geometry.location;
				
				that.results = results;
				that.suggest = results[0].formatted_address;
				var type = results[0].geometry.location_type;
				
				if(type !== 'APPROXIMATE')
				{
					var gOptions = 
					{
						zoom: 9,
						center: center,
						mapTypeId: google.maps.MapTypeId.ROADMAP,
						disableDefaultUI: true
					}                                           
					map = new google.maps.Map(that.canvas, gOptions);
					marker = new google.maps.Marker({
						//map: map,
						position: results[0].geometry.location
					});  
					marker.setMap(map); 
					
				   		  
				    if(true)//that.mapHUD === null)
					{   
					    var mapHUD = that.mapHUD = document.createElement('div');
						mapHUD.setAttribute('class', '_mapHud_');
						mapHUD.style.position = "absolute";
						mapHUD.style.left = "0px";
						mapHUD.style.top = "0px";
						mapHUD.style.zIndex = "999";
						mapHUD.innerHTML = that.suggest;
						that.canvas.appendChild(mapHUD);
					 }      
					
				} 
				
				
				
				
			}
		}
		);
	}
	
	
}    

GeoSuggester.prototype.extract = function()
{
	for(var i = this.results[0].address_components.length; i--;)
	{
		var cur = this.results[0].address_components[i]; 

		switch(cur.types[0])
		{
			case 'postal_code': this.selected.postalCode = cur.short_name;
				break; 
			case 'postal_code_prefix': this.selected.postalCode = cur.short_name //some places do not return postal_code, use postal_code_prefix instead, even if not documented in google api V3
				break;
			case 'street_number': this.selected.streetNumber = cur.short_name;
				break;
			case 'route': this.selected.route = cur.short_name;
				break;
			case 'locality': this.selected.locality = cur.short_name;
				break;
			case 'administrative_area_level_1': this.selected.adminArea1 = cur.long_name;
				break;
			case 'administrative_area_level_2': this.selected.adminArea2 = cur.long_name;
				break;
			case 'country': this.selected.country = cur.long_name = cur.long_name;
				break;
			default:
				break;
		}   
		this.selected.latitude = this.results[0].geometry.location.lat();  
		this.selected.longitude = this.results[0].geometry.location.lng();
		
		
	}
	
	
	
}

