/* 
File Structure :
"lib/jquery-2.2.0.js", 
"lib/common-functions.js",
"lib/jquery.appear.js",
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
  // TRIGGERING EVENT //
  CreatePageVisitEvent(messageReceived["URL"]);

  //Page Reset?
  var nextID = 1;
  current_session_stories = {};
  current_session_messages= {};
});

/* ------- Story Views ------- */

var nextID = 1;
var current_session_stories = {};
var current_session_messages= {};

$(function() {
  $('.userContentWrapper').appear();
  //$('.direction_ltr').appear();
  
  
  $(document.body).on('appear', '.userContentWrapper', function(e, $affected) {
    // this code is executed for each appeared element
    $affected.each(function() {
      
      if( hash(this) in current_session_stories){
        //Already in Array, Ignore
      } else {
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
        /*var story_details = getStoryDetails(this);
        var actorArray = [];
        var timestamp = "none";
        var spons = false;
        //console.dir(this);
        try{
          //Get Story Actors
          var rawArray =  $(this).find('.fwb');
          if(rawArray.length !== 0){
            for(var i=0; i<rawArray.length; i++){
              actorArray.push(rawArray[i].innerText);
            }
          }
                    
          //Get Story Timestamp
          var rawTime = $(this).find('.timestamp');
          if(rawTime.length !== 0){
            timestamp = rawTime[0].getAttribute('title');
            //console.log(timestamp);
          }
          
          //Get Story Sponsored
          var rawSpons = $(this).find('.uiStreamSponsoredLink');
          if(rawSpons.length !== 0){
              spons = true;
          }
          
        }catch(err){
          console.log("Could Not Capture Story");
        }
        current_session_stories.push(hash(this));
        CreateStoryViewEvent(actorArray,spons,timestamp);*/
      }
    });
  });
  
  /*$(document.body).on('appear', '.direction_ltr', function(e, $affected) {
    // this code is executed for each appeared element
    $affected.each(function() {
      if( $.inArray(this, current_session_stories ) != -1){
        //Already in Array, Ignore
      } else {
        //Not Already in. Need to Add
        current_session_messages.push(this);
        console.log("Message appeared");
      }
    });
  });*/

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
          details['actorArray'].push(rawArray[i].innerText);
        }
      }
                
      //Get Story Timestamp
      var rawTime = $(target).find('.timestamp');
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

/* ------- Story Clicks ------- */
$(document).on('click', '.userContentWrapper', function(){
  var story_details = getStoryDetails(this);
  if(!story_details){ return;}
  CreateStoryClickEvent(story_details['actorArray'],story_details['sponser'],story_details['timestamp']);
});


/* ------- Opening Message Boxes ------- */

$(document).on('click', '._42fz', function(){
	console.log("Message Tab Clicked");
	var name = $(this).find('._55lr');
	CreateMessageBoxAccessEvent(name[0].innerText);
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
var messagesJewelButton = document.getElementById('u_0_f');
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