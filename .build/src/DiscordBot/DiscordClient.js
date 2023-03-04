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
exports.DiscordClient = void 0;
const discord_js_1 = require("discord.js");
const Env_1 = require("../Env");
const _ = __importStar(require("lodash"));
class DiscordClient {
    constructor() {
        this.client = new discord_js_1.Client({ intents: [discord_js_1.GatewayIntentBits.Guilds] });
    }
    async login() {
        return this.client.login(Env_1.Env.DISCORD_TOKEN);
    }
    async logout() {
        return this.client.destroy();
    }
    async sendEmbeds(embeds, channelId) {
        const channel = await this.client.channels.fetch(channelId);
        const chunkedEmbeds = _.chunk(embeds, 10);
        await Promise.all(chunkedEmbeds.map((embed) => channel.send({ embeds: embed })));
    }
}
exports.DiscordClient = DiscordClient;
