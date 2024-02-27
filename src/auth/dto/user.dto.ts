export interface AuthDto {
  id: string;
  name: string;
  email: string;
  password: string;
  hash: string;
  hashedRefreshToken: string;
}
