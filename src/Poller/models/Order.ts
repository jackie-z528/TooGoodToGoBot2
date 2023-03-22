import { BucketItem } from "../../TooGoodToGoClient/models/Bucket";

export interface OrderResponse {
  orderId: string;
  item: BucketItem;
}
