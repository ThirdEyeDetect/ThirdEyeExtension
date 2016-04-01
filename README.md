# ThirdEye browser extension

Third Eye is a continuous authentication system for Facebook on the Google Chrome web browser. It scrapes a user's Facebook activity directly of the browser to create a profile. Subsequent user Facebook activity is run in context of the generated profile. If observed activity deviates significantly expected behavior, the user is notified through a pre-established secondary communication method such as email.
User activity can be categorized in two groups, silent and non-silent behavior. Silent behavior are actions that are invisible to others on Facebook, such as scrolling/viewing stories, reading messages, and browsing between various pages. Non-silent behavior are actions that are visible to others on Facebook such as liking a post, commenting on a picture or uploading status.


#### Supported Browsers
ThirdEye uses the Chrome API and thus, **Google Chrome** is the only supported browser.

#### Installation Instructions
- Download the repository and unzip to the desired location (such as desktop).
- Go to the settings page ![alt tag](https://github.com/arcaneiceman/KnockKnock/blob/master/ReadmeImages/unnamed.png) on Google Chrome (top right of the Chrome) and then select **Extensions** on the left hand side of the page.
- Click on **Load Unpacked Extension** and navigate to where you have unzipped the repo
- Select the main folder (KnockKnock-master) and press **Okay**.
- The extension should now have been added to Chrome and the options page will open automatically.
- Enter your email in the form to create a secondary notification channel. Close the options page.
ALERT! Ensure that you fill this information out. If you do not, ThirdEye will have no way of informing you of anomalous activity.
- You should receive an email by ThirdEye for a successful installation.
- Third Eye extension is now active and listening for active Facebook tabs. It will automatically record actions performed on Facebook.

#### Current Capabilities 
Currently, ThirdEye can capture the following in the silent behavior category:
- Scrolling Newsfeed for stories.
- Clicking on a contact to bring up message box.
- Clicking on notification jewel icon.
- Clicking on message jewel icon.
- Browsing between pages on Facebook.

The following non-silent behavior is captured:
- Clicking on a story
- Like
- Comment
- Post
- Message



##### Anonymity
This feature is on by default and encrypts all data sent to the server. Local log is also encrypted before stored but is decrypted on download.

<!-- ##### Further Development -->


##### Using ThirdEye
ThirdEye uses HTML FileSystem to maintain and manage its log locally as well as sending events to a remote server for collection and processing. ThirdEye currently uses HTTP but will soon migrate to HTTPS transmission.

<!--##### Log Example-->


##### Popup UI
ThirdEye features a basic UI providing a status of Facebook tabs currently detected by system, a link to options page and ability download your log.

<!--![alt tag](https://github.com/arcaneiceman/KnockKnock/blob/master/ReadmeImages/screenshot.png)-->


##### Version 
0.6.7

#### Language
ThirdEye is written  in JavaScript and depends on Chrome browser APIs.
