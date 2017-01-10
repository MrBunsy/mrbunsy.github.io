//controls the game setting box in pw join/host

var PlanetWarsPreGameClass = function(host, settingsForm, mapDiv, ajaxLoop)
{
	var thisObject = this;
	
	//is this player the host?
	this._host = host;
	//div where we can do stuff
	this._settingsForm = document.getElementById(settingsForm);
	this._mapDiv = mapDiv;
	this._ajaxLoop = ajaxLoop;
	this._roomSizeSpan = document.getElementById('room_size');
	
	this._lastMap=0;
	this._lastSettingsId=0;
	/*
	//add a form to this box
	this._settingsForm = document.createElement("form");
	this._settingsBox.appendChild(this._settingsForm);
	
	//add html to this form
	var html = "Anonymous Powerups: <input type='checkbox' /> <br /><input type='submit' value='change' />"
	this._settingsForm.innerHTML = html;
	
	//get stuff from the form
	this._anonymousPowerups = this._settingsForm.elements[0];
	
	this._settingsForm.action = "javascript:;";
	*/
	
	//host and join both have access to the form, but for join the form is disabled
	for (var i = 0; i < this._settingsForm.elements.length; i++) 
	{
		switch (this._settingsForm.elements[i].name)
		{
			case 'anonymousPowerups':
				this._anonymousPowerups = this._settingsForm.elements[i];
				break;
			case 'rounds':
				this._rounds = this._settingsForm.elements[i];
				break;
			case 'ranked':
				this._ranked = this._settingsForm.elements[i];
				break;
		}
	}
		
	this.submitForm = function()
	{
		//send off settings to server
		new thisObject._ajaxLoop.wantRequest(thisObject.sendSettings, 0);
	}
	
	if (this._host) 
	{
		//when form is changed, send off the new settings!
		this._anonymousPowerups.onclick = this.submitForm;
		this._ranked.onclick = this.submitForm;
		this._rounds.onchange = this.submitForm;
		this._settingsForm.onsubmit = this.submitForm;	
	}
	
	
	
	this.sendSettings=function(thisJSON)
	{
		thisJSON.game_settings=new Object();
		thisJSON.game_settings.anonymousPowerups = thisObject._anonymousPowerups.checked;
		thisJSON.game_settings.rounds = thisObject._rounds.value;
		thisJSON.game_settings.ranked = thisObject._ranked.checked;
	}
	
	this.askForSettings=function(thisJSON)
	{
		thisJSON.game_settings_request=new Object();
		thisJSON.game_settings_request.lastIndex=thisObject._lastSettingsId;
	}
	
	this.askForMap=function(thisJSON)
	{
		thisJSON.map_request=new Object();
		thisJSON.map_request.lastIndex=thisObject._lastMap;
	}
	
	if(!this._host)
	{
		//if not the host, ask for new maps and settings regularily!
		new this._ajaxLoop.wantRequest(this.askForMap,1);
		new this._ajaxLoop.wantRequest(this.askForSettings,1);
	}
	
	this.newMap = function()
	{
		var newNumberOfPlayers = parseInt(document.getElementById('optionPlayers').value);
		this._roomSizeSpan.innerHTML = newNumberOfPlayers;
		planet_wars.generateMap(3 + planet_wars.numberOfPlayers, newNumberOfPlayers, 1, 1, 1, 0, 0);
		planet_wars.editorTidyUpShips();
		Render.renderViewport(0);
		
		this.uploadMap();
	}

	this.openEditor=function()
	{
		planet_wars.openEditor(1,[],['planet_wars_editor','planet_wars_editor_container']);
	}
	
	this.uploadMap=function()
	{
		new this._ajaxLoop.wantRequest(planet_wars.mapToJSON, 0);
	}
	
	ActOnJSONClass.prototype.parse_game_settings = function(settings)
	{
		//update settings to what is on the server
		thisObject._anonymousPowerups.checked = settings.anonymousPowerups;
		thisObject._rounds.value = settings.rounds;
		thisObject._lastSettingsId = settings.settingsIndex;
		thisObject._ranked.checked = settings.ranked;
	}
	
	//should only be called once by initial_ajax for host
	ActOnJSONClass.prototype.parse_map = function(map)
	{
		//no map in db, upload one generated just now
		if (typeof map.mapId == 'undefined') 
		{
			if(thisObject._host)
			{
				thisObject.newMap();
			}
		}
		else 
		{
			//was already a map before loading this map, load it up.
			planet_wars.loadJSONMap(map);
			
			Render.renderViewport(0);
//			selectValue('optionPlayers', planet_wars.players.length);
		}
	}
	
	
	
}
