/* 
File Structure :
"lib/jquery-2.2.0.js", 
"lib/common-functions.js",
"lib/jquery.appear.js",
"lib/crypto/rollups/sha1.js",
"lib/crypto/components/enc-base64-min.js",
"contentscript/global-variables.js",
"contentscript/session-contentscript.js", 
-->"contentscript/silent-detection-script.js", 
"contentscript/nonsilent-detection-script.js"

This content script is meant to exclusively capture silent behaviours on a website

Silent Behaviours Include:

- Page Events 

- Story Views

- Story Clicks

- Message Box Access

- Notification Dropdown Button Click

- Notification Click

- Message Dropdown Click

- Friend Request DropDown Click

Note : All Create Event Functions are in lib/create-event-functions


*/


/* ------- Page Events ------- */

chrome.runtime.onMessage.addListener(function(request, sender) {
  var messageReceived = JSON.parse(request.message);
  if(!isMyMessage(messageReceived,"silent-content-script")){
    console.log("Not My Message");
    return;
  }
  
  
  // Page Change Event Triggered
  if(messageReceived['Type'] == 'page-change'){
     CreatePageVisitEvent(CryptoJS.SHA1(messageReceived['URL']).toString(CryptoJS.enc.Base64));
  }
  else if (messageReceived['Type'] == 'message-load'){
    CreateMessageLoadEvent('');
  }
 
  //Page Reset?
  nextID = 1;
  current_session_stories = {};
});

/* ------- Story Views ------- */

var nextID = 1;
var current_session_stories = {};

$(function() {
  $('.userContentWrapper').appear();
  $(document.body).on('appear', '.userContentWrapper', function(e, $affected) {
    // this code is executed for each appeared element
    $affected.each(function() {
      
      if( hash(this) in current_session_stories){
        //Already in Array, Ignore
      } 
      else {
        //Not Already in. Need to Add
        try{
          var story_details = getStoryDetails(this);
          if(!story_details){ throw "Could not capture Story";}
          //Added
          current_session_stories[hash(this)] =  story_details;
          
          if (Object.keys(current_session_stories).length > 6){
            CreateStoryViewEvent(current_session_stories);
            current_session_stories = {};
          }
        }
        catch(err){
          console.log(err);
        }
      }
    });
  });
});

function getStoryDetails(target){
  var details = {
    'actorArray' : [],
    'timestamp' : "none",
    'sponsor' : "false"
  };
  try{
      //Get Story Actors
      var rawArray =  $(target).find('.fwb');
      if(rawArray.length !== 0){
        for(var i=0; i<rawArray.length; i++){
          details['actorArray'].push(CryptoJS.SHA1(rawArray[i].innerText).toString(CryptoJS.enc.Base64));
        }
      }
                
      //Get Story Timestamp
      var rawTime = $(target).find('.livetimestamp');
      if(rawTime.length !== 0){
        details['timestamp'] = rawTime[0].getAttribute('title');
        //console.log(timestamp);
      }
      
      //Get Story Sponsored
      var rawSpons = $(target).find('.uiStreamSponsoredLink');
      if(rawSpons.length !== 0){
          details['sponsor'] = true;
      }
      
      return details;
    }catch(err){
      return null;
    }
}



function hash(item){
   item.hashID = item.hashID || ('hashID_' + (nextID++));
   return item.hashID;
}


/* Message Views on ChatBox*/


function checkMessages(){
  var chatBoxes = $(document).find('.fbDockChatTabFlyout');
  for(var i = 0; i<chatBoxes.length; i++){
    var name = $(chatBoxes[i]).find('.titlebarText')[0];
    name = $(name).attr('href');
    if(name == null){continue;}
    var messages = $(chatBoxes[i]).find('._4tdt');
    var messagecount = messages.length;
    //If this chatbox doesnt exist in global or if the message count is NOT same
    if( !(name in current_session_chatboxes) || (messagecount != current_session_chatboxes[name])){
      current_session_chatboxes[name] = messagecount;
      CreateMessageScrollEvent(CryptoJS.SHA1(name).toString(CryptoJS.enc.Base64),messagecount);
    }
  }
}


/* Message Views on Message Page */
 
var prev_message_count = 0; 
function checkMessagesOnPage(){
  var messages = $('.uiScrollableAreaContent').find('.webMessengerMessageGroup');
  if(messages.length>prev_message_count){
    prev_message_count = messages.length;
    name = $('#webMessengerHeaderName').find('a')[0];
    CreateMessageScrollEvent(CryptoJS.SHA1(name).toString(CryptoJS.enc.Base64),prev_message_count);
    for(var i = 0; i<messages.length; i++){
      //details
    }
  }
}

$(function(){
  $('._5wd9').appear();
  $(document.body).on('appear', '._5wd9', function(e, $affected){
    $affected.each(function(){
      console.log(this);
      if( hash(this) in current_session_messages){
        //Already in Array, Ignore
      } 
      else {
        //Not Already in. Need to Add
        try{
          //var message_details = getStoryDetails(this);
          //if(!story_details){ throw "Could not capture Story";}
          //Added
          var message_details = $(this).find('._5yl5').innertext;
          current_session_messages[hash(this)] =  message_details;
          
          if (Object.keys(current_session_messages).length > 6){
            //CreateStoryViewEvent(current_session_stories);
            console.log("Seen 6 messages");
            current_session_messages = {};
          }
        }
        catch(err){
          console.log(err);
        }
      }
    });
  });
});


/* ------- Story Clicks ------- */
$(document).on('mousedown', '.userContentWrapper', function(e){
  if( e.which <= 2){
    var story_details = getStoryDetails(this);
    if(!story_details){ return;}
    CreateStoryClickEvent(story_details['actorArray'],story_details['sponser'],story_details['timestamp']);
  }
});


