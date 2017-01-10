/**
 * Ajax Class originally written for planet wars 2
 * 
 */

var AjaxClass = function()
{
	
	//function which returns the XMLHttpRequest thingy for the correct browser 
	this._getXmlHttp = function()
	{
		// Firefox, Opera 8.0+, Safari
		try 
		{
			return new XMLHttpRequest();
		} 
		catch (e) 
		{ // Internet Explorer
			try 
			{
				return ActiveXObject("Msxml2.XMLHTTP");
			} 
			catch (e) 
			{
				//older IE version, I think.
				try 
				{
					return ActiveXObject("Microsoft.XMLHTTP");
				} 
				catch (e) 
				{
					alert("Your browser does not support AJAX!");
				}
			}
		}
	}

	this._xmlHttp=this._getXmlHttp();
	
	this.getReadyState=function()
	{
		return this._xmlHttp.readyState;
	}
	
	this.getResponseText=function()
	{
		return this._xmlHttp.responseText;
	}
	
	//(xmlHttpobject to send request from, array of names of variables to be posted, url to fetch, time till timeout (can be set to false for no timeout), array of values of variables to be posted, function to be run when this is initally called, function to be run when it has finished, function for if failed)
	this.postRequest = function(url, timeOut, namesArr, valuesArr, onStart, onFinish, onFail)
	{
		/*
		if (typeof onFail != 'function') 
		{
			onFail = function()
			{
				this.postRequest(url, timeOut, namesArr, valuesArr, onStart, onFinish, false);
			}
		}
		*/
		if (timeOut !== false) 
		{
			var tempThis=this;
			//after timeout milseconds, run the fail and abort the ajax request
			var timeOutTimer = setTimeout(function()
			{
				onFail();
				tempThis._xmlHttp.abort();
			}, timeOut);
		}
		
		this._xmlHttp.onreadystatechange = function()
		{
			if (tempThis._xmlHttp.readyState == 4) 
			{
				//TODO, treat blank reponses as failed.
				if (tempThis._xmlHttp.status == 200 && tempThis._xmlHttp.responseText.length > 0) 
				{
					//treating no text returned as a fail - this won't fire finish and will just time out
					//clearly hasn't timed out, kill the timeout timer
					clearTimeout(timeOutTimer);
					onFinish(tempThis._xmlHttp.responseText);
				}
			}
		}
		
		var postThis = '';
		//generate the post thingyme
		for (var i = 0; i < namesArr.length; i++) 
		{
			postThis += urlencode(namesArr[i]) + "=" + urlencode(valuesArr[i]);
			postThis += namesArr.length > 1 && i < namesArr.length - 1 ? "&" : "";
		}
		
		tempThis._xmlHttp.open("POST", url, true);
		tempThis._xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
		//tempThis._xmlHttp.setRequestHeader("Content-length", postThis.length);
		tempThis._xmlHttp.setRequestHeader("Connection", "close");
		tempThis._xmlHttp.send(postThis);
		
		
	}
	
}