"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const TooGoodToGoClient_1 = require("../TooGoodToGoClient/TooGoodToGoClient");
const express_1 = __importDefault(require("express"));
const serverless_http_1 = __importDefault(require("serverless-http"));
const app = (0, express_1.default)();
app.post("/login/:email", async (req, res, next) => {
    const tgtgClient = new TooGoodToGoClient_1.TooGoodToGoClient();
    const { email } = req.params;
    try {
        await tgtgClient.login(email);
        res.send("Login request sent");
    }
    catch (err) {
        next(err);
    }
});
app.post("/login/:email/continue", async (req, res, next) => {
    const tgtgClient = new TooGoodToGoClient_1.TooGoodToGoClient();
    const { email } = req.params;
    try {
        await tgtgClient.continueLogin(email);
        res.send("Login complete");
    }
    catch (err) {
        next(err);
    }
});
exports.handler = (0, serverless_http_1.default)(app);
