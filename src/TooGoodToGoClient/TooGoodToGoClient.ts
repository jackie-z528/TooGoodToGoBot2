import { Db } from "../DB/Db";
import {
  EmailAuthResponse,
  PollAuthResponse,
  RefreshResponse,
} from "./models/Auth";
import { BucketItem, BucketResponse } from "./models/Bucket";
import { gotScraping, Got } from "got-scraping";
import { CookieJar } from "tough-cookie";
import { User } from "../DB/models/User";
import { compact } from "lodash";
import { SingletonDB } from "../DB/SingletonDB";

const BASE_AUTH_URL = "auth/v3";
const BASE_URL = "https://apptoogoodtogo.com/api/";

export class TooGoodToGoClient {
  private client: Got;
  private db: Db = SingletonDB;

  constructor() {
    this.client = gotScraping.extend({
      prefixUrl: BASE_URL,
      cookieJar: new CookieJar(),
    });
  }

  public async login(email: string, subscribedChannel: string): Promise<void> {
    const emailAuthResponse: EmailAuthResponse = await this.client
      .post(`${BASE_AUTH_URL}/authByEmail`, {
        json: { email, device_type: "IOS" },
      })
      .json();
    const { polling_id } = emailAuthResponse;
    await this.db.upsertUser({
      email,
      pollingId: polling_id,
      subscribedChannel,
    });
  }

  public async continueLogin(email: string): Promise<void> {
    const user = await this.db.getUser(email);
    if (!user || !user.pollingId) {
      throw new Error("User not found");
    }
    const { pollingId: polling_id } = user;
    const pollAuthResponse: PollAuthResponse = await this.client
      .post(`${BASE_AUTH_URL}/authByRequestPollingId`, {
        json: {
          request_polling_id: polling_id,
          email,
          device_type: "IOS",
        },
      })
      .json();
    console.log(pollAuthResponse);
    const { access_token, refresh_token } = pollAuthResponse;
    const { user_id } = pollAuthResponse.startup_data.user;

    await this.db.upsertUser({
      email,
      accessToken: access_token,
      refreshToken: refresh_token,
      userId: user_id,
    });
  }

  public async refreshTokens(): Promise<void> {
    console.log("refreshing tokens");
    const users = await this.db.getUsers();
    const newUsers = await Promise.all(
      users.map(async (user) => {
        if (!user.refreshToken) return;
        const { access_token, refresh_token } = await this.refreshToken(user);
        return {
          ...user,
          accessToken: access_token,
          refreshToken: refresh_token,
        };
      })
    );

    await this.db.upsertUsers(compact(newUsers));
  }

  private async refreshToken(user: User): Promise<RefreshResponse> {
    const { refreshToken } = user;
    try {
      return this.client
        .post(`${BASE_AUTH_URL}/token/refresh`, {
          json: { refresh_token: refreshToken },
        })
        .json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  public async getFavorites(user: User): Promise<BucketItem[]> {
    const { accessToken, userId } = user;
    const bucketResponse: BucketResponse = await this.client
      .post("item/v8/", {
        json: {
          favorites_only: true,
          user_id: userId,
          origin: {
            latitude: 0,
            longitude: 0,
          },
          radius: 1,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .json();

    if (!bucketResponse.items) {
      console.log(bucketResponse);
      return [];
    }

    return bucketResponse.items;
  }
}
