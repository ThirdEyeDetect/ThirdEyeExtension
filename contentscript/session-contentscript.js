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
      "Content" : {}
	  };
	  var b = JSON.stringify(a);
	  console.log(b);
		chrome.extension.sendMessage({message: b});
}





/*//PostCreationVariables
var postContent = "";

//Comment Variables
var commentActor = "";
var commentPostContent = "";
var commentContent = "";
var numberOfComments = 0;

//Messaging Variables
var messageContent = "";
var messageReceiver = "";
var messageReceiver_URL = "";
*/

//Timing Function Variables














/**
 * The following method binds on Enter Key and Checks for Content in FB Messaging 
 * and in Comments
 */
/*$(document).bind('keyup',function(e){
	var event_element= $(event.target);
	var parentTree = $(event_element[0]).parentsUntil('.UFIAddCommentInput');
	//Following Code Handles Comments
	if(event_element[0].className=="_54-z" && parentTree.size()<= 3){
		if (e.keyCode == 13) {
		 	var temp = event_element[0].innerHTML;
			var parser = new DOMParser();
			var temp2 = parser.parseFromString(temp,"text/xml");
			CreateCommentJSON(temp2);
    }
    commentContent = event_element[0].textContent;
    commentActor = findPostActorURL(event_element);
    commentPostContent = findPostContent(event_element);
	}
	//Following Code Handles Status Bars for Post creation
	else if (event_element[0].className=="_54-z" && parentTree.size()>3){
	  console.log("Writing on a Post");
	  postContent = event_element[0].innerText;
	  //GET URL OF PAGE post
	}
	//Following Code Handles FB Messaging
	else if(event_element[0].className.includes("_552m")){//FB Messaging
		if(e.keyCode == 13){
			CreateMessageJSON();
		}
		messageContent = event_element[0].value;
		var temp = $(event_element[0]).parentsUntil(".titlebarLabel");
		var name = temp[3].getElementsByClassName('titlebarText')[0];
		messageReceiver = name.innerText;
		messageReceiver_URL = $(name).attr('href');
	}
});*/

/* Attempt 2 at Comment and Message Capture */
// $(document).bind('keydown',function(e){
// 	if(e.keyCode == 13){
// 	  console.log("Pressed enter");
// 	  var curElement = document.activeElement;
// 	  console.dir(curElement);
// 	}
// });












/**
 *  Method Handles "POST" Button on Status Bar
 */
/*$(document).on('click', '.selected', function(e){
  var button = $(event.target);
  if (button[0].innerText.includes('Post') && postContent){
     console.log("Post Button Clicked");
     CreatePostJSON("URL");
  }
});
*/

/**
 * The following Method Handles 'Like Action'
 */
// $(document).on('click', '.UFILikeLink', function(e){
// 	console.log("Like Button Clicked"); // Like Button Clicked
// 	var target = $(event.target);
//   //Handle Comment Like
// 	if($(target[0].parentElement).hasClass('UFICommentActions')){
// 		var parentTree = $(target[0]).parentsUntil('.UFICommentContent');
// 		var commentContent = searchForCommentText($(event.target));
// 		if(!commentContent){
// 			commentContent = searchForCommentImage(parentTree);
// 		}
// 		var commentLikeActor = $(event.target).closest('.UFICommentContentBlock').find('.UFICommentActorName');
// 		commentLikeActor = commentLikeActor[0].innerHTML;
// 		CreateLikeJSON("comment", commentLikeActor, commentContent);
// 	}
// 	//Handle Post Like
// 	else{
// 		var postContent = findPostContent(target);
// 		var commentLikeActor = findPostActorURL(target);
// 		CreateLikeJSON("post", commentLikeActor, postContent);
// 	}
	
// });

/*
Listner detects changes in URL to track browsing of differnt pages visited
*/
// chrome.runtime.onMessage.addListener(
// function(request, sender) {
//       var messageReceived = JSON.parse(request.message);
//       var forPopup = messageReceived["ForPopup"];
//       if(!forPopup){
//         var url = messageReceived["URL"];
//       }  
//   });

/*
	JSON Functions To Create Event JSON and pass it to Background Script for logging
	(In each of the funtions , variable 'a' is the raw version of the JSON while variable 'b' is the stringified version)
*/

function CreateMessageJSON(){
	var date = Date.now();
	var a = {
	  "Timestamp" : date,
	  "TabID" : tabID,
	  "Content" : {
	    "ActionType" : "ProfileActions",
	    "ActionSubClass" : "FBMessage",
	    "ProfileURL" : messageReceiver_URL,
	    "LogContent" : messageContent
	  }
	};
	var b = JSON.stringify(a);
	console.log(b);
	chrome.extension.sendMessage({message: b});
	//book keeping
	messageContent = "";
	currentEntryNumber++;
}

function CreateLikeJSON(LikeOn, ActorURL, Content){
	var date = Date.now();
	var a = {
	  "Timestamp" : date,
	  "TabID" : tabID,
	  "Content" : {
	    "ActionType" : "ActionOnPage",
	    "ActionSubClass" : "LikeAction",
	    "LikeOn" : LikeOn,
		  "ProfileURL" : ActorURL,
		  "LogContent" :  Content
	  }
	};
	var b = JSON.stringify(a);
	console.log(b);
	currentEntryNumber++;
	chrome.extension.sendMessage({message: b});
}



function CreatePostJSON(pageUrl){
  var date = Date.now();
  var a = {
    "Timestamp" : date,
	  "TabID" : tabID,
	  "Content" : {
  		"Actiontype" : "ProfileActions",
		  "ActionSubClass": "PostCreation",
		  //"ProfileName"
		  "ProfileURL" : pageUrl,
		  "PostContent" : postContent
	  }
  };
  var b = JSON.stringify(a);
	console.log(b);
	chrome.extension.sendMessage({message: b});
	//book-keeping
	postContent = "";
	currentEntryNumber++;
}






/*$(document).on('keypress', '._54-z', function(e){
	var el= $(event.target);
	console.log(JSON.parse(JSON.stringify(e1)));
	console.log("Comment Form ON Clicked");
    var e1= $(event.target);
    var e2= e1[0].innerHTML;
	console.log(JSON.parse(JSON.stringify(e2.innerHTML)));
});
*/

/*
$(document).on('click', '.fwb', function(){
	console.log("Profile/Name Button Clicked");
});

$(document).on('click', '._2pdh _3zm- _55bi _3zm- _55bh', function(){
	console.log("Home Button Clicked");
});




*/





// /*
// 	Support Functions
// */

// function searchForCommentImage(target) {
// 	var aTag = target.closest('.UFICommentContentBlock').find(".UFICommentContent").find(".mvs")[0].innerHTML;
// 	//console.log(aTag);
// 	return aTag;
// }

// function searchForCommentText(target){
// 	var a = target.closest('.UFICommentContentBlock').find('.UFICommentBody');
// 	a = a[0].innerText;
// 	return a;
// }

// function findPostActorURL(target){
//   var actor = $(target[0]).closest('.userContentWrapper').find('.fwb')[0].firstChild;
//   return $(actor).attr('href');
// }

// function findPostContent(target){
//   var Content = $(target[0]).closest('.userContentWrapper').find('.userContent');
//   Content = Content[0].innerHTML;
// 		if(!Content){
// 		  Content = $(target[0]).closest('.userContentWrapper').find('.mtm')[0].innerHTML;
// 		}
// 	return Content;
// }

// function getCurrentTabURL(){
//   /*var url = "";
//   chrome.tabs.getCurrent(function(tab){
//         url = tab.url;
//     }
//   );*/
//   return "url";
// }




