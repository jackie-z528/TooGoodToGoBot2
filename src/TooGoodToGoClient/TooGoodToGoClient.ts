import { Db } from "../DB/Db";
import {
  EmailAuthResponse,
  PollAuthResponse,
  RefreshResponse,
} from "./models/Auth";
import {
  AbortResponse,
  BucketItem,
  BucketResponse,
  OrderResponse,
} from "./models/Bucket";
import { gotScraping, Got } from "got-scraping";
import { CookieJar } from "tough-cookie";
import { User } from "../DB/models/User";
import { compact } from "lodash";
import { SingletonDB } from "../DB/SingletonDB";

const BASE_AUTH_URL = "auth/v3";
const BASE_URL = "https://apptoogoodtogo.com/api/";

export class TooGoodToGoClient {
  private db: Db = SingletonDB;

  public async login(email: string, subscribedChannel: string): Promise<void> {
    const emailAuthResponse: EmailAuthResponse = await this.newClient()
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
    const pollAuthResponse: PollAuthResponse = await this.newClient()
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
        const refreshResponse = await this.refreshToken(user);
        console.log(refreshResponse);
        const { access_token, refresh_token } = refreshResponse;
        if (!access_token || !refresh_token) return;
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
      return this.newClient()
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
    const bucketResponse: BucketResponse = await this.newClient()
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

  public async reserveItem(
    item: BucketItem,
    user: User
  ): Promise<{ orderId: string; item: BucketItem }> {
    const { accessToken } = user;
    const orderResponse: OrderResponse = await this.newClient()
      .post(`order/v7/create/${item.item.item_id}`, {
        json: { item_count: 1 },
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .json();
    console.log(orderResponse);
    if (orderResponse.state === "SUCCESS") {
      return {
        orderId: orderResponse.order.id,
        item,
      };
    } else {
      throw new Error(`Order failed for ${item.display_name}`);
    }
  }

  public async releaseItems(user: User): Promise<void> {
    const { orderIds } = user;
    if (!orderIds || orderIds.length === 0) return;

    await Promise.all(
      orderIds.map((orderId) => this.releaseItem(orderId, user))
    );
  }

  public async releaseItem(orderId: string, user: User): Promise<void> {
    const { accessToken } = user;
    const abortResponse: AbortResponse = await this.newClient()
      .post(`order/v7/${orderId}/abort`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .json();
    console.log(abortResponse);
    if (abortResponse.state !== "SUCCESS") {
      console.error("failed to release order");
    }
  }

  private newClient = (): Got =>
    gotScraping.extend({
      prefixUrl: BASE_URL,
      cookieJar: new CookieJar(),
    });
}
