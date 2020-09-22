# *Chill Cafe Server Bot*
## Made By *Ataraxia* & *Star Trek* on Repl.it
[![Run on Repl.it](https://repl.it/badge/github/AtaraxiaPlayz/Chill-Cafe-Server-Bot)](https://repl.it/github/AtaraxiaPlayz/Chill-Cafe-Server-Bot)
[![Discord.js](https://img.shields.io/badge/discord.js-v12.0.0--dev-blue.svg?logo=npm)](https://github.com/discordjs)
![License](https://img.shields.io/cran/l/package.json)
[![Dependencies](https://david-dm.org/AtaraxiaPlayz/Chill-Cafe-Server-Bot.svg)](https://david-dm.org/AtaraxiaPlayz/Chill-Cafe-Server-Bot?view=list)
![Lines of Code](https://img.shields.io/tokei/lines/github.com/AtaraxiaPlayz/Chill-Cafe-Server-Bot)


<img align="left" src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/2400b414-c503-4742-9936-d83e9d087f83/dbfc7gt-749a655c-02e3-4851-a25e-f89cb209589f.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzI0MDBiNDE0LWM1MDMtNDc0Mi05OTM2LWQ4M2U5ZDA4N2Y4M1wvZGJmYzdndC03NDlhNjU1Yy0wMmUzLTQ4NTEtYTI1ZS1mODljYjIwOTU4OWYuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.XhxoHNXvGnDYn8_n41rTrYWDb-OnWQfZZEN6ietlwg8" width="80">
This is the official server bot for the Chill Cafe server. You may run your own instance of the bot and/or remix the code to your liking IF in compliance to the GPL-3.0 License. The explanation on how to do this is below. 

## Features
* Chat based XP, Level, Rank, & Profile
* Economy Commands
* Moderation Commands
* Music Commands
* Twitch Streaming Notifications
* Youtube Channel Notifications
* & more!

## How to Use
### Install
First clone this repository

**for Debian/Ubuntu** 
as root:
```
apt update && apt upgrade -y && apt install curl
curl -sL https://deb.nodesource.com/setup_13.x | bash -
apt-get install -y nodejs
apt install build-essential 
```
**for Windows**
Install nodeJS from this [link](https://nodejs.org/en/)  
Open Powershell in Administrator mode `win+x`
``` 
npm install --global windows-build-tools
```
Then your system should be ready.  
```
git clone https://github.com/AtaraxiaPlayz/Chill-Cafe-Server-Bot.git
cd Chill-Cafe-Server-Bot
npm install
npm run start
```

### Configuration
The Server Bot's configuration can get pretty intense...  

You need a Discord Application, Mongo Database Link, and a Youtube API Key

You also will need a Website Domain, a Soundcloud Client ID, and a Twitch Client ID for other features.

* [Discord Developer Portal](https://discordapp.com/developers/applications/) 
* [MongoDB Database Clusters](https://www.mongodb.com/cloud/atlas) 
* [Youtube API Key](https://developers.google.com/youtube/v3/getting-started) 
* [Twitch Developer Portal](https://dev.twitch.tv/) 
* [SoundCloud Client ID Tutorial](https://www.youtube.com/watch?v=DdDqV0NrSOg) 
* [Free Web Domain](https://www.freenom.com/en/index.html?) 

Copy the following and paste it into a new file in the main folder named *config.json*
```
{
    "prefix": "%", //This is the prefix used to call the bot
    "token": "", //This is your Discord Bot Token
    "id": "", //This is your Discord Bot Client ID
    "clientSecret": "", //This is your Discord Bot's Client Secret
    "domain": "", //This is your Discord Bot's Web Domain
    "port": 8080, //This is your Discord Bot's Port (usually 8080)
    "message": "New video: **{videoTitle}**! It was uploaded by {videoAuthorName} at {videoPubDate}! Here is the link: {videoURL}", //This is the message generated whenever someone uploads a new Youtube Video.
    "channel": "", //This is the channel for your Youtube notifications
    "youtubers": [
        "",
        "",
        ""
    ], //This is your list of Youtubers to get notifications from
    "YOUTUBE_API_KEY": "", //This is your Youtube API Key
    "SOUNDCLOUD_CLIENT_ID": "", //This is your SoundCloud Client ID
    "MAX_PLAYLIST_SIZE": 5, //This is the maximum size of playlists used by music commands 
    "PRUNING": false, //This is to delete music messages by the bot
    "twitchClientId": "", //This is your Twitch Client ID
    "mongodbUrl": "", //This is your Mongo Database URL
    "dbLink": "", //Backup Mongo Database Link
    "infectionRoleID": "", //This is the Role ID for Infected
    "ownerID": "", //This is the User ID of the owner
    "adminRoleID": "", //This is the Role ID for Administrator
    "moderatorRoleID": "", //This is the Role ID for Moderator
    "trialmodRoleID": "", //This is the Role ID for Trial-Moderator
    "mutedRoleID": "", //This is the Role ID for Muted
    "inviteLink": "" //This is your Discord Server's Invite Link
}
```

### Bot Help or Questions
If you have any questions or need help related to the bot, feel free to slide into our server **Chill Cafe**: https://discord.gg/HBSrT9. We will be glad to help you.
