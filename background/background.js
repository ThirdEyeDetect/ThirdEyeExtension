/*
  Background Script is a persistent script to maintain fileIO 
*/

/* Global Variables */

var facebookURL = "https://www.facebook.com/";
var sessionKey = "none";
var tabsOpened = 0;
var clientKey = "";
var flushFunctionId = 0;
var anonButtonStatus = false;

/* Temporary Container Variables */
var temporaryEventHolder = [];
var temporaryLog = "";

/*
  When Extension is activated (for the first time)
  Load popup.js
  Generate client key
*/
$(document).ready(function() {
  //$.getScript("popup.js", function(){});
  var get_Callback = function(return_value){ 
    clientKey = isEmpty(return_value) ? randomString(16) : return_value['clientKey'];
    chrome.storage.sync.set({'clientKey': clientKey});
  };
  chrome.storage.sync.get('clientKey', get_Callback);
  //console.log("Client Key is " + clientKey);
});

/* 
Chrome API Listener Runs at Every received Message 
Main Logging Function Listens to Messages from Various origins and performs actions 
*/
chrome.extension.onMessage.addListener(function(request, sender){
  var incomingMessage = JSON.parse(request.message);
  //console.log(incomingMessage);
  
  if(!isMyMessage(incomingMessage,"background")){return;}
 
  /*This message was sent by PopUp UI requesting latest information*/
  /* TODO ADD SPACE */
  if(endsWith(sender.url,"popup.html")){
    if(incomingMessage['Action']=="RequestUIUpdate"){
      var updateObject = {"ClientKey": clientKey, "Space" : 0, "Recepient": "popup", "Status" : (tabsOpened>0), "AnonButton":anonButtonStatus}; 
      chrome.extension.sendMessage({message: JSON.stringify(updateObject)});
    }
    else if (incomingMessage['Action']=="AnonButton"){
      anonButtonStatus = incomingMessage['Status'];
      console.log(incomingMessage['Status'])
    }
    
    return;
  }
  
  /*This message was sent by us, the backgroundscript so ignore*/
  if(endsWith(sender.url,"_generated_background_page.html")){return;}
  
  /*This message was a stray message. Logging Sender*/
  if(!sender.tab){return;}
  
  /* Message sent my Content Script */
  if(incomingMessage["ActionClass"] == "Session"){
    if(incomingMessage["ActionSubClass"] == "StartTab"){
      //Session Start for new Session : Initialize Log Variable
      if(tabsOpened <= 0){CreateNewSession();}
      tabsOpened++;
    }
    else if(incomingMessage["ActionSubClass"] == "CloseTab"){
      //Handle Session End
      tabsOpened--;
      if(tabsOpened <= 0){KillSession();}
    }
  }
  /* Updating Stats in stats.js */
  UpdateStats(incomingMessage);
  
  /* Placing in Temporary Event Array Pending Network Transfer */
  incomingMessage['SessionKey'] = sessionKey;
  if(anonButtonStatus){
    AnonymizeContent(incomingMessage,clientKey);
  }
  temporaryEventHolder.push(incomingMessage);
});




/*
CreateNewSession():
1. Creates new Session Key
2. Starts the Send to Network Function 
*/
function CreateNewSession(){
  console.log("Starting New Session");
  sessionKey = guid();
  flushFunctionId = setInterval(FlushToNetworkAndLog, 1000*5);
}

/*
KillSession()
1. Ensures Tabs Opened are 0 (if there are any repeats of Tab Session End, Minimum Tab Value remains 0)
2. Resets Stats
3. Clears The Network Call Async Call
*/
function KillSession(){
  console.log("Ending Session");
  tabsOpened = 0;
  resetStats();
  clearInterval(flushFunctionId);
}

/* Flush to Network and Local Log */
function FlushToNetworkAndLog(){
  
  // If Array is empty, We dont need to send a call
  if(temporaryEventHolder.length === 0){return;}
  
  //ELSE Flush to Network
  console.dir("Flushing to Network");
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      console.dir('Post Success... Writing to Local Log...');
      writeToFile();
      console.dir('Success!');
    }
  };
  xhttp.open("POST", "http://knock.nss.cs.ubc.ca:5000/submit", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  var sendVar = {
    'ClientKey' : clientKey,
    'Events' : temporaryEventHolder
  };
  xhttp.send(JSON.stringify(sendVar));
}

/*
    FIlE IO FUCNTIONS
*/

function writeToFile(){
	window.webkitStorageInfo.requestQuota(PERSISTENT, 50*1024*1024, function(grantedBytes) {
	window.webkitRequestFileSystem(PERSISTENT, grantedBytes, wToFile, errorHandler);}, function(e) {
			console.log('Error', e);
	});
}

function wToFile(fs) {
  fs.root.getFile('KnockKnock.txt', {create: true}, function(fileEntry) {

    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function(fileWriter) {

      //Append to File
      fileWriter.seek(fileWriter.length);
      
      fileWriter.onwriteend = function(e) {
        /* File Write Complete... Emptying Array */
        temporaryEventHolder.length = 0;
      };

      fileWriter.onerror = function(e) {
        console.log('Write failed: ' + e.toString());
      };

      var toWrite = "";
      for (var i=0; i<temporaryEventHolder.length; i++){
        toWrite = toWrite + JSON.stringify(temporaryEventHolder[i]) + "|";
      }
      var blob = new Blob([toWrite], {type: 'text/plain'});

      fileWriter.write(blob);

    }, errorHandler);

  }, errorHandler);
}

/*
 Page Change function returns the URL of the new Page Loaded
*/
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	var s = changeInfo.url;
	try{
		if(s.includes(facebookURL)){
			chrome.tabs.getSelected(null, function(tab) {
			  var msg = {
			    "Recepient" : "silent-content-script",
			    "URL" : changeInfo.url
			  };
			  msg = JSON.stringify(msg);
			  chrome.tabs.sendMessage(tab.id, {message: msg});
			});
		}		
	}
	catch(err){}
}); 

 
 
 
