import { Post } from "./Post";

export interface User {
  id: string;
  nickname: string;
  image: string;
  posts: Post[];
}
