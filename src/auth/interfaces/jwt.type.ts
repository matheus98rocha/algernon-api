import { Request } from 'express';

export interface IJwtPayload {
  sub: number;
  email: string;
}

export interface IGetUserAuthInfoRequest extends Request {
  user: any;
}
