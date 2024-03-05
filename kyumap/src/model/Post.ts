import { PostImage } from "./PostImage";
import { User } from "./User";
import { HashTag } from "./HashTag";

export interface Post {
  postId: number;
  User: User;
  content: string;
  createdAt: Date;
  Images: PostImage[];
  hashTag: HashTag[];
}
