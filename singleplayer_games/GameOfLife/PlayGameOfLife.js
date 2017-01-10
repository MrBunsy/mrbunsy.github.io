//namespace
var playGameOfLife = new Object();

playGameOfLife.maxFps = 10;

playGameOfLife.load = function()
{

	playGameOfLife.canvasTag = document.getElementById('GameOfLifeCanvas');
	playGameOfLife.width = parseInt(playGameOfLife.canvasTag.width);
	playGameOfLife.height = parseInt(playGameOfLife.canvasTag.height);
	
	playGameOfLife.statusDiv = document.getElementById("GameOfLifeStatus");
	playGameOfLife.speedDiv = document.getElementById("GameOfLifeSpeed");
	
	playGameOfLife.IE=(/msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent));
	
	playGameOfLife.cellSize=10;
	
	//fps = 1000 / T(ms)
	playGameOfLife.fps = 2;
	
	//adding or deleting cells when clicking?
	playGameOfLife.addStuff=true;
	
	if (playGameOfLife.canvasTag.getContext) 
	{
		playGameOfLife.canvas = playGameOfLife.canvasTag.getContext('2d');
	}
	
	playGameOfLife.gameOfLife = new GameOfLife(playGameOfLife.canvas, playGameOfLife.width, playGameOfLife.height, playGameOfLife.cellSize);
	
	playGameOfLife.gridSize = playGameOfLife.gameOfLife.getGridSize();
	
	//canvasTag, div, defaultSize
	//playGameOfLife.gameOfLife=new GameOfLifeControls('GameOfLifeCanvas','GameOfLifeDiv',10);	
	/*
	
	 playGameOfLife.gameOfLife.makeCellAlive(10,10);
	
	 playGameOfLife.gameOfLife.makeCellAlive(11,11);
	
	 playGameOfLife.gameOfLife.makeCellAlive(10,11);
	
	 playGameOfLife.gameOfLife.makeCellAlive(10,9);
	
	 playGameOfLife.gameOfLife.makeCellAlive(9,10);
	
	 */
	
	/*
	
	 playGameOfLife.gameOfLife.makeCellAlive(25,25);
	
	 playGameOfLife.gameOfLife.makeCellAlive(26,26);
	
	 playGameOfLife.gameOfLife.makeCellAlive(25,26);
	
	 playGameOfLife.gameOfLife.makeCellAlive(25,24);
	
	 playGameOfLife.gameOfLife.makeCellAlive(24,25);
	
	 */
	
	/*playGameOfLife.gameOfLife.makeCellAlive(10,11);
	
	 playGameOfLife.gameOfLife.makeCellAlive(10,10);
	
	 playGameOfLife.gameOfLife.makeCellAlive(10,9);
	
	 */
	
	/*
	
	 playGameOfLife.gameOfLife.makeCellAlive(9,10);
	
	 playGameOfLife.gameOfLife.makeCellAlive(10,10);
	
	 playGameOfLife.gameOfLife.makeCellAlive(11,10);
	
	 */
	
	//playGameOfLife.gameOfLife.changeSpeed(100);
	//playGameOfLife.gameOfLife.play();

}

playGameOfLife.lastCell=[0,0];

playGameOfLife.mouseDown = function()
{
	if(playGameOfLife.mouseX > 0 && playGameOfLife.mouseX < playGameOfLife.gridSize[1]*playGameOfLife.cellSize && playGameOfLife.mouseY > 0 && playGameOfLife.mouseY < playGameOfLife.gridSize[0]*playGameOfLife.cellSize)
	{
		//mouse clicked on grid
		
		playGameOfLife.mouseIsDown=true;
		
		var row=Math.floor(playGameOfLife.mouseY/playGameOfLife.cellSize);
		var col=Math.floor(playGameOfLife.mouseX/playGameOfLife.cellSize);
		
		playGameOfLife.lastCell=[row,col];
		
		playGameOfLife.gameOfLife.invertCell(row,col);
	}
}

