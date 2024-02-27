import { IJwtPayload } from './jwt.type';

export type JwtPayloadWithRt = IJwtPayload & { refreshToken: string };
