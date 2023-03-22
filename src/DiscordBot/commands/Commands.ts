import { loginCommand, continueLoginCommand } from "./Login";
import { Command } from "./models/Command";
import { releaseItemsCommand } from "./ReleaseItems";
export const commands: Command[] = [
  loginCommand,
  continueLoginCommand,
  releaseItemsCommand,
];
