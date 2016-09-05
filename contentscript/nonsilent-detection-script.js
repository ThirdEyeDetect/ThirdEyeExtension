/* 
File Structure :
"lib/jquery-2.2.0.js", 
"lib/common-functions.js",
"lib/jquery.appear.js",
"lib/crypto/rollups/sha1.js",
"lib/crypto/components/enc-base64-min.js",
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

var comment = "";
var fbmessage = "";
var post = "";



/* ------- Comment, Post and Message Detection ------- */
$(document).bind('keyup',function(e){
	var target= $(event.target);
	var target_parents = target.parents();
  if(target.hasClass('UFIAddCommentInput') || checkClassOfParents(target_parents,'UFIAddCommentInput')){
    if (e.keyCode == 13) {
      CommentDetected(target);
    }else{
      comment = target[0].innerText;
    }
	}
  else if (target.hasClass('fbTimelineComposerUnit') || checkClassOfParents(target_parents,'fbTimelineComposerUnit')){
    post = target[0].innerText;
	}
	else if (target.hasClass('fbDockChatTabFlyout') || checkClassOfParents(target_parents,'fbDockChatTabFlyout') ){
		if (e.keyCode == 13) {
      MessageDetected(target);
      
    }else{
      fbmessage = target[0].innerText;
    }
	}
});

/* -------- Comment Details -------- */
function CommentDetected(target){
  var type = "Uncertain";
  var name = "None";
  var isMedia = target.closest('.fbPhotoSnowlift');
  var isStory = target.closest('.userContentWrapper');
  if(isMedia.length===0 && isStory.length>=1){
    type = "Story";
    name = isStory[0].innerText.split("\n")[1];
  }
  else if (isStory.length===0 && isMedia.length>=1){
    type = "Media";
    name = isMedia.find('.taggee')[0];
    name = $(name).attr('href');
    //
  }
  //if both are 1 then I am not sure
  
  CreateCommentJSON(CryptoJS.SHA1(name).toString(CryptoJS.enc.Base64),comment,type);
  comment = "";
}


/* ------- Like Detection ------- */
$(document).on('click', '.UFILikeLink', function(e){
  var target= $(event.target);
  var type = "Uncertain";
  var name = "None";
  var isMedia = target.closest('.fbPhotoSnowlift');
  var isStory = target.closest('.userContentWrapper');
  if(isMedia.length===0 && isStory.length>=1){
    type = "Story";
    name = isStory[0].innerText.split("\n")[1];
  }
  else if (isStory.length===0 && isMedia.length>=1){
    type = "Media";
    name = isMedia.find('.taggee')[0];
    name = $(name).attr('href');
  }
  CreateLikeJSON(CryptoJS.SHA1(name).toString(CryptoJS.enc.Base64),type);
});

/* -------- Message Detection --------*/

function MessageDetected(target){
  var target = target.closest('.fbDockChatTabFlyout')[0];
  target = $(target).find('.titlebarText')[0];
  var name = $(target).attr('href');
  CreateMessageJSON(CryptoJS.SHA1(name).toString(CryptoJS.enc.Base64),fbmessage);
  fbmessage = "";
}

function checkClassOfParents(array,class_name){
  for(var i=0; i<array.length; i++){
    if($(array[i]).hasClass(class_name)){return true;}
  }
  return false;
}

/* ------ Post Detected -------*/
$(document).on('click', '._4jy1', function(e){
  CreatePostJSON(CryptoJS.SHA1(window.location.href).toString(CryptoJS.enc.Base64),post);
  post = "";
});

/* ------- Create Event Functions ------- */
function CreateCommentJSON(commentActor,commentContent,type){
	var date = Date.now();
	var a = {
	  "Recepient" : "background",
	  "TabID" : tabID,
	  "Timestamp" : date,
	  "ActionClass" : "Non-Silent",
		"ActionSubClass": "Comment",
	  "Content" : {
		  "CommentActor" : commentActor,
		  "CommentContent" :  commentContent,
	    "type": type
	  }
	};
	var b = JSON.stringify(a);
	console.log(b);
	chrome.extension.sendMessage({message: b});
}

function CreateLikeJSON(likeActor, type){
	var date = Date.now();
	var a = {
	 "Recepient" : "background",
	  "TabID" : tabID,
	  "Timestamp" : date,
	  "ActionClass" : "Non-Silent",
		"ActionSubClass": "Like",
	  "Content" : {
      "LikeActor" : likeActor,
      "type" : type
	  }
	};
	var b = JSON.stringify(a);
	console.log(b);
	chrome.extension.sendMessage({message: b});
}

function CreateMessageJSON(messageActor,messageContent){
	var date = Date.now();
	var a = {
	  "Recepient" : "background",
	  "TabID" : tabID,
	  "Timestamp" : date,
	  "ActionClass" : "Non-Silent",
		"ActionSubClass": "Message",
	  "Content" : {
	    "MessageActor": messageActor,
	    "MessageContent" : messageContent
	  }
	};
	var b = JSON.stringify(a);
	console.log(b);
	chrome.extension.sendMessage({message: b});
}

function CreatePostJSON(postActor,postContent){
  var date = Date.now();
  var a = {
    "Recepient" : "background",
	  "TabID" : tabID,
	  "Timestamp" : date,
	  "ActionClass" : "Non-Silent",
		"ActionSubClass": "Post",
	  "Content" : {
		  "PostActor" : postActor,
		  "PostContent" : postContent
	  }
  };
  var b = JSON.stringify(a);
	console.log(b);
	chrome.extension.sendMessage({message: b});
}
