import { User } from "./User";

export interface Comment {
  postId: number;
  User: User;
  content: string;
  createdAt: Date;
}
