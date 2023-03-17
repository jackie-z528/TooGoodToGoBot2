import { Client, Collection, GatewayIntentBits, Events } from "discord.js";
import { commands } from "./commands/Commands";
import { Command } from "./commands/models/Command";
import { Env } from "../Env";

export const start = () => {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  const clientCommands = new Collection<string, Command>();
  commands.forEach((command) => {
    clientCommands.set(command.data.name, command);
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = clientCommands.get(interaction.commandName);
    if (!command) {
      console.error(`No command matching ${interaction.commandName}`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (err) {
      console.error(`Error executing ${interaction.commandName}: ${err}`);
    }
  });

  client.login(Env.DISCORD_TOKEN);
};
