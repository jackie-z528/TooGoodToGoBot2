"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TooGoodToGoClient = void 0;
const db_1 = require("../DB/db");
const got_scraping_1 = require("got-scraping");
const tough_cookie_1 = require("tough-cookie");
const BASE_AUTH_URL = "auth/v3";
const BASE_URL = "https://apptoogoodtogo.com/api/";
class TooGoodToGoClient {
    constructor() {
        this.client = got_scraping_1.gotScraping.extend({
            prefixUrl: BASE_URL,
            cookieJar: new tough_cookie_1.CookieJar(),
        });
        this.db = new db_1.Db();
    }
    async login(email) {
        const emailAuthResponse = await this.client
            .post(`${BASE_AUTH_URL}/authByEmail`, {
            json: { email, device_type: "IOS" },
        })
            .json();
        const { polling_id } = emailAuthResponse;
        return this.db.setPollingId(polling_id);
    }
    async continueLogin(email) {
        const polling_id = await this.db.getPollingId();
        const pollAuthResponse = await this.client
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
    async refreshToken() {
        const refreshToken = await this.db.getRefreshToken();
        let refreshResponse;
        try {
            refreshResponse = await this.client
                .post(`${BASE_AUTH_URL}/token/refresh`, {
                json: { refresh_token: refreshToken },
            })
                .json();
        }
        catch (err) {
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
    async getFavorites() {
        const accessToken = await this.db.getAccessToken();
        const userId = await this.db.getUserId();
        const bucketResponse = await this.client
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
exports.TooGoodToGoClient = TooGoodToGoClient;
