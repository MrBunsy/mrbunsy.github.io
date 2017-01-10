var xmlhttp=false;
var phpinprogress = 0;
var whattorepeat;
var repeated = 0;


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
/*
if (!xmlhttp && typeof XMLHttpRequest!='undefined')
{xmlhttp = new XMLHttpRequest();}
*/
function PHPtoelement(fragment_url, element_id) 
{
if (phpinprogress == 0)
{
phpinprogress = 1
var element = document.getElementById(element_id);
xmlhttp.open("GET", fragment_url);
xmlhttp.onreadystatechange = function() {
if (xmlhttp.readyState == 4 && xmlhttp.status == 200) 

{element.innerHTML = xmlhttp.responseText;
phpinprogress = 0}
}
xmlhttp.send(null);
}else{
whattorepeat = "PHPtoelement("+fragment_url+","+element_id+")";
var repeat = setTimeout("'"+whattorepeat+"'", 20)
}

}

var xmlvar;

function PHPtoscript(fragment_url) 
{
if (phpinprogress == 0)
{
phpinprogress = 1
xmlhttp.open("GET", fragment_url);
xmlhttp.onreadystatechange = function() {
if (xmlhttp.readyState == 4 && xmlhttp.status == 200) 
{xmlvar = xmlhttp.responseText;
eval(xmlvar);
phpinprogress = 0}}
xmlhttp.send(null);
}else{
whattorepeat = "PHPtoscript("+fragment_url+")";
var repeat = setTimeout("'"+whattorepeat+"'", 40)
}

}

function runPHP(fragment_url) 
{
if (phpinprogress == 0)
{
phpinprogress = 1
xmlhttp.open("GET", fragment_url);

xmlhttp.onreadystatechange = function() {
if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {phpinprogress = 0}}

xmlhttp.send(null);

}else{
whattorepeat = "runPHP("+fragment_url+")";
var repeat = setTimeout("'"+whattorepeat+"'", 40)
}
}