import AWS from "aws-sdk";
import {
  BatchGetRequestMap,
  BatchWriteItemRequestMap,
  AttributeValue,
  PutItemInputAttributeMap,
} from "aws-sdk/clients/dynamodb";
import { Env } from "../Env";
import { throwItemNotFound } from "./Error";
import { Item } from "./models/Item";

export class Db {
  private dynamoInstance: AWS.DynamoDB.DocumentClient;
  private tableName: string;
  constructor() {
    AWS.config.update({ region: Env.AWS_REGION });
    this.dynamoInstance = new AWS.DynamoDB.DocumentClient();
    this.tableName = Env.TABLE_NAME;
  }

  public setPollingId = async (pollingId: string): Promise<void> =>
    this.putItem({ key: "pollingId", value: pollingId });

  public getPollingId = async (): Promise<string> =>
    (await this.getItem("pollingId")).value;

  public setAccessToken = async (accessToken: string): Promise<void> =>
    this.putItem({ key: "accessToken", value: accessToken });

  public getAccessToken = async (): Promise<string> =>
    (await this.getItem("accessToken")).value;

  public setRefreshToken = async (refreshToken: string): Promise<void> =>
    this.putItem({ key: "refreshToken", value: refreshToken });

  public getRefreshToken = async (): Promise<string> =>
    (await this.getItem("refreshToken")).value;

  public setUserId = async (userId: string): Promise<void> =>
    this.putItem({ key: "userId", value: userId });

  public getUserId = async (): Promise<string> =>
    (await this.getItem("userId")).value;

  public async getItem(key: string): Promise<Item> {
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
    return (item as Item) ?? throwItemNotFound();
  }

  private async putItem(item: Item): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: item,
    };
    await this.dynamoInstance.put(params).promise();
  }

  public async getItems(keys: string[]): Promise<Item[]> {
    const keysObject = keys.map((key) => ({ key: key as AttributeValue }));
    const RequestItems: BatchGetRequestMap = {};
    RequestItems[this.tableName] = { Keys: keysObject };
    const output = await this.dynamoInstance
      .batchGet({ RequestItems })
      .promise();
    if (!output.Responses) {
      return throwItemNotFound();
    }

    return output.Responses[this.tableName] as Item[];
  }

  public async putItems(items: Item[]): Promise<void> {
    const RequestItems: BatchWriteItemRequestMap = {};
    const writeRequests = items.map((item) => ({
      PutRequest: { Item: item as unknown as PutItemInputAttributeMap },
    }));
    RequestItems[this.tableName] = writeRequests;
    await this.dynamoInstance.batchWrite({ RequestItems }).promise();
  }
}
