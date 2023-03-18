import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
export interface Command {
  data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  execute: (interaction: ChatInputCommandInteraction) => void;
}
