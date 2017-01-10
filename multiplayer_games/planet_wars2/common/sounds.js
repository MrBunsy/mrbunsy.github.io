/**
 * Object for dealing with sounds. Responsible for init-ing the soundmanager2 library, loading up appropriate sounds, and
 * providing methods that other functions can call to make particular sounds, eg chat()
 * It is also responsible for knowing which pages need what sounds, and loading them as appropriate
 * 
 * How it all works...
 * soundManager requires that there's a global variable called 'soundManager' hanging around (otherwise the swf doesn't know how to
 * communicate with soundManager). So that's sitting around. But it's created by the soundManager libraries.
 * 
 * Normally soundManager will load on page load. However, we have a setup where this class is instantiated at page load, and so
 * does not have a chance to configure soundManager (tell it where the swf is, etc) before soundManager itself loads.
 * Therefore I've added SM_DEFER = true to the top of the soundManager lib, and use this.init() to instantiate soundManager, configure it,
 * then initialise.
 * 
 * SoundManager then goes off and does its own thing for a bit: loads up the swf, blah de blah, and calls an onload handler when it's finished.
 * This handler is linked to this.smOnload, which in turn loads up the mp3s specified by the roomName of the room that we're in...
 * 
 * (I don't want to load up all mp3s all the time because of caching overheads).
 * 
 * Each mp3 is given an ID in this._sounds
 * 
 * @author Antony
 * @param string roomName the name of the room we're in
 */
var sounds = function(roomName) {
	/**
	 * A strong containing the name of the room we're in
	 * @var string
	 */
	this._roomName = roomName;
	/**
	 * The path back to /core, eg ../../. Will be set to the right value from this._paths in this.init()
	 * @var string
	 */
	this._path;
	/**
	 * Path, relative to root, where MP3s are stored
	 * @var string
	 */
	this._mp3path = 'common/sounds/';
	/**
	 * A list of sounds - ID against mp3 name (in the this._mp3path folder)
	 * @var object
	 */
	this._sounds = {
		'newmsg': 'msg.mp3',
	};
	/**
	 * Hash of which room names have what paths
	 * @var object
	 */
	this._paths = {
		'lobby': '../',
		'host': '../../',
		'join': '../../',
		'play': '../../'
	};
	/**
	 * A list of which sounds should be loaded for which pages
	 */
	this._roomSounds = {
		'lobby': ['newmsg'],
		'host': ['newmsg'],
		'join': ['newmsg'],
		'play': ['newmsg']
	};
	/**
	 * Whether or not soundManager has loaded
	 */
	this._smLoaded = false;
	
	
	/**
	 * Constructor. Instantiates and configures the soundManager object, and hooks in the onload the inits
	 */
	this._init = function() {
		if (typeof this._paths[this._roomName] == undefined) {
			alert('Unknown roomName passed to sounds');
			return;
		}
		this._path = this._paths[this._roomName];
		this._mp3path = this._path+this._mp3path;
		soundManager = new SoundManager();
		soundManager.url = this._path+'common/swf/';
		soundManager.onload = function() {sounds.smOnload();};
		soundManager.beginDelayedInit();
	}
	/**
	 * Sound manager onload. Loads up the sounds specified for this room
	 */
	this.smOnload = function() {
		//load up the sounds
		var soundId;
		var soundURL;
		for (var i in this._roomSounds[this._roomName]) {
			soundId = this._roomSounds[this._roomName][i];
			soundURL = this._mp3path+this._sounds[this._roomSounds[this._roomName][i]]
			soundManager.createSound({
				id: soundId, 
				url: soundURL,
				autoLoad: true,
			});
		}
		this._smLoaded = true;
		
	}
	
	/**
	 * Called to play particular sounds
	 * @param string name the name of the sound in this._sounds
	 */
	this.play = function(name) {
		if (typeof this._roomSounds[this._roomName][name] == undefined) {
			alert('Tried to play unknown sound ' + name);
			return;
		}
		if (!this._smLoaded)
			return;
		soundManager.play(name);
	}
	
	/**
	 */
	this._init();
	
}
