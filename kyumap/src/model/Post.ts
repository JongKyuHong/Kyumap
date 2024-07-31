import mongoose, { Document, Schema } from "mongoose";
import getNextSequenceValue from "./getNextSequenceValue";

interface UserID {
  email: string;
}

export interface IPost extends Document {
  postId: number;
  userEmail: string;
  userImage: string;
  userNickname: string;
  title: string;
  content: string;
  createdAt: Date;
  Images: string[];
  altTexts: string[];
  Hearts: UserID[];
  hideLikesAndViews: Boolean;
  hideComments: Boolean;
  reels: Boolean;
  position: {
    lat: string;
    lng: string;
  };
  thumbnail: string; // 섬네일 추가
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
  userEmail: {
    type: String,
    required: true,
  },
  userImage: {
    type: String,
    required: true,
  },
  userNickname: {
    type: String,
    required: true,
  },
  title: {
    type: String,
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
  position: {
    lat: { type: String, default: "" },
    lng: { type: String, default: "" },
  },
  thumbnail: {
    type: String, // 섬네일 추가
  },
  _count: {
    Hearts: { type: Number, default: 0 },
    Comments: { type: Number, default: 0 },
  },
});

postSchema.pre<IPost>("save", async function (next) {
  if (this.isNew && !this.postId) {
    try {
      this.postId = await getNextSequenceValue("postId");
    } catch (error) {
      const castError = error as Error;
      console.error(castError.message);
      next(castError);
      return;
    }
  }
  next();
});

const Post = mongoose.models.Post || mongoose.model<IPost>("Post", postSchema);

export default Post;
