export interface EmailAuthResponse {
  polling_id: string;
}

export interface EmailAuthRequest {
  device_type: string;
  email: string;
}

export interface PollAuthRequest extends EmailAuthRequest {
  request_polling_id: string;
}

export interface PollAuthResponse {
  access_token: string;
  refresh_token: string;
  startup_data: { user: { user_id: string } };
}

export interface RefreshResponse {
  access_token: string;
  refresh_token: string;
}
