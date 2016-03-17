
/* This File contains common functions that all should be available to all parts of the extension*/

function randomString(len, an){
    an = an&&an.toLowerCase();
    var str="", i=0, min=an=="a"?10:0, max=an=="n"?10:62;
    for(;i++<len;){
      var r = Math.random()*(max-min)+min <<0;
      str += String.fromCharCode(r+=r>9?r<36?55:61:48);
    }
    return str;
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function errorHandler(e) {
  var msg = '';
  switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
      msg = 'QUOTA_EXCEEDED_ERR';
      break;
    case FileError.NOT_FOUND_ERR:
      msg = 'NOT_FOUND_ERR';
      break;
    case FileError.SECURITY_ERR:
      msg = 'SECURITY_ERR';
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      msg = 'INVALID_MODIFICATION_ERR';
      break;
    case FileError.INVALID_STATE_ERR:
      msg = 'INVALID_STATE_ERR';
      break;
    default:
      msg = 'Unknown Error';
      break;
  }
  console.log('Error: ' + msg);
}

function isMyMessage(message,intended_recepient){
  if(message["Recepient"] && message["Recepient"] == intended_recepient){
    delete message["Recepient"];
    return true;
  }
  else{
    console.log("Not My Message");
    return false;
  }
}

function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}