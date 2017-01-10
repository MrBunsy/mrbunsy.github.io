var xmlhttp = null;

if (window.XMLHttpRequest) {
  // If IE7, Mozilla, Safari, and so on: Use native object
  xmlhttp = new XMLHttpRequest();
}
else
{
  if (window.ActiveXObject) {
     // ...otherwise, use the ActiveX control for IE5.x and IE6
     xmlhttp = new ActiveXObject('MSXML2.XMLHTTP.3.0');
  }
}


function PHPtoelement(fragment_url, element_id) 
{
var element = document.getElementById(element_id);

element.innerHTML = "Loading...";
xmlhttp.open("GET", fragment_url);
xmlhttp.onreadystatechange = function() {
if (xmlhttp.readyState == 4 && xmlhttp.status == 200) 

{element.innerHTML = xmlhttp.responseText;}
}
xmlhttp.send(null);

}

var xmlvar;

function PHPtoJS(fragment_url) 
{
xmlhttp.open("GET", fragment_url);
xmlhttp.onreadystatechange = function() {
if (xmlhttp.readyState == 4 && xmlhttp.status == 200) 
{xmlvar = xmlhttp.responseText;
eval(xmlvar);}}
xmlhttp.send(null);
}

var phpvariable

function PHPtovariable(fragment_url) 
{
xmlhttp.open("GET", fragment_url);
xmlhttp.onreadystatechange = function() {
if (xmlhttp.readyState == 4 && xmlhttp.status == 200) 
{phpvariable = xmlhttp.responseText;}}

xmlhttp.send(null);

}

function runPHP(fragment_url) 
{
xmlhttp.open("GET", fragment_url);
xmlhttp.send(null);
}



