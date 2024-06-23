import { IUser } from "./User";
import { HashTag } from "./HashTag";

export interface SearchResult {
  User: IUser;
  HashTag: HashTag;
}
