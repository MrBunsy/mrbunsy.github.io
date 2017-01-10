/*

ajaxLoop.js - designed that this is the only class on the page directly calling ajax functions.
all other classes register a wantRequest, either periodic or one off, and register a function to generate the xml
then when xml is returned, it is given to actOnXML, which dishes it out to various functions already set up classes which need them.

requires:

ajax.js
actOnXML.js
  (
  which requires
  xmlParser.js
  )
*/

var ajaxLoop=new Object();
//peridoic requests
ajaxLoop.wantPeroidic=new Array();
//one off requests
ajaxLoop.wantRequests=new Array();

ajaxLoop.loopCount=0;
ajaxLoop.callFile='ajax.php';
//array of classes for which to call a class.JSON_parsed() function after each request succeeds.
ajaxLoop.classesToLetKnow=new Array();
//if a class just wants to know about an json request once, use this array.
ajaxLoop.classesToLetKnowOnce=new Array();
//in ms
ajaxLoop.loopTime=1000;
//last XML that was attempted to be sent to the server
ajaxLoop.lastXML=false;
ajaxLoop.lastJSON=new Object();

//if a class (eg chat) wants a bit of xml to be sent off, then it registers a function to return the xml and how frequently it wants this request to go.
//howOften is done on a per x many ajax calls, ie 1=every call, 10=every 10.  SET TO 0 FOR ONE-OFF REQUEST
ajaxLoop.wantRequest=function(callMe,howOften)
{
    //function
    this.callMe=callMe;
    //int
    this.howOften=howOften;
    
    howOften == 0 ? ajaxLoop.wantRequests.push(this) : ajaxLoop.wantPeroidic.push(this);
	//return howOften == 0 ? ajaxLoop.wantRequests.length-2 : ajaxLoop.wantPeroidic.length-2;
}
/*
 * 
 */



ajaxLoop.loopMe=function()
{
	if(!(ajaxLoop.XMLhttp.readyState==0 || ajaxLoop.XMLhttp.readyState==4))
	{
		//a request is currently in progress, DO NOT CONTINUE, otherwise one-off requests will be lost!
		return;
	}
	
	/*
	var oldJSONpartNames=new Array();
	var oldJSONpartDealt=new Array();
	
	//build up a list of property names of the last JSON object
	for(property in ajaxLoop.lastJSON)
	{
		oldJSONpartNames.push(property);
		//also build an array of whether they've been dealt with yet.
		oldJSONpartDealt.push(false);
	}
	*/
	
	//blank object if dealt with, otherwise will have properties
	var sendJSON=ajaxLoop.lastJSON;
	
	//if the last ajax request failed then send the xml again
    //xml=(ajaxLoop.lastXML!==false) ? ajaxLoop.lastXML : '';
	    
    //run through periodic requests, if due
    for(var i=0;i<ajaxLoop.wantPeroidic.length;i++)
    {
        if(ajaxLoop.loopCount % ajaxLoop.wantPeroidic[i].howOften == 0)
        {
            //xml+=ajaxLoop.wantPeroidic[i].callMe();
			
			//hand a reference to the JSON object to the function, so it can add what's needed & deal with what was left from old request if there was anything
			ajaxLoop.wantPeroidic[i].callMe(sendJSON);
        }
    }
    
    //run through one-off requests
    for(var i=0;i<ajaxLoop.wantRequests.length;i++)
    {
        //xml+=ajaxLoop.wantRequests[i].callMe();
		ajaxLoop.wantRequests[i].callMe(sendJSON);
    }
    
    //clear all one-off requests
    ajaxLoop.wantRequests=new Array();
	
	//keep record of this JSON object
	ajaxLoop.lastJSON = sendJSON;

	
    if(CountObject(sendJSON) > 0)
    {
		ajax.postRequest(ajaxLoop.XMLhttp,ajaxLoop.callFile,5000,['data'],[JSON.stringify(sendJSON)],function(){},ajaxLoop.ajaxFinished,ajaxLoop.ajaxFailed);
        ajaxLoop.classesToLetKnowOnce=new Array();
    }
	
    ajaxLoop.loopCount++;
}

ajaxLoop.ajaxFinished=function()
{
	//don't try and re-send last xml
	ajaxLoop.lastJSON=new Object();

	//dish out data to all the classes that need it, and alert a bunch of classes data has been given out
	actOnJSON.dishOutStuff(JSON.parse(ajaxLoop.XMLhttp.responseText) , ajaxLoop.classesToLetKnow.concat(ajaxLoop.classesToLetKnowOnce));
}

ajaxLoop.ajaxFailed=function()
{
	//needs not do anything - a record of the last JSON request is kept by default

}

ajaxLoop.load=function()
{
    ajaxLoop.XMLhttp=ajax.getXmlHttp();
	ajaxLoop.XMLhttp.inUse=false;
    ajaxLoop.loop=setInterval(ajaxLoop.loopMe,ajaxLoop.loopTime);
}

addLoadEvent(ajaxLoop.load);