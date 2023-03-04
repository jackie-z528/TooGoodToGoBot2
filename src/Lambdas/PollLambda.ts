import { Db } from "../DB/db";
import { DiscordClient } from "../DiscordBot/DiscordClient";
import { buildRestockEmbed } from "../DiscordBot/EmbedUtils";
import { TooGoodToGoClient } from "../TooGoodToGoClient/TooGoodToGoClient";
import * as _ from "lodash";
import { BucketItem } from "../TooGoodToGoClient/models/Bucket";
import { Item } from "../DB/models/Item";

export const handler = async () => {
  const tgtgClient = new TooGoodToGoClient();
  const discordClient = new DiscordClient();
  const db = new Db();

  const bucketItems = await tgtgClient.getFavorites();
  // Array of item ids to grab from db
  const itemIds = bucketItems.map((item) => `${item.item.item_id}Count`);
  const itemCounts = await db.getItems(itemIds);
  const itemCountMap = _.keyBy(itemCounts, "key");

  const restockedItems: BucketItem[] = [];
  const newItemValues: Item[] = [];

  bucketItems.forEach((bucketItem) => {
    const key = `${bucketItem.item.item_id}Count`;
    const oldCount = itemCountMap[key] ? Number(itemCountMap[key].value) : 0;
    // If new stock > old, send notification
    if (bucketItem.items_available > oldCount) restockedItems.push(bucketItem);
    newItemValues.push({ key, value: bucketItem.items_available.toString() });
  });

  const embeds = restockedItems.map((item) => buildRestockEmbed(item));
  const channelIds = await db.getSubscribedChannels();
  await discordClient.login();
  // Saving new item values and sending discord messages can be done in parallel
  await Promise.all([
    ...channelIds.map((id) => discordClient.sendEmbeds(embeds, id)),
    db.putItems(newItemValues),
  ]);
  discordClient.logout();
};
