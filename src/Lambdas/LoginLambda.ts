import { TooGoodToGoClient } from "../TooGoodToGoClient/TooGoodToGoClient";
import express from "express";
import serverless from "serverless-http";

const app = express();

app.post("/login/:email", async (req, res, next) => {
  const tgtgClient = new TooGoodToGoClient();
  const { email } = req.params;
  try {
    await tgtgClient.login(email);
    res.send("Login request sent");
  } catch (err) {
    next(err);
  }
});

app.post("/login/:email/continue", async (req, res, next) => {
  const tgtgClient = new TooGoodToGoClient();
  const { email } = req.params;
  try {
    await tgtgClient.continueLogin(email);
    res.send("Login complete");
  } catch (err) {
    next(err);
  }
});

export const handler = serverless(app);
