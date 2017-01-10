//no depandancies, designed to have more methods added using prototype

var ActOnJSONClass = function()
{
	/**
	 * Lil toggle to say whether or not we're doing the initial ajax
	 * @var bool
	 */
	this.doingInitialAjax = false;
	
	//what to do once the xmlParser.XML object has been built.
	//this function needs to be given the object contatining all the functions to handle it, eg planet_wars or chat
	this.dishOutStuff = function(JSONreceived, arrayOfObjectsToAlert)
	{
	
		if (typeof JSONreceived == 'object') 
		{
			for (var property in JSONreceived) 
			{
				if (typeof(this['parse_' + property]) == "undefined") 
				{
					alert('method parse_' + property + " not defined!");
				}
				else 
				{
					try 
					{
						//act on it!  call function eg this.parse_Error()
						this['parse_' + property](JSONreceived[property]);
						
						
					} 
					catch (e) 
					{
						alert("method " + 'parse_' + property + " threw an exception" + e);
					}
				}
			}
			
		}
		
		//call final functions in case it's needed
		for (var i = 0; i < arrayOfObjectsToAlert.length; i++) 
		{
			arrayOfObjectsToAlert[i].JSON_parsed();
		}
		
	}
	
	this.parse_error = function(error)
	{
		for(var p in error)
		{
			alert(error[p]);
		}
		/*
		alert(error.toSource());
		
		for (var i = 0; i < error.errorMessage.length; i++) 
		{
			//alert("ERROR! "+error.errorMessage[i].errorMessage)
		}
		*/
	}
	
	this.loadIntialAjax = function(letKnowArray)
	{
		if (typeof(initial_ajax) !== "undefined") 
		{
			if(typeof(letKnowArray)=="undefined")
			{
				letKnowArray=new Array();
			}
			this.doingInitialAjax = true;
			//deal with the initial ajax on a page
			this.dishOutStuff(JSON.parse(htmlspecialchars_decode(initial_ajax)), letKnowArray);
			this.doingInitialAjax = false;
		}
	}
}