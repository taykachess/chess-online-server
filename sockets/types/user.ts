import { Title } from "./game";

export interface DecodedUser {
  id?: number;
  username: string;
  roles: { name: string }[];
  rating: number;
  title?: Title;
}
