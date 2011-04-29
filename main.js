
var GeoSuggester = function(inputEl)
{
	this.inputName = inputEl;
	this.inputElement = document.getElementById(inputEl);
	this.posx = null;
	this.posy = null;
	
	this.calculate();
	this.inject();
		
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
	var canvas = document.createElement('div');
	canvas.setAttribute('class', '_mapCanvas_');
	canvas.style.position = "absolute";
	canvas.style.left = this.posx+"px";
	canvas.style.top = (this.posx+this.inputHeight)+"px";
	canvas.style.width = (parseInt(this.inputWidth)+parseInt(this.paddingLeft)+parseInt(this.paddingRight))+"px";
	canvas.style.height = "100px";
	canvas.style.backgroundColor = "red";
	//canvas.style.display = "none";
		
	document.body.appendChild(canvas);
}


