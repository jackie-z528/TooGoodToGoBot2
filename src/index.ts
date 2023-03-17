import { start } from "./DiscordBot";
import { TooGoodToGoClient } from "./TooGoodToGoClient/TooGoodToGoClient";
import * as cron from "node-cron"
import { pollFavorites } from "./Poller/Poller";
const client = new TooGoodToGoClient();
// Refresh tokens every day
cron.schedule("* */24 * * *", () => {
   client.refreshTokens(); 
})

cron.schedule("*/10 * * * * *", () => {
   pollFavorites(); 
})

start();