import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./User";

export interface IComment extends Document {
  postId: number;
  User: IUser;
  content: string;
  createdAt: Date;
}

const commentSchema: Schema = new mongoose.Schema({
  postId: {
    type: Number,
    required: true,
  },
  User: {
    email: Number,
    nickname: String,
    image: String,
    Followers: String,
    _count: {
      Followers: Number,
      Followings: Number,
    },
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

const Comment =
  mongoose.models.Comment || mongoose.model<IComment>("Comment", commentSchema);

export default Comment;
