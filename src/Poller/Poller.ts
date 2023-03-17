import { Db } from "../DB/Db";
import { TooGoodToGoClient } from "../TooGoodToGoClient/TooGoodToGoClient";
import _, { Dictionary } from "lodash";
import { User } from "../DB/models/User";
import { ItemCount } from "../DB/models/ItemCount";
import { buildRestockEmbed } from "../DiscordBot/EmbedUtils";
import { BucketItem } from "../TooGoodToGoClient/models/Bucket";
import { DiscordClient } from "../DiscordBot/DiscordClient";

const pollUserFavorites = async (user: User, itemCountMap: Dictionary<ItemCount>, client = new TooGoodToGoClient(), discordClient = new DiscordClient()): Promise<ItemCount[]> => {
    if (!user.subscribedChannel) return [];

    console.log(`Polling favorites for ${user.email}`);
    const bucketItems = await client.getFavorites(user);
    const restockedItems: BucketItem[] = [];
    const newItems: ItemCount[] = [];

    bucketItems.forEach((bucketItem) => {
        const id = bucketItem.item.item_id;
        const oldCount = itemCountMap[id]?.count ?? 0;
        if (bucketItem.items_available > oldCount) restockedItems.push(bucketItem);
        newItems.push({ id, count: bucketItem.items_available });
    });

    const embeds = restockedItems.map((item) => buildRestockEmbed(item));

    await discordClient.sendEmbeds(embeds, user.subscribedChannel);

    return newItems;
}

export const pollFavorites = async () => {
   const db = new Db(); 
   const client = new TooGoodToGoClient();
   const discordClient = new DiscordClient();

   const [ users, itemCounts ] = await Promise.all([db.getUsers(), db.getItemCounts(), discordClient.login()]);
   const validUsers = _.filter(users, (user) => Boolean(user.accessToken && user.userId && user.subscribedChannel));
   const itemCountMap = _.keyBy(itemCounts, "id");
   const newItems = await Promise.all(validUsers.map((user) => pollUserFavorites(user, itemCountMap, client, discordClient)));
   const itemsToSave = _.chain(newItems).flatten().uniqBy((itemCount) => itemCount.id).value();
   if (itemsToSave.length > 0) await db.upsertItemCounts(itemsToSave);
   db.close();
};

