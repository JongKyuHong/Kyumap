import mongoose, { Document, Schema } from "mongoose";
import { userSchema, IUser } from "./User";

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
    nickname: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String, required: true },
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Comment =
  mongoose.models.Comment || mongoose.model<IComment>("Comment", commentSchema);

export default Comment;
