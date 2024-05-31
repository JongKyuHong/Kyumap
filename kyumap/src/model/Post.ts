import mongoose, { Document, Schema } from "mongoose";
import { userSchema, IUser } from "./User";
import { PostImage } from "./PostImage";
import { HashTag } from "./HashTag";
import Counter from "./Counter";
import getNextSequenceValue from "./getNextSequenceValue";

interface UserID {
  email: string;
}

export interface IPost extends Document {
  postId: number;
  User: IUser;
  content: string;
  createdAt: Date;
  Images: PostImage[];
  Hearts: UserID[];
  Comments: UserID[];
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
    required: true,
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
  Hearts: [
    {
      email: { type: String },
    },
  ],
  Comments: [
    {
      type: String,
    },
  ],
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
