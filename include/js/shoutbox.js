/* 
 * Copyright Luke Wallin 2012
 */

function shoutViewAll(){
    //expand the shoutbox
     $.post('/function/getMoreShouts',updateShouts);
}

function shoutWindow(){
    //open a window to shout
    $("#shoutboxDialogue").html("Loading...");
    $.post('/function/shoutWindow',shoutHandleData);
}

function shoutHandleData(data){
    $("#shoutboxDialogue").html(data);
}

function updateShouts(data){
    $('#shouts').html(data)
}

function shoutSuccess(){
    $.post('/function/getShouts',updateShouts);
    //close the window after a short pause
    setTimeout(function(){$("#shoutboxDialogue").html('')},2000);
}

function submitShout(){
    //fire off the form with AJAX
    $.post('/function/shout',$("#shoutform").serialize(),shoutHandleData);
    $("#shoutboxDialogue").html("Sending...");
}

function closeShoutWindow(){
    $("#shoutboxDialogue").html('');
}