/* ------- Opening Message Boxes ------- */

$(document).on('click', '._42fz', function(){
	console.log("Message Tab Clicked");
	var name = $(this).find('._55lr');
	CreateMessageBoxAccessEvent((CryptoJS.SHA1(name[0].innerText).toString(CryptoJS.enc.Base64),prev_message_count));
});

/* ------- Notification Dropdown Button Click -------*/
var notificationJewelButton = document.getElementById('fbNotificationsJewel');
var notification_prevMouseEventListener = notificationJewelButton.onmousedown;
notificationJewelButton.onmousedown = function(){
  console.log("Notification Clicked");
  CreateNotificationDropDownEvent();
  if(notification_prevMouseEventListener) {notification_prevMouseEventListener();}
};

/* ------- Message Dropdown Click ------- */
var messagesJewelButton = document.getElementById('u_0_g');
var messages_prevMouseEventListener = messagesJewelButton.onmousedown;
messagesJewelButton.onmousedown = function(){
  console.log("Messages Clicked");
  CreateMessagesDropDownEvent();
  if(messages_prevMouseEventListener) {messages_prevMouseEventListener();}
};

/* ------- Friend Request DropDown Click -------*/
var friendReqJewelButton = document.getElementById('fbRequestsJewel');
var friends_prevMouseEventListener = friendReqJewelButton.onmousedown;
friendReqJewelButton.onmousedown = function(){
  console.log("Friends Clicked");
  CreateFriendsDropDownEvent();
  if(friends_prevMouseEventListener) {friends_prevMouseEventListener();}
};



/* ------- Event Creation Functions ------- */

function CreatePageVisitEvent(pageUrl){
	var date = Date.now();
	var a = {
	  "Recepient" : "background",
	  "Timestamp" : date,
	  "TabID" : tabID,
	  "ActionClass" : "Silent",
		"ActionSubClass": "PageAccess",
	  "Content" : {
		  "ProfileURL" : pageUrl
	  }
	};
	var b = JSON.stringify(a);
	console.log(b);
	chrome.extension.sendMessage({message: b});
}

function CreateStoryViewEvent(details){
  var date = Date.now();
  var a = {
	  "Recepient" : "background",
	  "Timestamp" : date,
	  "TabID" : tabID,
	  "ActionClass" : "Silent",
		"ActionSubClass": "StoryView",
	  "Content" : {
	    "StoryDetails": details
	  }
	};
	var b = JSON.stringify(a);
	console.log(b);
	chrome.extension.sendMessage({message: b});
}

function CreateStoryClickEvent(actors,sponsored,timestamp){
  var date = Date.now();
  var a = {
	  "Recepient" : "background",
	  "Timestamp" : date,
	  "TabID" : tabID,
	  "ActionClass" : "Silent",
		"ActionSubClass": "StoryClick",
	  "Content" : {
		  "Actors" : actors,
		  "Sponsored" : sponsored,
		  "timestamp" : timestamp
	  }
	};
	var b = JSON.stringify(a);
	console.log(b);
	chrome.extension.sendMessage({message: b});
}

function CreateMessageScrollEvent(actor,messageCount){
  var date = Date.now();
  var a = {
	  "Recepient" : "background",
	  "Timestamp" : date,
	  "TabID" : tabID,
	  "ActionClass" : "Silent",
		"ActionSubClass": "MessageScroll",
	  "Content" : {
		  "Actor" : actor,
		  "MessageCount" : messageCount
	  }
	};
	var b = JSON.stringify(a);
	console.log(b);
	chrome.extension.sendMessage({message: b});
}

function CreateMessageLoadEvent(){
  var date = Date.now();
  var a = {
	  "Recepient" : "background",
	  "Timestamp" : date,
	  "TabID" : tabID,
	  "ActionClass" : "Silent",
		"ActionSubClass": "MessageLoad",
	  "Content" : {}
	};
	var b = JSON.stringify(a);
	console.log(b);
	chrome.extension.sendMessage({message: b});
}

function CreateMessageBoxAccessEvent(actor){
  var date = Date.now();
  var a = {
	  "Recepient" : "background",
	  "Timestamp" : date,
	  "TabID" : tabID,
	  "ActionClass" : "Silent",
		"ActionSubClass": "MessageBoxAccess",
	  "Content" : {
		  "Actor" : actor
	  }
	};
	var b = JSON.stringify(a);
	console.log(b);
	chrome.extension.sendMessage({message: b});
}

function CreateNotificationDropDownEvent(){
  var date = Date.now();
  var a = {
	  "Recepient" : "background",
	  "Timestamp" : date,
	  "TabID" : tabID,
	  "ActionClass" : "Silent",
		"ActionSubClass": "NotificationDropDown",
	  "Content" : {}
	};
	var b = JSON.stringify(a);
	console.log(b);
	chrome.extension.sendMessage({message: b});
}

function CreateMessagesDropDownEvent(){
  var date = Date.now();
  var a = {
	  "Recepient" : "background",
	  "Timestamp" : date,
	  "TabID" : tabID,
	  "ActionClass" : "Silent",
		"ActionSubClass": "MessagesDropDown",
	  "Content" : {}
	};
	var b = JSON.stringify(a);
	console.log(b);
	chrome.extension.sendMessage({message: b});
}

function CreateFriendsDropDownEvent(){
  var date = Date.now();
  var a = {
	  "Recepient" : "background",
	  "Timestamp" : date,
	  "TabID" : tabID,
	  "ActionClass" : "Silent",
		"ActionSubClass": "FriendsDropDown",
	  "Content" : {}
	};
	var b = JSON.stringify(a);
	console.log(b);
	chrome.extension.sendMessage({message: b});
}