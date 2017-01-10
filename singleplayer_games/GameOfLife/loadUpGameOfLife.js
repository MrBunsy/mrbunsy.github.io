//namespace
var playGameOfLife=new Object();

playGameOfLife.load=function()
{
	playGameOfLife.canvasTag=document.getElementById('GameOfLifeCanvas');
	playGameOfLife.width=parseInt(playGameOfLife.canvasTag.width);
	playGameOfLife.height=parseInt(playGameOfLife.canvasTag.height);
	
	
	if (playGameOfLife.canvasTag.getContext)
	{
		playGameOfLife.canvas = playGameOfLife.canvasTag.getContext('2d');
	}
	
	playGameOfLife.gameOfLife=new GameOfLife(playGameOfLife.canvas,playGameOfLife.width,playGameOfLife.height,10);
	/*
	playGameOfLife.gameOfLife.makeCellAlive(10,10);
	playGameOfLife.gameOfLife.makeCellAlive(11,11);
	playGameOfLife.gameOfLife.makeCellAlive(10,11);
	playGameOfLife.gameOfLife.makeCellAlive(10,9);
	playGameOfLife.gameOfLife.makeCellAlive(9,10);
	*/
	
	playGameOfLife.gameOfLife.makeCellAlive(25,25);
	playGameOfLife.gameOfLife.makeCellAlive(26,26);
	playGameOfLife.gameOfLife.makeCellAlive(25,26);
	playGameOfLife.gameOfLife.makeCellAlive(25,24);
	playGameOfLife.gameOfLife.makeCellAlive(24,25);
	
	/*playGameOfLife.gameOfLife.makeCellAlive(10,11);
	playGameOfLife.gameOfLife.makeCellAlive(10,10);
	playGameOfLife.gameOfLife.makeCellAlive(10,9);
	*/
	/*
	playGameOfLife.gameOfLife.makeCellAlive(9,10);
	playGameOfLife.gameOfLife.makeCellAlive(10,10);
	playGameOfLife.gameOfLife.makeCellAlive(11,10);
	*/
	playGameOfLife.gameOfLife.changeSpeed(100);
	playGameOfLife.gameOfLife.play();
	
}
myAddEvent(window,'onload',playGameOfLife.load);

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