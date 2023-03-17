import { MongoClient } from "mongodb";
import { Env } from "../Env";
import { ItemCount } from "./models/ItemCount";
import { User } from "./models/User";
export class Db {
  private client: MongoClient;
  constructor() {
    this.client = new MongoClient(Env.DB_URL);
  }

  public upsertUser = async (user: Partial<User>): Promise<void> => {
    if (!user.email) {
      return;
    }

    await this.client.connect();
    await this.client
      .db()
      .collection("User")
      .updateOne({ email: user.email }, { $set: user }, { upsert: true });
    return this.client.close();
  };

  public upsertUsers = async (users: User[]): Promise<void> => {
    const upsertRequests = users.map((user) => ({
      updateOne: {
        filter: { email: user.email },
        update: user,
        upsert: true,
      },
    }));

    await this.client.connect();
    await this.client.db().collection("User").bulkWrite(upsertRequests);
    return this.client.close();
  };

  public getUser = async (email: string): Promise<User> => {
    await this.client.connect();
    const users = (await this.client
      .db()
      .collection("User")
      .findOne({ email })) as unknown as User;
    this.client.close();
    return users;
  };

  public getUsers = async (): Promise<User[]> => {
    await this.client.connect();
    const users = (await this.client
      .db()
      .collection("User")
      .find()
      .toArray()) as unknown as User[];
    this.client.close();
    return users;
  };

  public upsertItemCounts = async (itemCounts: ItemCount[]): Promise<void> => {
    const upsertRequests = itemCounts.map((itemCount) => ({
      updateOne: {
        filter: { id: itemCount.id },
        update: itemCount,
        upsert: true,
      },
    }));

    await this.client.connect();
    await this.client.db().collection("ItemCount").bulkWrite(upsertRequests);
    return this.client.close();
  };

  public getItemCounts = async (): Promise<ItemCount[]> => {
    await this.client.connect();
    const itemCounts = (await this.client
      .db()
      .collection("ItemCount")
      .find()
      .toArray()) as unknown as ItemCount[];
    this.client.close();
    return itemCounts;
  };
}
