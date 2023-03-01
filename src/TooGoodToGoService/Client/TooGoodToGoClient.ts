import axios, { AxiosInstance } from "axios";
import { config } from "../../Config/Config";

const BASE_AUTH_URL = "/auth/v3";

export class TooGoodToGoClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: "https://apptoogoodtogo.com/api",
            headers: { "User-Agent": "iPhone 14" },
        });
    }

    public async login(): Promise<void> {
        await this.client
            .post(`${BASE_AUTH_URL}/authByEmail`, config.get("api.auth"))
            .then((resp) => resp.data);
    }

    public async continueLogin(): Promise<void> {
        await this.client
            .post(`${BASE_AUTH_URL}/authByRequestPollingId`, {
                device_type: "IOS",
                //request_polling_id: this.pollingId,
            })
            .then((resp) => console.log(resp.data));
    }
}
