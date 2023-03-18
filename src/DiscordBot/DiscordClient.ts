import {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  TextChannel,
} from "discord.js";
import * as _ from "lodash";

export class DiscordClient extends Client {
  constructor() {
    super({ intents: [GatewayIntentBits.Guilds] });
  }

  public async sendEmbeds(embeds: EmbedBuilder[], channelId: string) {
    const channel = (await this.channels.fetch(
      channelId
    )) as unknown as TextChannel;
    const chunkedEmbeds = _.chunk(embeds, 10);
    await Promise.all(
      chunkedEmbeds.map((embed) => channel.send({ embeds: embed }))
    );
  }
}
