import { getEnvString } from "./EnvUtils";
import * as dotenv from "dotenv";
dotenv.config();

export const Env = {
  TABLE_NAME: getEnvString("TABLE_NAME", ""),
  AWS_REGION: getEnvString("REGION", ""),
};
