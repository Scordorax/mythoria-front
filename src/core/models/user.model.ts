export interface UserModel {
  sub: string;           // ID utilisateur (JWT "subject")
  email: string;
  username: string;
  roles: string[];
  exp?: number;          // timestamp d'expiration
}