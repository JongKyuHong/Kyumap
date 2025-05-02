import mongoose, { Document, Schema } from "mongoose";
import { IReply, replySchema } from "./Reply";

export interface IComment extends Document {
  postId: number;
  userNickname: string;
  // userImage: string;
  userEmail: string;
  content: string;
  createdAt: Date;
  Hearts: { email: string }[];
  _count: {
    Hearts: number;
    Comments: number;
  };
  threadId: mongoose.Types.ObjectId;
}

const commentSchema: Schema = new mongoose.Schema({
  postId: {
    type: Number,
    required: true,
  },
  userNickname: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  threadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
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
