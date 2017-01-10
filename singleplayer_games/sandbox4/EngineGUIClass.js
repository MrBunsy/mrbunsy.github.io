/**
 * @author Luke
 */
var EngineGUIClass = function(canvasTag, canvasSize, messageWindowsDiv){

    var thisObject = this;
    
    //div to place emssagewindows inside
    this._messageWindowsDiv = messageWindowsDiv;
    this._messageWindowsDiv.style.display = "block";
    this._canvasTag = canvasTag;
    //size of main viewport in real pixels
    this._canvasSize = canvasSize;
    
    this._messageWindows = new Array();
    
    this.newMessageWindow = function(html, size){
        return new thisObject.MessageWindow(html, size);
    }
    
    this.MessageWindow = function(html, size){
    
        var thisMessageWindow = this;
        
        //size is as fraction of main canvas
        this.size = size;
        this.html = html;
        
        this.messageDiv = document.createElement("div");
        this.messageSpan = document.createElement("span");
        
        thisObject._messageWindowsDiv.appendChild(thisMessageWindow.messageDiv);
        this.messageDiv.appendChild(this.messageSpan);
        
        //form for extra stuff
        this.form = document.createElement("form");
        this.messageDiv.appendChild(this.form);
        
        //form for the close button
        this.messageDivForm = document.createElement("form");
        this.messageDiv.appendChild(this.messageDivForm);
        this.messageDivForm.innerHTML = "<br><input type='button' name='closeMessage' value='Close Window' style='margin-left:35%;'/>";
        
        
        this.messageDiv.style.display = "none";
        this.messageDiv.style.position = "absolute";
        this.messageDiv.style.backgroundColor = "#FFFFFF";
        this.messageDiv.style.border = "solid black 1px";
        this.messageDiv.style.zIndex = 3;
        
        
        this.messageDiv.style.left = (findPosX(thisObject._canvasTag) + thisObject._canvasSize[0] * (1 - thisMessageWindow.size) / 2) + "px";
        this.messageDiv.style.top = (findPosY(thisObject._canvasTag) + thisObject._canvasSize[1] * (1 - thisMessageWindow.size) / 2) + "px";
        this.messageDiv.style.width = (thisObject._canvasSize[0] * thisMessageWindow.size) + "px";
        this.messageDiv.style.height = (thisObject._canvasSize[1] * thisMessageWindow.size) + "px";
        
        this.messageSpan.innerHTML = thisMessageWindow.html;
        this.close = function(){
            thisMessageWindow.messageDiv.style.display = "none";
        }
        
        this.messageDivForm.closeMessage.onclick = this.close;
        
        this.open = function(){
            for (var i = 0; i < thisObject._messageWindows.length; i++) {
                thisObject._messageWindows[i].close();
            }
            thisMessageWindow.messageDiv.style.display = "block";
        }
        
        thisObject._messageWindows.push(this);
    }
    
}
