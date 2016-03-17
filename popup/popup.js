/**
This Script controls the UI page and has functions that can be called by the content script as well as the background script tp set and reset UI
*/ 
var sessionStatus;
var sessionText;
var clientKey;
var currentSwitchState;
var anonSwitch;
var downloadLogButton;

var firstTime = true;
/**
 * This Method Executes EVERYTIME Popup is clicked and is visible
 * In This Method we send an empty message to Background Script to request an update
 * We link js variables to elements on the 'popup.html'
 */
$(document).ready(function() {
    var mMessage = {
      "Recepient" : "background",
      "Action" : "RequestUIUpdate"
    };
    var b = JSON.stringify(mMessage);
    chrome.extension.sendMessage({message: b});
    sessionStatus = document.getElementById("circle");
    sessionText = document.getElementById("session_text");
    anonSwitch = document.getElementById("anon");
    downloadLogButton = document.getElementById("dloadbutton");
    anonSwitch.onclick = toggleSwitch;
    downloadLogButton.onclick = downloadLog;
});

function resetUI(){
  sessionStatus.style.backgroundColor = "#FF0000";
  sessionText.innerHTML = "Session in Not Active";
}

/**
 * Method is a listener to Messages from the Background Script
 * It filters out messages meant for this script (popup.js) and calls
 * an Update UI function
 */ 
chrome.runtime.onMessage.addListener(
 function(request, sender) {
    var messageReceived = JSON.parse(request.message);
    if(!isMyMessage(messageReceived,"popup")){return;}
    clientKey=messageReceived['ClientKey'];
    currentSwitchState=messageReceived['AnonButton'];
    if(currentSwitchState){
      var toggleVar = anonSwitch.onclick;
      anonSwitch.onclick= null;
      anonSwitch.click();
      anonSwitch.onclick = toggleVar;
    }
    if(messageReceived['Status']){
      sessionText.innerHTML = "The Session is Currently Active";
      sessionStatus.style.backgroundColor = "#329832";
    } 
});

/** Download Log Buttons */

function downloadLog(){
  try{PrepareReadAndDownload();}
  catch(err){}
}


/* This Method Toggles The Switch */
function toggleSwitch(){
  var mMessage = {"Recepient" : "background", "Action" : "AnonButton"};
  if(currentSwitchState === true){
    mMessage['Status']= false;
    currentSwitchState = false;
  }
  else {
    mMessage['Status']= true;
    currentSwitchState = true;
  }
  var b = JSON.stringify(mMessage);
  chrome.extension.sendMessage({message: b});
}

/*
    FIlE READ FUCNTIONS
*/

function PrepareReadAndDownload(){
	window.webkitStorageInfo.requestQuota(PERSISTENT, 50*1024*1024, function(grantedBytes) {
	window.webkitRequestFileSystem(PERSISTENT, grantedBytes, ReadAndDownload, errorHandler);
		}, function(e) {
			console.log('Error', e);
	});
}

function ReadAndDownload(fs){
	 fs.root.getFile('KnockKnock.txt', {}, function(fileEntry) {
    // Get a File object representing the file,
    // then use FileReader to read its contents.
    fileEntry.file(function(file) {
       var reader = new FileReader();
       reader.onloadend = function(e) {
         var stringLoaded = this.result;
         if(stringLoaded===""){console.log("EmptyFile"); alert("Empty Log");return;}
         //Read From File
         var arrOfEntries = stringLoaded.split("|");
         console.log(arrOfEntries);
         var data = [];
         for(var i=0; i<arrOfEntries.length; i++){
           var entry;
           try{entry = JSON.parse(arrOfEntries[i]);}catch(err){continue;}
           DeAnonymizeContent(entry,clientKey);
           data.push(entry);
         }
         
        
         //Download
         data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
         $(downloadLogButton).attr("href", "data:" + data);
         $(downloadLogButton).attr("download",  "Log.txt");
         
         if(firstTime){
           downloadLogButton.click();
           firstTime = false;
         }
         
       };
       reader.readAsText(file);
    }, errorHandler);

  	}, errorHandler);
}
