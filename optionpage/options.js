

var clientID = "";
var cemail;
var email1;
var email2;
var submit;
var done = false;
/** 
 * Send Message to Background Requesting Update
 */
$(document).ready(function() {
  var mMessage = {
    "Recepient" : "background",
    "Action" : "RequestUIUpdate"
  };
  var b = JSON.stringify(mMessage);
  chrome.extension.sendMessage({message: b});
  clientID = document.getElementById('cid');
  cemail = document.getElementById('cemail');
  email1 = document.getElementById('email1');
  email2 = document.getElementById('email2');
  submit = document.getElementById('submit');
});

/**
 * Receive Update
 */
chrome.runtime.onMessage.addListener(
function(request, sender) {
    var messageReceived = JSON.parse(request.message);
    if(!isMyMessage(messageReceived,"installtab")){return;}
    clientID.value=messageReceived['ClientID'];
    cemail.value=messageReceived['Email'];
});

document.addEventListener('DOMContentLoaded', function() {
  submit.addEventListener("click", formSubmit);
});



function formSubmit(){
  if(email1.value === email2.value){
    var mMessage = {
      "Recepient" : "background",
      "Action" : "EmailUpdate",
      "Email" : email1.value
    };
    var b = JSON.stringify(mMessage);
    chrome.extension.sendMessage({message: b});
    window.onbeforeunload = null;
  }
  else{
    alert("Email did not match");
  }
}
