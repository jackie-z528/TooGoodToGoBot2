import { TooGoodToGoClient } from "./TooGoodToGoClient/TooGoodToGoClient";

const client = new TooGoodToGoClient();
client
  .getFavorites()
  .then((items) => items.forEach((item) => console.log(item)));
