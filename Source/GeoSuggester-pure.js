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
	
	this.cache = null;
	
	this.calculate();
	this.inject();
	this.manageEvents(); 
	
	   
		
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
		
	}
	else if(inputElement.currentStyle)
	{
		this.inputWidth = this.inputElement.currentStyle["width"].match(/(\d*\.?\d*)(.*)/)[1];
		this.inputHeight = this.inputElement.currentStyle["height"];
		this.paddingLeft = this.inputElement.currentStyle["padding-left"];
		this.paddingRight = this.inputElement.currentStyle["padding-right"];
	}
		
}

GeoSuggester.prototype.inject = function()
{
	var canvas = this.canvas = document.createElement('div');
	canvas.setAttribute('class', '_mapCanvas_');
	canvas.style.position = "absolute";
	canvas.style.left = this.posx+"px";
	canvas.style.top = (this.posx+this.inputHeight)+"px";
	canvas.style.width = (parseInt(this.inputWidth)+parseInt(this.paddingLeft)+parseInt(this.paddingRight))+"px";
 	canvas.style.height = this.options.canvasHeight+"px";
	canvas.style.border = "1px solid #999";
	canvas.style.display = "none";
		
	document.body.appendChild(canvas);
}

GeoSuggester.prototype.manageEvents = function()
{ 
	
	//keyup event
	this.inputElement.addEventListener("keyup", function(event)
	{
		var fieldSize = that.inputElement.value.length; 
		if(event.keyCode == '13' || event.keyCode == '9')
		{
		  
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

		
		
	});
	
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
	console.log(address);
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
				var type = results[0].geometry.location_type;
				suggest = results[0].formatted_address;
				if(type !== 'APPROXIMATE')
				{
					var gOptions = 
					{
						zoom: 9,
						center: center,
						mapTypeId: google.maps.MapTypeId.ROADMAP
					}                                           
					map = new google.maps.Map(that.canvas, gOptions);
					marker = new google.maps.Marker({
						map: map,
						position: results[0].geometry.location
					});                                       
					 
				   
					if(typeof that.mapHUD == "undefined")
					{
						that.mapHUD = mapHUD;
						mapHUD = document.createElement('div');
						mapHUD.setAttribute('class', '_mapHud_');
						mapHUD.style.position = "absolute";
						mapHUD.style.left = "80px";
						mapHUD.style.top = "20px";
						mapHUD.style.backgroundColor = "#333";
						mapHUD.style.color = "#fff";
						mapHUD.innerHTML = "TESTO DI ESEMPIO";
						that.canvas.appendChild(mapHUD);
					 }  
							   
					
				} 
				
				
				
				
			}
		}
		);
	}
	
	
}


