"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Db = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const Env_1 = require("../Env");
const Error_1 = require("./Error");
class Db {
    constructor() {
        this.setPollingId = async (pollingId) => this.putItem({ key: "pollingId", value: pollingId });
        this.getPollingId = async () => (await this.getItem("pollingId")).value;
        this.setAccessToken = async (accessToken) => this.putItem({ key: "accessToken", value: accessToken });
        this.getAccessToken = async () => (await this.getItem("accessToken")).value;
        this.setRefreshToken = async (refreshToken) => this.putItem({ key: "refreshToken", value: refreshToken });
        this.getRefreshToken = async () => (await this.getItem("refreshToken")).value;
        this.setUserId = async (userId) => this.putItem({ key: "userId", value: userId });
        this.getUserId = async () => (await this.getItem("userId")).value;
        this.getSubscribedChannels = async () => (await this.getItem("subscribedChannels")).valueList?.values ?? [];
        this.getItem = async (key) => {
            const params = {
                TableName: this.tableName,
                Key: {
                    key,
                },
            };
            const item = await this.dynamoInstance
                .get(params)
                .promise()
                .then((item) => item.Item);
            return item ?? (0, Error_1.throwItemNotFound)();
        };
        this.putItem = async (item) => {
            const params = {
                TableName: this.tableName,
                Item: item,
            };
            await this.dynamoInstance.put(params).promise();
        };
        this.getItems = async (keys) => {
            const keysObject = keys.map((key) => ({ key: key }));
            const RequestItems = {};
            RequestItems[this.tableName] = { Keys: keysObject };
            const output = await this.dynamoInstance
                .batchGet({ RequestItems })
                .promise();
            if (!output.Responses) {
                return [];
            }
            return output.Responses[this.tableName];
        };
        this.putItems = async (items) => {
            const RequestItems = {};
            const writeRequests = items.map((item) => ({
                PutRequest: { Item: item },
            }));
            RequestItems[this.tableName] = writeRequests;
            await this.dynamoInstance.batchWrite({ RequestItems }).promise();
        };
        aws_sdk_1.default.config.update({ region: Env_1.Env.AWS_REGION });
        this.dynamoInstance = new aws_sdk_1.default.DynamoDB.DocumentClient();
        this.tableName = Env_1.Env.TABLE_NAME;
    }
}
exports.Db = Db;
