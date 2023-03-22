import { Db } from "./DB/Db";
import { TooGoodToGoClient } from "./TooGoodToGoClient/TooGoodToGoClient";

const client = new TooGoodToGoClient();
const db = new Db();
db.getUsers().then((users) => {
  users.forEach((user) => {
    client.releaseItem("obj5nddlpra", user);
  });
});
