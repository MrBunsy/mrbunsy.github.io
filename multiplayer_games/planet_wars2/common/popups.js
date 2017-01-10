/**
 * @author Antony
 */

var popups = {}

/**
 * An array of all open popups
 * @var array
 */
popups.openPopups = [];

/**
 * The string to prepend to popup ids
 * @var string
 */
popups.popupIdPre = '_popup_';

/**
 * Creates a new popup and registers it in the array of popups
 * @param string msg the content of the new popup
 */

popups.create = function(msg,width,height) {
	var msgdiv = document.createElement('div');
	var idIndex = popups.openPopups.length ? popups.openPopups[popups.openPopups.length-1]+1 : 0; //max value is at end
	msgdiv.id = popups.popupIdPre+idIndex;
	popups.openPopups.push(idIndex);
	msgdiv.style.position = 'absolute';
	msgdiv.style.top = mouse.y + 20 + 'px';
	msgdiv.style.left = mouse.x + 20 + 'px';
	msgdiv.style.height = (typeof height == 'undefined' ? 100 : height)+'px';
	msgdiv.style.width = (typeof width == 'undefined' ? 100 : width)+'px';;
	msgdiv.style.border = '1px solid black';
	document.body.appendChild(msgdiv);
}

popups.close = function(idIndex) {
	document.removeChild(popups.popIdPre+idIndex);
	for (var i in popups.openPopups) {
		if (popups.openPopups[i] == idIndex) {
			popups.openPopups.splice(i,1);
		}
	}
	popups.openPopups.remove(idIndex);
}

popups.closeAll = function() {
	for (var i in popups.openPopups) {
		document.removeChild(popups.popupIdPre);
	}
	popups.openPopups = [];
}

mouse.addEvent('onclick');