playGameOfLife.makeCells=function()
{
	var row=Math.floor(playGameOfLife.mouseY/playGameOfLife.cellSize);
	var col=Math.floor(playGameOfLife.mouseX/playGameOfLife.cellSize);
	
	if(playGameOfLife.lastCell[0]==row && playGameOfLife.lastCell[1] == col)
	{
		//don't put another one over the top of the last
		return;
	}
	
	
	//playGameOfLife.gameOfLife.invertCell(row,col);
	
	var dRow=row-playGameOfLife.lastCell[0];
	var dCol=col-playGameOfLife.lastCell[1];
	var distSqrd=dRow*dRow + dCol*dCol;
	
	if(distSqrd < 2)
	{
		//if mouse has only moved one cell, plonk here
		playGameOfLife.makeCell(row,col);
		return;
	}
	
	//mouse moved long way, draw a line
	var dist=Math.sqrt(distSqrd);
	
	
	dRow/=dist;
	dCol/=dist;
	
	for(var i=0;i<dist;i++)
	{
		var row2=Math.round(playGameOfLife.lastCell[0]+dRow*i);
		var col2=Math.round(playGameOfLife.lastCell[1]+dCol*i);
		
		playGameOfLife.makeCell(row2,col2);
	}
	playGameOfLife.lastCell=[row,col];
	
	
}

playGameOfLife.makeCell=function(row,col)
{
	if(playGameOfLife.addStuff)
		{
			playGameOfLife.gameOfLife.makeCellAlive(row,col);
		}
		else
		{
			playGameOfLife.gameOfLife.makeCellDead(row,col);
		}
}

playGameOfLife.getMouseXY=function(e)
{
    if(playGameOfLife.IE)
    {
        //grab the x-y pos.s if browser is IE
        playGameOfLife.mouseX = event.clientX + document.body.scrollLeft - findPosX(playGameOfLife.canvasTag);
        playGameOfLife.mouseY = event.clientY + document.body.scrollTop - findPosY(playGameOfLife.canvasTag);
    }
    else
    {
        //grab the x-y pos.s if browser is NS
        playGameOfLife.mouseX = e.pageX - findPosX(playGameOfLife.canvasTag);
        playGameOfLife.mouseY = e.pageY - findPosY(playGameOfLife.canvasTag);
    }
	
	
		
	if(playGameOfLife.mouseIsDown)
	{
		playGameOfLife.makeCells();
	}
	
}

document.onmousemove = playGameOfLife.getMouseXY
document.onmouseup=function(){playGameOfLife.mouseIsDown=false;playGameOfLife.gameOfLife.render();}

playGameOfLife.play = function()
{
	playGameOfLife.gameOfLife.play();
	playGameOfLife.statusDiv.innerHTML = "Playing";
}

playGameOfLife.stop = function()
{
	playGameOfLife.gameOfLife.stop();
	playGameOfLife.statusDiv.innerHTML = "Paused";
}

playGameOfLife.clear = function()
{
	playGameOfLife.stop();
	playGameOfLife.gameOfLife.clearCells();
}

playGameOfLife.changeSpeed = function(upDown)
{
	if (upDown && playGameOfLife.fps < playGameOfLife.maxFps) 
	{
		playGameOfLife.fps++;
	}
	else 
		if (!upDown && playGameOfLife.fps > 1) 
		{
			playGameOfLife.fps--;
		}
	
	playGameOfLife.gameOfLife.changeSpeed(1000 / playGameOfLife.fps);
	
	playGameOfLife.speedDiv.innerHTML = playGameOfLife.fps;
}


myAddEvent(window, 'onload', playGameOfLife.load);

// ----------------- Common functions --------------------

function myAddEvent(obj, event, func)
{
	//adapted from a function by Todd Anthony Spartaforce http://spatacoli.com/storydisplay.aspx?reqid=5463c334-0d6f-425a-94cd-fe5ead3634e7
	//needed a non-destructive cross-browser method for adding event listeners
	var oldevent = obj[event];
	if (typeof obj[event] != 'function') 
		obj[event] = func;
	else 
	{
		obj[event] = function()
		{
			oldevent();
			func();
		};
	}
}

//finds x coords of an element on the page
findPosX = function(obj, includeScroll)
{
	var curleft = 0;
	if (obj.offsetParent) 
		while (1) 
		{
			curleft += obj.offsetLeft;
			if (!obj.offsetParent) 
				break;
			obj = obj.offsetParent;
		}
	else 
		if (obj.x) 
			curleft += obj.x;
	if (includeScroll) 
	{
		curleft += document.body.scrollLeft ? document.body.scrollLeft : window.pageXOffset
	}
	return curleft;
}

findPosY = function(obj, includeScroll)
{
	var curtop = 0;
	if (obj.offsetParent) 
		while (1) 
		{
			curtop += obj.offsetTop;
			if (!obj.offsetParent) 
				break;
			obj = obj.offsetParent;
		}
	else 
		if (obj.y) 
			curtop += obj.y;
	if (includeScroll) 
	{
		curtop += document.body.scrollTop ? document.body.scrollTop : window.pageYOffset
	}
	return curtop;
}
