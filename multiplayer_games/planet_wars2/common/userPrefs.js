var UserPrefsClass = function(ajaxLoop)
{
	//this._userId = userId;
	if (typeof ajaxLoop != 'undefined') 
	{
		this._ajaxLoop = ajaxLoop;
	}
	else
	{
		this._ajaxLoop = false;
	}
	var thisObject = this;
	
	//array of functions to call when this is updated
	this._hookArray=new Array();
	
	this.addHook=function(func)
	{
		this._hookArray.push(func);
	}
	
	
	//some defaults:
	//this.graphicsLevel=3;
	
	//user_preferences_request
	
	ActOnJSONClass.prototype.parse_user_preferences = function(userPrefs)
	{
		for(var p in userPrefs)
		{
			thisObject[p]=userPrefs[p];
		}
		
		//let stuff know
		for(var i=0;i<thisObject._hookArray.length;i++)
		{
			thisObject._hookArray[i]();
		}
	}

}
