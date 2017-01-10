var ajax=new Object();

ajax.debugLog=new Array();

//function which returns the XMLHttpRequest thingy for the correct browser 
ajax.getXmlHttp=function()
{
    // Firefox, Opera 8.0+, Safari
    try{return new XMLHttpRequest();}
    catch (e)
    {   // Internet Explorer
        try{return ActiveXObject("Msxml2.XMLHTTP");}
        catch (e)
        {
            //older IE version, I think.
            try{return ActiveXObject("Microsoft.XMLHTTP");}
            catch (e)
            {
                alert("Your browser does not support AJAX!");
            }
        }
    }
}

ajax.displayLog=function()
{
	var log='';
	for(var i=0;i<ajax.debugLog.length;i++)
	{
		log+=ajax.debugLog[i]+"\n";
	}
	prompt("Debug Log:",log);
	//alert(log);
}

//(xmlHttpobject to send request from, array of names of variables to be posted, url to fetch, time till timeout (can be set to false for no timeout), array of values of variables to be posted, function to be run when this is initally called, function to be run when it has finished, function for if failed)
ajax.postRequest=function(fromMe,url,timeOut,namesArr,valuesArr,onStart,onFinish,onFail)
{
	
	ajax.debugLog.push("Request started: "+valuesArr[0]);
	
    if(typeof onFail != 'function')
    {
        onFail=function(){ajax.postRequest(fromMe,url,timeOut,namesArr,valuesArr,onStart,onFinish,false);}
    }
    
    if(timeOut!==false)
    {   
        //after timeout milseconds, run the fail and abort the ajax request
        var timeOutTimer=setTimeout(function(){ajax.debugLog.push("Request timed out: "+valuesArr[0]);onFail();fromMe.abort();},timeOut);
    }
    
    fromMe.onreadystatechange  = function()
    { 
		ajax.debugLog.push("Request changed readystate: "+fromMe.readyState+" "+valuesArr[0]);
        if(fromMe.readyState  == 4)
        {
			//TODO, treat blank reponses as failed.
            if(fromMe.status  == 200 && ajaxLoop.XMLhttp.responseText.length>0)
            {
				//treating no text returned as a fail - this won't fire finish and will just time out
                //clearly hasn't timed out, kill the timeout timer
				ajax.debugLog.push("Request succeeded: "+valuesArr[0]);
                clearTimeout(timeOutTimer);
                onFinish();
            } 
            else
            { 
				ajax.debugLog.push("Request failed strange: "+valuesArr[0]+" "+ajaxLoop.XMLhttp.responseText);
                //this can only catch certain types of fail - generally rare ones.
				//onFail();
				//not calling onFail from here because otherwise it gets called twice on timeout.
            }
        }
    }
    
    var postThis='';
    //generate the post thingyme
    for(var i=0;i<namesArr.length;i++)
    {
        postThis+=urlencode(namesArr[i])+"="+urlencode(valuesArr[i]);
        postThis+=namesArr.length>1 && i<namesArr.length-1 ? "&" : "";
    }
    
    fromMe.open("POST", url, true); 
    fromMe.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    //fromMe.setRequestHeader("Content-length", postThis.length);
    fromMe.setRequestHeader("Connection", "close");
    fromMe.send(postThis);
    

}