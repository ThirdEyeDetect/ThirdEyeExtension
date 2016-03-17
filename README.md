# Knock Knock

Knock Knock is a Chrome Extension designed to scrape a user's Facebook activity to mine a user's activity on the site. The extension creates a log of events that take place in the context of the Facebook page and stores them in JSON format. The extension runs a persistent background script as well as a content script.
User activity can be categorized in two groups, silent and non-silent behaviour. Silent behavior are actions that are invisible to others on Facebook, such as scrolling/viewing stories, reading messages, and browsing between various pages. Non-silent behavior are actions that are visible to others on Facebook such as liking a post, commenting on a picture or uploading status.
Currently Knock Knock focuses on silent behaviour capture


#### Supported Browsers
Knock Knock uses the Chrome API and thus, **Google Chrome** is the only supported browser.

#### Installation Instructions
- Download the repository and unzip to the desired location (such as desktop).
- Go to the settings page ![alt tag](https://github.com/arcaneiceman/KnockKnock/blob/master/ReadmeImages/unnamed.png) on Google Chrome (top right of the Chrome) and then select **Extensions** on the left hand side of the page.
- Click on **Load Unpacked Extension** and navigate to where you have unzipped the repo
- Select the main folder (KnockKnock-master) and press **Okay**.
- The extension should now have been added to Chrome. Load/Reload a Facebook page and access the **console**. A message saying "Session Started" means that the extension is running and recording.

#### Current Capabilities 
Currently, Knock Knock can capture the following in the silent behaviour category:
- Scrolling Newsfeed for stories.
- Clicking on a contact to bring up message box.
- Clicking on notification jewel icon.
- Clicking on message jewel icon.
- Browsing between pages on Facebook.

##### Anonymity
Feature is temporarily disabled.

<!-- ##### Further Development -->


##### Using Knock Knock
KnockKnock uses HTML FileSystem to maintain and manage its log locally as well as sending events to a remote server for collection and processing. KnockKnock currently uses HTTP but will soon migrate to HTTPS transmission.

<!--##### Log Example-->


##### Popup UI
Knock Knock features a basic UI providing a few statistics regarding the current session as well as controls such as activating/deactivating user anonymity and the ability to download the LogFile that Knock Knock has generated.

![alt tag](https://github.com/arcaneiceman/KnockKnock/blob/master/ReadmeImages/screenshot.png)


##### Version 
0.1.1

#### Language
Knock Knock is written  in JavaScript and depends on Chrome browser APIs.

