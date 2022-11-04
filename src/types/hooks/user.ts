export interface DecodedUser {
  id: number;
  username: string;
  roles: { name: string }[];
}
