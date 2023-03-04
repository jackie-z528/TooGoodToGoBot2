import { Db } from "../DB/db";
import {
  EmailAuthResponse,
  PollAuthResponse,
  RefreshResponse,
} from "./models/Auth";
import { BucketItem, BucketResponse } from "./models/Bucket";
import { gotScraping, Got } from "got-scraping";
import { CookieJar } from "tough-cookie";

const BASE_AUTH_URL = "auth/v3";
const BASE_URL = "https://apptoogoodtogo.com/api/";

export class TooGoodToGoClient {
  private client: Got;
  private db: Db;

  constructor() {
    this.client = gotScraping.extend({
      prefixUrl: BASE_URL,
      cookieJar: new CookieJar(),
    });

    this.db = new Db();
  }

  public async login(email: string): Promise<void> {
    const emailAuthResponse: EmailAuthResponse = await this.client
      .post(`${BASE_AUTH_URL}/authByEmail`, {
        json: { email, device_type: "IOS" },
      })
      .json();
    const { polling_id } = emailAuthResponse;
    return this.db.setPollingId(polling_id);
  }

  public async continueLogin(email: string): Promise<void> {
    const polling_id = await this.db.getPollingId();
    const pollAuthResponse: PollAuthResponse = await this.client
      .post(`${BASE_AUTH_URL}/authByRequestPollingId`, {
        json: {
          request_polling_id: polling_id,
          email,
          device_type: "IOS",
        },
      })
      .json();
    const { access_token, refresh_token } = pollAuthResponse;
    const { user_id } = pollAuthResponse.startup_data.user;
    await Promise.all([
      this.db.setAccessToken(access_token),
      this.db.setRefreshToken(refresh_token),
      this.db.setUserId(user_id),
    ]);
  }

  public async refreshToken(): Promise<void> {
    const refreshToken = await this.db.getRefreshToken();
    let refreshResponse: RefreshResponse;
    try {
      refreshResponse = await this.client
        .post(`${BASE_AUTH_URL}/token/refresh`, {
          json: { refresh_token: refreshToken },
        })
        .json();
    } catch (err) {
      console.error(err);
      throw err;
    }
    console.log(refreshResponse);
    const { access_token, refresh_token } = refreshResponse;
    await Promise.all([
      this.db.setAccessToken(access_token),
      this.db.setRefreshToken(refresh_token),
    ]);
  }

  public async getFavorites(): Promise<BucketItem[]> {
    const [accessToken, userId] = await Promise.all([
      this.db.getAccessToken(),
      this.db.getUserId(),
    ]);
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
    return bucketResponse.items;
  }
}
