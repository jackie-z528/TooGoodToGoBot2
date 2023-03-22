import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { SingletonDB } from "../../DB/SingletonDB";
import { TooGoodToGoClient } from "../../TooGoodToGoClient/TooGoodToGoClient";
import { Command } from "./models/Command";

export const releaseItemsCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("release-orders")
    .setDescription("Release orders when you are ready to reserve them")
    .addStringOption((option) =>
      option
        .setName("email")
        .setDescription("Email to login with")
        .setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const email = interaction.options.getString("email");
    if (!email) return;
    const client = new TooGoodToGoClient();
    const db = SingletonDB;
    const user = await db.getUser(email);
    try {
      await client.releaseItems(user);
      await interaction.reply(`Successfully released orders for ${email}`);
    } catch (err) {
      await interaction.reply(`Error releasing orders for ${email}`);
    }
  },
};
