import { getEnvString } from "./EnvUtils";
import * as dotenv from "dotenv";
dotenv.config();

export const Env = {
  DISCORD_TOKEN: getEnvString("DISCORD_TOKEN", ""),
  DB_URL: getEnvString("DB_URL", ""),
  DB_NAME: getEnvString("DB_NAME", "")
};
