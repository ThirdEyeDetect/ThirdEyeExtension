/* 
File Structure :
"lib/jquery-2.2.0.js", 
"lib/common-functions.js",
"lib/jquery.appear.js",
"contentscript/global-variables.js",
"contentscript/session-contentscript.js", 
"contentscript/silent-detection-script.js", 
-->"contentscript/nonsilent-detection-script.js"

This content script is meant to capture Non Silent Actions

- Creating Comments

- Creating Posts

- Writing a Message

- Liking a Story

*/



/* ------- Comment, Post and Message Detection ------- */
$(document).bind('keyup',function(e){
	var target= $(event.target);
	var target_parents = target.parents();
		if (e.keyCode == 13) {
		  if(target.hasClass('UFIAddCommentInput') || checkClassOfParents(target_parents,'UFIAddCommentInput')){
		    CreateCommentJSON();
		  }
		  else if (target.hasClass('fbTimelineComposerUnit') || checkClassOfParents(target_parents,'fbTimelineComposerUnit')){
		    CreatePostJSON();
		  }
		  else if (target.hasClass('fbDockChatTabFlyout') || checkClassOfParents(target_parents,'fbDockChatTabFlyout') ){
		    CreateMessageJSON();
		  }
    }
});


/* ------- Like Detection ------- */
$(document).on('click', '.UFILikeLink', function(){
  CreateLikeJSON();
});


function checkClassOfParents(array,class_name){
  for(var i=0; i<array.length; i++){
    if($(array[i]).hasClass(class_name)){return true;}
  }
  return false;
}





/* ------- Create Event Functions ------- */
function CreateCommentJSON(){
	var date = Date.now();
	var a = {
	  "Recepient" : "background",
	  "TabID" : tabID,
	  "Timestamp" : date,
	  "ActionClass" : "Non-Silent",
		"ActionSubClass": "Comment",
	  "Content" : {
		//  "ProfileURL" : commentActor,
		//  "LogContent" :  commentContent,
		//  "PostID": PostID
	  //"type": "Photo",
	  //"isReference": "Y",
	  //"Reference": "Wali Usmani",
	  //"AddDelete": "1",
	  }
	};
	var b = JSON.stringify(a);
	console.log(b);
	chrome.extension.sendMessage({message: b});
}


function CreateMessageJSON(){
	var date = Date.now();
	var a = {
	  "Recepient" : "background",
	  "TabID" : tabID,
	  "Timestamp" : date,
	  "ActionClass" : "Non-Silent",
		"ActionSubClass": "Message",
	  "Content" : {
	    /*"ProfileURL" : messageReceiver_URL,
	    "LogContent" : messageContent*/
	  }
	};
	var b = JSON.stringify(a);
	console.log(b);
	chrome.extension.sendMessage({message: b});
}

function CreateLikeJSON(LikeOn, ActorURL, Content){
	var date = Date.now();
	var a = {
	 "Recepient" : "background",
	  "TabID" : tabID,
	  "Timestamp" : date,
	  "ActionClass" : "Non-Silent",
		"ActionSubClass": "Like",
	  "Content" : {
	    /*"ActionType" : "ActionOnPage",
	    "ActionSubClass" : "LikeAction",
	    "LikeOn" : LikeOn,
		  "ProfileURL" : ActorURL,
		  "LogContent" :  Content*/
	  }
	};
	var b = JSON.stringify(a);
	console.log(b);
	chrome.extension.sendMessage({message: b});
}

function CreatePostJSON(){
  var date = Date.now();
  var a = {
    "Recepient" : "background",
	  "TabID" : tabID,
	  "Timestamp" : date,
	  "ActionClass" : "Non-Silent",
		"ActionSubClass": "Post",
	  "Content" : {
  		// "Actiontype" : "ProfileActions",
		  // "ActionSubClass": "PostCreation",
		  // //"ProfileName"
		  // "ProfileURL" : pageUrl,
		  // "PostContent" : postContent
	  }
  };
  var b = JSON.stringify(a);
	console.log(b);
	chrome.extension.sendMessage({message: b});
}
