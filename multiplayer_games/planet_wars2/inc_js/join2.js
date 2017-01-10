var joinGame=new Object();
var chat;
var sounds;

joinGame.load=function()
{
    joinGame.ajaxLoop = new AjaxLoopClass('../ajax.php',1000);
	joinGame.players = new PlayersClass(5,false,'people_in_room','players',false,false,false,false,joinGame.ajaxLoop);
	//pre-game options and stuff like starting
	joinGame.preGame = new PreGameClass(joinGame.ajaxLoop,false);
	joinGame.planetWarsPreGame=new PlanetWarsPreGameClass(false, "game_settings_form", "planet_wars_div", joinGame.ajaxLoop)
	joinGame.userPrefs = new UserPrefsClass();
	chat = new ChatClass('chat_input_box_'+rand, 'chat_messages' ,joinGame.ajaxLoop, joinGame.userPrefs);
	planet_wars.load();
	
	joinGame.ajaxLoop.loadInitialAJAX(joinGame.ajaxLoop.classesToLetKnow);
	
	sounds = new sounds('join')
}

myAddEvent(window,'onload',joinGame.load);