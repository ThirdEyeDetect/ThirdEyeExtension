/*
This JS File Simply maintains stats and provides them when needed by popup
*/

var numOfTabs = 0;
var numOfMessages = 0;
var numOfPagesVisited = 0;
var numOfComments = 0;
var numOfShares = 0;
var numOfLikes = 0;
var numOfPostsCreated = 0;

function UpdateStats(jsonObject){
  if(jsonObject["Content"]["ActionSubClass"] == "StartTab"){
    numOfTabs++;
  } else if (jsonObject["Content"]["ActionSubClass"] == "CloseTab"){
    numOfTabs--;
    if(numOfTabs<0){
      numOfTabs = 0;
    }
  } else if (jsonObject["Content"]["ActionSubClass"] == "FBMessage"){
    numOfMessages++;
  } else if (jsonObject["Content"]["ActionSubClass"] == "LikeAction"){
    numOfLikes++;
  } else if (jsonObject["Content"]["ActionSubClass"] == "Comment"){
    numOfComments++;
  } else if (jsonObject["Content"]["ActionSubClass"] == "PageAccess"){
    numOfPagesVisited++;
  } else if (jsonObject["Content"]["ActionSubClass"] == "PostCreation"){
    numOfPosts++;
  } else if (jsonObject["Content"]["ActionSubClass"] == "Share"){
    numOfShares++;
  }
}

function resetStats(){
  numOfTabs = 0;
  numOfMessages = 0;
  numOfPagesVisited = 0;
  numOfComments = 0;
  numOfShares = 0;
  numOfLikes = 0;
  numOfPostsCreated = 0;
}
