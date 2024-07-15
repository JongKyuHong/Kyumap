import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./User";
import { IReply, replySchema } from "./Reply";

export interface IComment extends Document {
  postId: number;
  User: IUser;
  content: string;
  createdAt: Date;
  Hearts: { email: string }[];
  _count: {
    Hearts: number;
    Comments: number;
  };
  reply: IReply[];
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
  Hearts: [
    {
      email: { type: String },
    },
  ],
  reply: [
    {
      type: replySchema,
      default: [],
    },
  ],
  _count: {
    Hearts: { type: Number, default: 0 },
    Comments: { type: Number, default: 0 },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Comment =
  mongoose.models.Comment || mongoose.model<IComment>("Comment", commentSchema);

export default Comment;
