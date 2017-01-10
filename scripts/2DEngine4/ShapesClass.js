/**
 * @author Luke
 */

//I don't think the shapes will ever be needed seperate to the Physics part of the engine, so I'm tieing them together

Physics.prototype.Circle=function(radius,position,angle,velocity,mass,force,hard,elasticity,hollow,group,canMove,colour,gameType)
	{
		this._shape=0;
		this._alive=true;
		
		//radius
		this._r=radius;
		//position of centre, [x,y]
		this._pos=position;
		this._a=angle;
		//current velocity [x,y,angular]
		this._v=velocity;
		this._mass=mass;
		//permanent forces on this object
		this._f=force;
		
		//can collide?
		this._hard=hard;
		//coefficient of restitution
		this._e=elasticity;
		//hollow or filled?
		this._hollow=hollow;
		//inverse true is used for a border - the only non-colliding area is inside it
		this._inverse=false;
		
		//is it in a group of objects it can't collide with?
		//false = not in group, else reference to the group object
		this._group=group;
		
		//can this object move?
		this._canMove=canMove;
		
		//colour (HTML colour code with # missing)
		this._colour=colour;
		
		//used by whatever the engine is implemented as
		this._gameType=gameType;

		this._connections = new Array();
		
		this.connect = function()
		{
			//new thisObject._physics.connection.. or something
		}

	}