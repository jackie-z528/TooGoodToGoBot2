import { REST, Routes } from "discord.js";
import { commands } from "./commands/Commands";
import { Env } from "../Env";

const jsonCommands = commands.map((command) => command.data.toJSON());

const rest = new REST({ version: "10" }).setToken(Env.DISCORD_TOKEN);

(async () => {
  try {
    console.log(`Refreshing ${commands.length} application commands.`);
    const data = await rest.put(
      Routes.applicationCommands(Env.DISCORD_CLIENT_ID),
      { body: jsonCommands }
    );
    console.log(data);
  } catch (err) {
    console.error(err);
  }
})();
