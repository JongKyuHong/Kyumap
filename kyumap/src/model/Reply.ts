import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./User";

export interface IReply extends Document {
  parent: string;
  userNickname: string;
  userImage: string;
  userEmail: string;
  content: string;
  createdAt: Date;
  Hearts: { email: string }[];
  _count: {
    Hearts: number;
  };
}

export const replySchema: Schema = new mongoose.Schema({
  parent: {
    type: String,
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
  userImage: {
    type: String,
    required: true,
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
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Reply =
  mongoose.models.Reply || mongoose.model<IReply>("Reply", replySchema);

export default Reply;
