"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const db_1 = require("../DB/db");
const DiscordClient_1 = require("../DiscordBot/DiscordClient");
const EmbedUtils_1 = require("../DiscordBot/EmbedUtils");
const TooGoodToGoClient_1 = require("../TooGoodToGoClient/TooGoodToGoClient");
const _ = __importStar(require("lodash"));
const handler = async () => {
    const tgtgClient = new TooGoodToGoClient_1.TooGoodToGoClient();
    const discordClient = new DiscordClient_1.DiscordClient();
    const db = new db_1.Db();
    const bucketItems = await tgtgClient.getFavorites();
    // Array of item ids to grab from db
    const itemIds = bucketItems.map((item) => `${item.item.item_id}Count`);
    const itemCounts = await db.getItems(itemIds);
    const itemCountMap = _.keyBy(itemCounts, "key");
    const restockedItems = [];
    const newItemValues = [];
    bucketItems.forEach((bucketItem) => {
        const key = `${bucketItem.item.item_id}Count`;
        const oldCount = itemCountMap[key] ? Number(itemCountMap[key].value) : 0;
        // If new stock > old, send notification
        if (bucketItem.items_available > oldCount)
            restockedItems.push(bucketItem);
        newItemValues.push({ key, value: bucketItem.items_available.toString() });
    });
    const embeds = restockedItems.map((item) => (0, EmbedUtils_1.buildRestockEmbed)(item));
    const channelIds = await db.getSubscribedChannels();
    await discordClient.login();
    // Saving new item values and sending discord messages can be done in parallel
    await Promise.all([...channelIds.map((id) => discordClient.sendEmbeds(embeds, id)), db.putItems(newItemValues)]);
    discordClient.logout();
};
exports.handler = handler;
(0, exports.handler)();
