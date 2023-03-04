import {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    TextChannel,
    APIEmbed
} from "discord.js";
import { Env } from "../Env";
import * as _ from "lodash";

export class DiscordClient {
    private client: Client;
    constructor() {
        this.client = new Client({ intents: [GatewayIntentBits.Guilds] });
    }

    public async login() {
        return this.client.login();
    }

    public async logout() {
        return this.client.destroy();
    }

    public async sendEmbeds(embeds: EmbedBuilder[], channelId: string) {
        const channel = await this.client.channels.fetch(channelId) as unknown as TextChannel;
        const chunkedEmbeds = _.chunk(embeds, 10);
        await Promise.all(chunkedEmbeds.map((embed) => channel.send({ embeds: embed })));
    }
}
