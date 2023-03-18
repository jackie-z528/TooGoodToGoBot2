export interface User {
  email: string;
  pollingId: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
  subscribedChannel?: string;
}
