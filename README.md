# TooGoodToGoBot2
Too Good To Go is an app that looks to solve food waste by providing a platform to connect restaurants with excess food and consumers looking for great deals. I use the app frequently looking for deals on tasty food items that I would probably purchase at full price anyways. There's one feature the app is missing though; notifications.

TooGoodToGoBot2 is my solution to this feature via a node service integrated with MongoDB and Discord. Note that TooGoodToGoBot2 is unaffiliated with Too Good To Go and any usage is done so at your own risk.

## Setup
In order to ensure that the bot doesn't get overloaded with accounts to poll, I am manually controlling adding the bot to a server. To use this bot, create an issue asking to add the bot to your server and I will add the bot for you depending on capacity. Currently an email can only be added to one channel, based on the channel `/login` is sent to the bot, which should suffice. If you would like to setup this application yourself, see the below details.

### Installation
Dependencies: Node.js, MongoDB, Discord
```
git clone https://github.com/jackie-z528/TooGoodToGoBot.git
cd TooGoodToGoBot
npm i
```
### Discord Bot
Create a [discord application](https://discord.com/developers/applications) and a discord bot under the application. Make a note of the bot token somewhere.

### MongoDB
Create a MongoDB Cluster and make a note of the connection url.

### Environment Variables
Create a `.env` file and populate the following values:

`DB_NAME`: Name of your MongoDB database

`DB_URL`: Connection URL to the MongoDB db

`DISCORD_TOKEN`: Discord bot token

`DISCORD_CLIENT_ID`: Client ID of your discord application

### Running
For the initial run, run the DB migrations and build the application:

```
DB_URL=<DB_URL> npx migrate-mongo up
npm run build
```

For normal runs: `node build/index.js`

### Notifications
When your favourites have an increase in stock, the discord bot will send you a notification.

<br>

![](notification_preview.png)