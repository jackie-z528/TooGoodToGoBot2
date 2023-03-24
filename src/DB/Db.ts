import { MongoClient } from "mongodb";
import { Env } from "../Env";
import { ItemCount } from "./models/ItemCount";
import { User } from "./models/User";
export class Db {
  private client: MongoClient;
  constructor() {
    this.client = new MongoClient(Env.DB_URL);
  }

  public close = () => {
    return this.client.close();
  };

  public upsertUser = async (user: Partial<User>): Promise<void> => {
    if (!user.email) {
      return;
    }

    await this.client
      .db()
      .collection("User")
      .updateOne({ email: user.email }, { $set: user }, { upsert: true });
  };

  public upsertUsers = async (users: User[]): Promise<void> => {
    if (users.length === 0) return;
    const upsertRequests = users.map((user) => ({
      updateOne: {
        filter: { email: user.email },
        update: { $set: user },
        upsert: true,
      },
    }));

    await this.client.db().collection("User").bulkWrite(upsertRequests);
  };

  public getUser = async (email: string): Promise<User> => {
    const users = (await this.client
      .db()
      .collection("User")
      .findOne({ email })) as unknown as User;
    return users;
  };

  public getUsers = async (): Promise<User[]> => {
    const users = (await this.client
      .db()
      .collection("User")
      .find()
      .toArray()) as unknown as User[];
    return users;
  };

  public upsertItemCounts = async (itemCounts: ItemCount[]): Promise<void> => {
    if (itemCounts.length ===0) return;
    const upsertRequests = itemCounts.map((itemCount) => ({
      updateOne: {
        filter: { id: itemCount.id },
        update: { $set: itemCount },
        upsert: true,
      },
    }));

    await this.client.db().collection("ItemCount").bulkWrite(upsertRequests);
  };

  public getItemCounts = async (): Promise<ItemCount[]> => {
    const itemCounts = (await this.client
      .db()
      .collection("ItemCount")
      .find()
      .toArray()) as unknown as ItemCount[];
    return itemCounts;
  };
}
