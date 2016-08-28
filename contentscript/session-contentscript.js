/*
File Structure :
"lib/jquery-2.2.0.js", 
"lib/common-functions.js",
"lib/jquery.appear.js",
"contentscript/global-variables.js",
-->"contentscript/session-contentscript.js", 
"contentscript/silent-detection-script.js", 
"contentscript/nonsilent-detection-script.js"

	This is the Maintains Session for Facebook Page
*/


/* ------- Session Maintainence ------- */
var idleTime = 0;
var restartFlag = false;
var intervalID;
var isActive = false;

// Called when Content Script is Loaded 
$(document).ready(function() {
	SessionStart();
});

function SessionStart(){
  tabID=randomString(10); // Create Tab ID 
	intervalID = setInterval(timerIncrement, 1000*60);
	isActive = true;
	//check for activity every minute . If more than 5 minutes, Session Ends
	console.log("Tab Started");
  CreateStartSessionEvent();
}

function timerIncrement() {
    idleTime = idleTime + 1;
    if (idleTime > 10) { // 10 minutes
        console.log("Tab Ended");
        CreateEndSessionEvent();
        clearInterval(intervalID);
        restartFlag=true;
    }
}

$(this).mousemove(function (e) {
	idleTime = 0;
	//if the session was killed due to inactivity then reset the restartFlag and call SessionStart
	if(restartFlag){
		restartFlag=false;
		SessionStart();
	} 
});

$(this).keypress(function (e) {
    idleTime = 0;
    //if the session was killed due to inactivity then reset the restartFlag and call SessionStart
	if(restartFlag){
		restartFlag=false;
		SessionStart();
	}
});

//Called before window is deleted to commit log to file
window.onbeforeunload = function (e) {
    CreateEndSessionEvent();
};


/* ------- Event Creation Functions ------- */

function CreateStartSessionEvent(){
  	var date = Date.now();
  	var a = {
  	"Recepient" : "background",
	  "Timestamp" : date,
	  "TabID" : tabID,
	  "ActionClass" : "Session",
	  "ActionSubClass" : "StartTab",
	  "OpenChatTabs" : numOfChatbox(),
	  "Content" : {}
	};
	var b = JSON.stringify(a);
	console.log(b);
	chrome.extension.sendMessage({message: b});
}

function CreateEndSessionEvent(){
    var date = Date.now();
    var a = {
      "Recepient" : "background",
      "Timestamp" : date,
	    "TabID" : tabID,
	    "ActionClass" : "Session",
	    "ActionSubClass" : "CloseTab",
	    "OpenChatTabs" : numOfChatbox(),
      "Content" : {}
	  };
	  var b = JSON.stringify(a);
	  console.log(b);
		chrome.extension.sendMessage({message: b});
}

/* Find Open ChatBox Function */
function numOfChatbox(){
  var array = $(document).find('.fbDockChatTabFlyout');
  return array.length;
}