/**
 * @author Luke
 */

var harmonograph;
var harmonographCanvas;
var thisIsIE=false;

var loadHarmonograph = function(){
	
	var canvasTag=document.getElementById("harmonographCanvas");
	
	if (canvasTag.getContext) 
	{
		harmonographCanvas = canvasTag.getContext('2d');
	}
	
	var url=document.location+'';
	var lastSlash=url.lastIndexOf('/');
	var link=url.substring(0,lastSlash+1);
	var page="harmonograph.html";
	
	harmonograph = new HarmonographClass (harmonographCanvas,canvasTag,document.getElementById("harmonographDiv"),document.getElementById("harmonographLinkDiv"),[600,600],402,link,page,thisIsIE);
	/*
	harmonograph.addPendulum();
	harmonograph.addPendulum();
	//harmonograph.addPendulum();
	//harmonograph.addPendulum();
	harmonograph.buildDiv();
	harmonograph.draw();
	*/
	
	harmonograph.load();
	
	//harmonograph.draw([800,800],200,66);
}

myAddEvent(window, 'onload', loadHarmonograph);