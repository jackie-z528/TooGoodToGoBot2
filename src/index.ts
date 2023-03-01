// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();
import { TooGoodToGoClient } from "./TooGoodToGoService/Client/TooGoodToGoClient";
import readline from "readline";
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const tooGoodToGoClient = new TooGoodToGoClient();
/*tooGoodToGoClient.login();
rl.question("Continue login", () => {
  tooGoodToGoClient.continueLogin();
});*/
