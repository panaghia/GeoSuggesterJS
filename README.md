GeoSuggesterJS
===========   

GeoSuggester is a pure Javascript plugin.

It aims to enhance User Experience when filling geographical information inside forms thanks to Google Maps API.

How to use
---------- 

First, include Google Maps API V3 api as a script in your page:
	
	<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"></script>
	<script type="text/javascript" src="../Source/GeoSuggester-pure.js"></script>
                                                                                 
Then, define an element that will be used to let user insert text:

	<input type="text" id="myInput" />

Finally, add GeoSuggester magic:

	window.onload = function()
	{
		var geo = new GeoSuggester("myInput",
		{
			canvasHeight: 400,
			onSelect: function()
			{
				//returns selected data
				console.log(this.selected.postalCode);
				/*
				this.selected.route;
				this.selected.streetNumber;
				this.selected.adminArea1; 
			    this.selected.locality;
				this.selected.latitude+ " "+this.selected.longitude;
				*/ 
			}
		});
	} 

Browser Support
----------	   
Currently tested on Safari 5+, FireFox 4+, IE8.     


Credits
----------
Author: Sergio Panagia [http://panaghia.it]
Code released under MIT-Style license. 
