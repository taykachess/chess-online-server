import { Title } from "./game";

export interface DecodedUser {
  id?: number;
  username: string;
  roles: { name: string }[];
  rating: number;
  filters: { min: number; max: number };
  title?: Title;
}
