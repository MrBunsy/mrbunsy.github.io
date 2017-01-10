var actOnJSON=new Object();

//what to do once the xmlParser.XML object has been built.
//this function needs to be given the object contatining all the functions to handle it, eg planet_wars or chat
actOnJSON.dishOutStuff=function(JSONreceived , arrayOfObjectsToAlert)
{
    if(typeof JSONreceived == 'object')
    {
		for(var property in JSONreceived)
		{
			try
			{
				//act on it!  call function eg actOnJSON.parse_Error()
				actOnJSON['parse_' + property](JSONreceived[property]);
				
			}
			catch(e)
			{
				//alert("function "+'parse_' + JSONreceived+" does not exist");
			}
		}
		/*
        for(var i=0;i<JSONreceived.data.length;i++)
        {
			try
			{
				//act on it!  call function eg actOnXML.parse_Error()
				actOnJSON['parse_' + xmlParser.XML.data[i].type](xmlParser.XML.data[i]);
				
			}
			catch(e)
			{
				alert("function "+'parse_' + xmlParser.XML.data[i].type+" does not exist");
			}
			
        }
        */
    }
    
    //call final functions in case it's needed
    for(var i=0;i<arrayOfObjectsToAlert.length;i++)
    {
        arrayOfObjectsToAlert[i].JSON_parsed();
    }
    
}

actOnJSON.parse_error=function(error)
{
    alert(error.toSource());
    
    for(var i=0;i<error.errorMessage.length;i++)
        {
    	    //alert("ERROR! "+error.errorMessage[i].errorMessage)
    	}
}

actOnJSON.loadIntialAjax=function()
{
	if(typeof(initial_ajax)!=="undefined")
	{
		//deal with the initial ajax on a page
		actOnJSON.dishOutStuff(JSON.parse(initial_ajax),ajaxLoop.classesToLetKnow);
	}
}

//this messes a lot of stuff up by being run before other stuff is set up
//myAddEvent(window,'onload',actOnJSON.loadIntialAjax);