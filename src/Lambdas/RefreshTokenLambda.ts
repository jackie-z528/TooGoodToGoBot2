import { TooGoodToGoClient } from "../TooGoodToGoClient/TooGoodToGoClient";

module.exports.handler = async () => {
  const tgtgClient = new TooGoodToGoClient();
  await tgtgClient.refreshToken();
};
