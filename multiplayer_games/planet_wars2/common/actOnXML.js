var actOnXML=new Object();

//what to do once the xmlParser.XML object has been built.
//this function needs to be given the object contatining all the functions to handle it, eg planet_wars or chat
actOnXML.dishOutStuff=function(arrayOfObjects)
{
    //store xml from xml parser in a more luke-friendly format.
    
    if(typeof xmlParser.XML.data != 'undefined')
    {
        for(var i=0;i<xmlParser.XML.data.length;i++)
        {
            //act on it!  call function eg actOnXML.parse_Error()
            actOnXML['parse_'+xmlParser.XML.data[i].type](xmlParser.XML.data[i])
           
        }
    }
    
    //call final functions in case it's needed
    for(var i=0;i<arrayOfObjects.length;i++)
    {
        arrayOfObjects[i].XML_parsed();
    }
    
}

actOnXML.parse_error=function(error)
{
    alert(error.toSource());
    
    for(var i=0;i<error.errorMessage.length;i++)
        {
    	    //alert("ERROR! "+error.errorMessage[i].errorMessage)
    	}
}