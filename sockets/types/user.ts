import { Title } from "./game";

export interface DecodedUser {
  username: string;
  roles: { name: string }[];
  rating: number;
  title?: Title;
}
