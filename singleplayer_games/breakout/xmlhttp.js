var xmlhttp;
try
{
// Firefox, Opera 8.0+, Safari
xmlhttp=new XMLHttpRequest();
}
catch (e)
{
// Internet Explorer
try
{
xmlhttp=new ActiveXObject("Msxml2.XMLHTTP");
}
catch (e)
{
try
{xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");}
catch (e)
{alert("Your browser does not support AJAX!");}

}
}