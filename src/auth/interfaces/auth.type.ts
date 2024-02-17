import { Request } from 'express';

export interface ITokens {
  access_token: string;
  refresh_token: string;
}

export interface AuthenticationRequest extends Request {
  user: {
    sub: string;
    email: string;
  }; // define your type
}
