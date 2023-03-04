import { Db } from "../DB/db";
import { DiscordClient } from "../DiscordBot/DiscordClient";
import { buildRestockEmbed } from "../DiscordBot/EmbedUtils";
import { TooGoodToGoClient } from "../TooGoodToGoClient/TooGoodToGoClient";

export const handler = async () => {
    const tgtgClient = new TooGoodToGoClient();
    const discordClient = new DiscordClient();
    const db = new Db();
    const bucketItems = await tgtgClient.getFavorites();
    const embeds = bucketItems.map((item) => buildRestockEmbed(item));
    const channelIds = await db.getSubscribedChannels();
    await discordClient.login();
    await Promise.all(channelIds.map((id) => discordClient.sendEmbeds(embeds, id)));
    discordClient.logout();
};