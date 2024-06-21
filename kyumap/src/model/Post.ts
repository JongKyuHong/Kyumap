import mongoose, { Document, Schema } from "mongoose";
import { userSchema, IUser } from "./User";
import getNextSequenceValue from "./getNextSequenceValue";

interface UserID {
  email: string;
}

export interface IPost extends Document {
  postId: number;
  User: IUser;
  content: string;
  createdAt: Date;
  Images: string[];
  altTexts: string[];
  Hearts: UserID[];
  hideLikesAndViews: Boolean;
  hideComments: Boolean;
  reels: Boolean;
  _count: {
    Hearts: number;
    Comments: number;
  };
}

const postSchema: Schema = new mongoose.Schema({
  postId: {
    type: Number,
    required: true,
    unique: true,
  },
  User: {
    type: userSchema,
    required: true,
  },
  content: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  Images: [
    {
      type: String,
      required: true,
    },
  ],
  altTexts: [
    {
      type: String,
    },
  ],
  Hearts: [
    {
      email: { type: String },
    },
  ],
  hideLikesAndViews: {
    type: Boolean,
    default: false,
  },
  hideComments: {
    type: Boolean,
    default: false,
  },
  reels: {
    type: Boolean,
  },
  _count: {
    Hearts: { type: Number, default: 0 },
    Comments: { type: Number, default: 0 },
  },
});

postSchema.pre<IPost>("save", async function (next) {
  if (this.isNew) {
    try {
      this.postId = await getNextSequenceValue("postId");
    } catch (error) {
      const castError = error as Error;
      console.error(castError.message);
      // `next` 함수에 `castError` 전달
      next(castError);
      return;
    }
  }
  next();
});

const Post = mongoose.models.Post || mongoose.model<IPost>("Post", postSchema);

export default Post;
