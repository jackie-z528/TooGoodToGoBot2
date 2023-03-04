"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TooGoodToGoClient_1 = require("../TooGoodToGoClient/TooGoodToGoClient");
module.exports.handler = async () => {
    const tgtgClient = new TooGoodToGoClient_1.TooGoodToGoClient();
    await tgtgClient.refreshToken();
};
