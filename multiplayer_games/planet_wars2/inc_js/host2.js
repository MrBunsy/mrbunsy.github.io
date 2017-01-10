var room=new Object();
var chat;
var sounds;

room.load=function()
{
	room.ajaxLoop = new AjaxLoopClass('../ajax.php',1000);
	room.players = new PlayersClass(5,false,'people_in_room','players',false,false,'num_players_here','num_players_lobby',room.ajaxLoop);
	//pre-game options and stuff like starting
	room.preGame = new PreGameClass(room.ajaxLoop,true);
	room.userPrefs = new UserPrefsClass();
	
	chat = new ChatClass('chat_input_box_'+rand, 'chat_messages' ,room.ajaxLoop, room.userPrefs);
	
	planet_wars.load();
	
	room.planetWarsPreGame=new PlanetWarsPreGameClass(true, "game_settings_form", "planet_wars_div", room.ajaxLoop)
	
	room.ajaxLoop.loadInitialAJAX(room.ajaxLoop.classesToLetKnow);
	
	sounds = new sounds('host');
}

myAddEvent(window,'onload',room.load);