/*

ajaxLoop.js - designed that this is the only class on the page directly calling ajax functions.
all other classes register a wantRequest, either periodic or one off, and register a function to generate the xml
then when xml is returned, it is given to actOnXML, which dishes it out to various functions already set up classes which need them.

requires:

-AjaxClass
-ActOnJSONClass

*/

var AjaxLoopClass = function(callFile,loopTime)
{
	//peridoic requests
	this.wantPeroidic = new Array();
	//one off requests
	this.wantRequests = new Array();
	
	this.loopCount = 0;
	this.callFile = callFile;//'ajax.php';
	//array of classes for which to call a class.JSON_parsed() function after each request succeeds.
	this.classesToLetKnow = new Array();
	//if a class just wants to know about an json request once, use this array.
	this.classesToLetKnowOnce = new Array();
	//in ms
	this._loopTime = loopTime;//1000
	//last JSON that was attempted to be sent to the server
	this._lastJSON = new Object();
	
	this._actOnJSON = new ActOnJSONClass();
	
	//NOT NEEDED
	this.addParse=function(name,func)
	{
		this._actOnJSON["parse_"+name]=func;
	}
	
	this.loadInitialAJAX=function()
	{
		this._actOnJSON.loadIntialAjax();
	}
	/**
	 * Since this._actOnJSON is private, this is a wrapper that allows other methods who have a handle on this class
	 * to find out whether or not we're currently doing the initial ajax (things like chat won't make noises)
	 * @return bool true if in initialAjax
	 */
	this.doingInitialAjax = function()
	{
		return this._actOnJSON.doingInitialAjax;
	} 
	
	this.ajax = new AjaxClass();
	//this.XMLhttp.inUse = false;
	
	//if a class (eg chat) wants a bit of xml to be sent off, then it registers a function to return the xml and how frequently it wants this request to go.
	//howOften is done on a per x many ajax calls, ie 1=every call, 10=every 10.  SET TO 0 FOR ONE-OFF REQUEST
	
	var tempThis=this;
	//getting hacky
	this.wantRequest = function(callMe, howOften)
	{
		new tempThis._wantRequest(callMe, howOften);
	}
	
	this._wantRequest = function(callMe, howOften)
	{
		//function
		this.callMe = callMe;
		//int
		this.howOften = howOften;
		
		howOften == 0 ? tempThis.wantRequests.push(this) : tempThis.wantPeroidic.push(this);
	}
	
	this.letClassKnowOnce=function(me)
	{
		this.classesToLetKnowOnce.push(me);
	}
	
	this.letClassKnow=function(me)
	{
		this.classesToLetKnow.push(me);
	}

	this._loopMe = function(who)
	{
		if (!(who.ajax.getReadyState() == 0 || who.ajax.getReadyState() == 4)) 
		{
			//a request is currently in progress, DO NOT CONTINUE, otherwise one-off requests will be lost!
			return;
		}
		
		//blank object if dealt with, otherwise will have properties
		var sendJSON = who._lastJSON;
		
		
		//run through periodic requests, if due
		for (var i = 0; i < who.wantPeroidic.length; i++) 
		{
			if (who.loopCount % who.wantPeroidic[i].howOften == 0) 
			{
				//hand a reference to the JSON object to the function, so it can add what's needed & deal with what was left from old request if there was anything
				who.wantPeroidic[i].callMe(sendJSON);
			}
		}
		
		//run through one-off requests
		for (var i = 0; i < who.wantRequests.length; i++) 
		{
			who.wantRequests[i].callMe(sendJSON);
		}
		
		//clear all one-off requests
		who.wantRequests = new Array();
		
		//keep record of who JSON object
		who._lastJSON = sendJSON;
		
		
		
		if (CountObject(sendJSON) > 0) 
		{
			who.ajax.postRequest(who.callFile, 5000, ['data'], [JSON.stringify(sendJSON)], function(){}, function(){who.ajaxFinished(who)}, who.ajaxFailed);
			who.classesToLetKnowOnce = new Array();
		}
		
		who.loopCount++;
	}
	
	this.ajaxFinished = function(who)
	{
		
		//don't try and re-send last xml
		who._lastJSON = new Object();
		//dish out data to all the classes that need it, and alert a bunch of classes data has been given out
		who._actOnJSON.dishOutStuff(JSON.parse(who.ajax.getResponseText()), who.classesToLetKnow.concat(who.classesToLetKnowOnce));
	}
	
	this.ajaxFailed = function()
	{
		//needs not do anything - a record of the last JSON request is kept by default
	
	}
	
	this.load = function()
	{
		var tempThis=this;
		
		this.loop = setInterval(function(){tempThis._loopMe(tempThis);}, tempThis._loopTime);
	}
	this.load();
}