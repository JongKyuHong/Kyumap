import { PostImage } from "./PostImage";
import { User } from "./User";
import { HashTag } from "./HashTag";

interface UserID {
  userId: string;
}

export interface Post {
  postId: number;
  User: User;
  content: string;
  createdAt: Date;
  Images: PostImage[];
  Hearts: UserID[];
  Comments: UserID[];
  _count: {
    Hearts: number;
    Comments: number;
  };
  hashTag: HashTag[];
}
