/* requires common.js */

var xmlParser=new Object();

xmlParser.XML=new Object();

//uses built in browser functions to turn xml string into an XML DOM thingy. nicked straight from W3schools
xmlParser.loadXMLString=function(txt) 
{
try //Internet Explorer
  {
  xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
  xmlDoc.async="false";
  xmlDoc.loadXML(txt);
  return(xmlDoc); 
  }
catch(e)
  {
  try //Firefox, Mozilla, Opera, etc.
    {
    parser=new DOMParser();
    xmlDoc=parser.parseFromString(txt,"text/xml");
    return(xmlDoc);
    }
  catch(e) {alert(e.message)}
  }
return(null);
}

//function turns an XML string into a much tidier javascript object.
xmlParser.parseXML=function(text)
{

//kills whitespaces where not wanted - stops FF being irritating by creating textnodes where there is absolutely NO NEED FOR THEMARGH.

text=str_replace("\n","",text)
text=str_replace("\r","",text)
text=str_replace("\t","",text)


//text=text.replace("/\n/g",'');

//alert(text)
xmlParser.XML=new Object();
//xmlParser.buildArrays();
//alert(text)
var xmlDoc=xmlParser.loadXMLString(text);

recurseMe=function(theseNodes)
  {
	//alert(theseNodes)
	var xml=new Object();
	
	
	//sort out attributes
	if(typeof theseNodes[0] != 'undefined')
	  {
		try
		  {
			var tempAttributes=theseNodes[0].parentNode.attributes;
			}
		catch(err)
		  {
			tempAttributes=null;
			}
		if(tempAttributes!==null)
  		{
  		for(var n2=0;n2<tempAttributes.length;n2++)
  		  {
  			xml[tempAttributes[n2].nodeName]=tempAttributes[n2].nodeValue;
  			}
  		}
		}
	
	for(var n=0;n<theseNodes.length;n++)
	  {
		switch(theseNodes[n].nodeType)
		  {
			case 1://element
			  if(theseNodes[n].hasChildNodes())// && (theseNodes[n].childNodes.length > 1 || theseNodes[n].childNodes[0].type!==3)//has child nodes more than just a single text node
				  {
//					alert(typeof xml[theseNodes[n].nodeName])//theseNodes[n].nodeName)
					if(isArray(xml[theseNodes[n].nodeName]))
					  {
						//alert('array')
						//the xml object variable called this node's name is an array
						xml[theseNodes[n].nodeName].push(recurseMe(theseNodes[n].childNodes));
						}
					else if(typeof xml[theseNodes[n].nodeName] == "object")
					  {
						//alert('object')
						// is an object, but needs to become an array because there are more than one of these nodes
						var tempObj=xml[theseNodes[n].nodeName]
						xml[theseNodes[n].nodeName]=new Array();
						xml[theseNodes[n].nodeName].push(tempObj)
						xml[theseNodes[n].nodeName].push(recurseMe(theseNodes[n].childNodes));
						}
					else
					  {
						//alert('first')
						//first instance of this nodeName
						
						//old style: create an object - now used for text nodes
						if(theseNodes[n].childNodes[0].nodeType==3)
  						{
    					xml[theseNodes[n].nodeName]=recurseMe(theseNodes[n].childNodes);
  						}
  					else
  						{
  						//new style: everything whichisn't a text node is in an array
  						xml[theseNodes[n].nodeName]=new Array();
  						xml[theseNodes[n].nodeName].push(recurseMe(theseNodes[n].childNodes));
  						}
						}
					}
				else
				  {
					//doesn't have children - don't think this is ever used either.
					
					}
			break;
			case 2:
			  //attribute - this is never used
//				alert('atrib')
			  xml[theseNodes[n].nodeName]=theseNodes[n].nodeValue;
			break;
			case 3:
			  //text
				//ml['text']=theseNodes[n].nodeValue;
				xml=theseNodes[n].nodeValue;
			break;
			}
		
		
		}
	return xml;
	}

	

xmlParser.XML=recurseMe(xmlDoc.documentElement.childNodes);

//alert(xmlParser.XML.toSource());

}


/*

Node type 	NodeType
Element 	  1
Attribute 	2
Text 				3
Comment 		8
Document 		9

*/
	