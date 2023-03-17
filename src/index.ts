import { start } from "./DiscordBot";
import { TooGoodToGoClient } from "./TooGoodToGoClient/TooGoodToGoClient";
const client = new TooGoodToGoClient();
setInterval(() => {
    client.refreshTokens()
}, )
start();