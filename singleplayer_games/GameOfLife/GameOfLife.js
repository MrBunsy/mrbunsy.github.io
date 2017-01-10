// GameOfLife.js - Luke Wallin's implementation of Conway's Game of Life

var GameOfLife = function(canvas, width, height, cellSize)
{
	// ------------------- properties -------------------

	this._canvas = canvas;
	this._width = width;
	this._height = height;
	this._cellSize = Math.round(cellSize);
	
	if(this._cellSize<1)
	{
		this._cellSize=1;
	}
	
	this._loopMe = false;
	this._period = 500;
	
	// --------------------- constructor, I suppose ------------------
	
	this._rows = Math.floor((this._height - 1) / this._cellSize);
	this._cols = Math.floor((this._width - 1) / this._cellSize);
	
	
	//array [row][col], bool.  true=cell alive, false=cell dead;
	this._cells = new Array(this._rows);
	this._cellsNew = new Array(this._rows);
	
	for (var r = 0; r < this._rows; r++) 
	{
		this._cells[r] = new Array(this._cols);
		this._cellsNew[r] = new Array(this._cols);
		
		for (var c = 0; c < this._cols; c++) 
		{
			this._cells[r][c] = false;
			this._cellsNew[r][c] = false;
		}
	}
	
	// ----------------- Private methods ------------------------------
	
	this._rowLimits = function(rowTest)
	{
		if (rowTest < 0) 
		{
			return 0;
		}
		
		if (rowTest >= this._rows) 
		{
			return this._rows - 1;
		}
		
		return rowTest;
	}
	//these two take an int and then return one that's within col and row limits
	this._colLimits = function(colTest)
	{
		if (colTest < 0) 
		{
			return 0;
		}
		
		if (colTest >= this._cols) 
		{
			return this._cols - 1;
		}
		
		return colTest;
	}
	
	//count how many neighbours nearby this cell
	this._getNeighbours = function(row, col)
	{
		var neighbours = 0;
		for (var r = this._rowLimits(row - 1); r <= this._rowLimits(row + 1); r++) 
		{
			for (var c = this._colLimits(col - 1); c <= this._colLimits(col + 1); c++) 
			{
				if (typeof(this._cells[r][c]) == "undefined") 
				{
					//alert([r,c])
				}
				if (!(row == r && col == c) && this._cells[r][c]) 
				{
					neighbours++;
				}
			}
		}
		
		return neighbours;
	}
	
	//advance by one
	this._advance = function()
	{
		//build up cellsNew array
		for (var r = 0; r < this._rows; r++) 
		{
			for (var c = 0; c < this._cols; c++) 
			{
				var neighbours = this._getNeighbours(r, c)
				
				if (this._cells[r][c] && (neighbours < 2 || neighbours > 3)) 
				{
					//cell currently alive, more than 3 nearby or less than 2, so dies
					this._cellsNew[r][c] = false;
					this._drawSingleCell(r,c,false);
				}
				else 
					if (!this._cells[r][c] && neighbours == 3) 
					{
						//currently dead, but has exactly 3 nearby, make alive!
						this._cellsNew[r][c] = true;
						this._drawSingleCell(r,c,true);
					}
					else 
					{
						//otherwise stay as was
						this._cellsNew[r][c] = this._cells[r][c];
					}
			}
		}
		
		for (var r = 0; r < this._rows; r++) 
		{
			for (var c = 0; c < this._cols; c++) 
			{
				this._cells[r][c] = this._cellsNew[r][c];
			}
		}
		//make current cells the cellsNew array
	
	}
	
	//render!
	this._render = function()
	{
		this._canvas.clearRect(0, 0, this._width, this._height);
		this._canvas.fillStyle = "rgb(0,0,0)";
		
		for (var r = 0; r < this._rows; r++) 
		{
			for (var c = 0; c < this._cols; c++) 
			{
				if (this._cells[r][c]) 
				{
					this._canvas.fillRect(c * this._cellSize, r * this._cellSize, this._cellSize, this._cellSize);
				}
				
			}
		}
		
		this._canvas.beginPath();
		this._canvas.strokeStyle = "rgb(128,128,128)";
		this._canvas.lineWidth = 1;
		
		//draw horizontal lines
		for (var r = 0; r <= this._rows; r++) 
		{
			this._canvas.moveTo(0.5, r * this._cellSize + 0.5);
			this._canvas.lineTo(this._cols * this._cellSize + 0.5, r * this._cellSize + 0.5);
		}
		
		//draw vetical lines
		for (var r = 0; r <= this._cols; r++) 
		{
			this._canvas.moveTo(r * this._cellSize + 0.5, 0.5);
			this._canvas.lineTo(r * this._cellSize + 0.5, this._rows * this._cellSize + 0.5);
		}
		
		this._canvas.stroke();
	}
	
	this._loop = function(who)
	{
		who._advance();
		//who._render();
	}
	
	this._drawSingleCell=function(row,col,state)
	{
		this._canvas.save();
		this._canvas.fillStyle=state ? "rgb(0,0,0)" : "rgb(255,255,255)";
		this._canvas.fillRect(col * this._cellSize + 1, row * this._cellSize +1, this._cellSize - 1, this._cellSize - 1);
		this._canvas.restore();
	}
	
	this._render();
	// ------------------------- public methods -----------------------
	
	this.getGridSize = function()
	{
		return [this._rows, this._cols];
	}
	
	this.makeCellAlive = function(row, col)
	{
		row=this._rowLimits(row);
		col=this._colLimits(col);
		
		this._cells[row][col] = true;
		this._drawSingleCell(row,col,true);
		//this._render();
	}
	
	this.invertCell=function(row, col)
	{
		row=this._rowLimits(row);
		col=this._colLimits(col);
		
		if(this._cells[row][col])
		{
			this.makeCellDead(row,col);
		}
		else
		{
			this.makeCellAlive(row,col);
		}
	}
	
	this.makeCellDead = function(row, col)
	{
		row=this._rowLimits(row);
		col=this._colLimits(col);
		
		this._cells[row][col] = false;
		//this._render();
		this._drawSingleCell(row,col,false);
	}
	
	//make all cells dead
	this.clearCells = function()
	{
		for (var r = 0; r < this._rows; r++) 
		{
			for (var c = 0; c < this._cols; c++) 
			{
				this._cells[r][c] = false;
			}
		}
		this._render();
	}
	
	this.play = function()
	{
		if (this._loopMe === false) 
		{
			this._render();
			var tempThis = this;
			this._loopMe = setInterval(function()
			{
				tempThis._loop(tempThis);
			}, this._period);
		}
	}
	
	this.changeSpeed = function(thisPeriod)
	{
		this._period = Math.round(thisPeriod);
		
		if (this._loopMe !== false) 
		{
			this.stop();
			this.play();
		}
	}
	
	this.stop = function()
	{
		clearInterval(this._loopMe);
		this._loopMe = false;
	}
	
	this.render=function()
	{
		this._render();
	}
}
