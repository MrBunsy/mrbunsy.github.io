/**
 * @author Luke
 */
var sandbox;

var loadSandbox=function()
{
	var controlDiv=document.getElementById("sandboxControlDiv");
	var canvasTag=document.getElementById("sandboxCanvas");
	var miniMapCanvasTag=document.getElementById("sandboxMiniMapCanvas");
	
	if (canvasTag.getContext && miniMapCanvasTag.getContext) 
	{
		var canvas = canvasTag.getContext('2d');
		var miniMapCanvas = miniMapCanvasTag.getContext('2d');
	}
	
	var canvasSize=[parseInt(canvasTag.width),parseInt(canvasTag.height)];
	var miniMapSize=[parseInt(miniMapCanvasTag.width),parseInt(miniMapCanvasTag.height)];
	
	var url=document.location+'';
	var lastSlash=url.lastIndexOf('/');
	var link=url.substring(0,lastSlash+1)
	
	//(controlsDiv,canvasTag,canvas,canvasSize,worldSize,gravity,friction,fps,miniMapCanvas,miniMapSize)
	sandbox=new SandboxClass(controlDiv,canvasTag,canvas,canvasSize,[8000,6000],[0,100],5,40,miniMapCanvasTag,miniMapCanvas,miniMapSize,link);
	
	sandbox.play();
}


myAddEvent(window, 'onload', loadSandbox);