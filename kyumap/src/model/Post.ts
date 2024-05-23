import mongoose, { Document, Schema } from "mongoose";
import { userSchema, IUser } from "./User";
import { PostImage } from "./PostImage";
import { HashTag } from "./HashTag";

interface UserID {
  userId: string;
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
  hashTag: HashTag[];
}

const postSchema: Schema = new mongoose.Schema({
  postId: {
    type: Number,
    required: true,
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
  },
  Images: [
    {
      link: String,
      imageId: String,
    },
  ],
  Hearts: [
    {
      userId: Number,
    },
  ],
  Comments: [
    {
      userId: Number,
    },
  ],
  _count: {
    Hearts: Number,
    Comments: Number,
  },
  hashTag: [
    {
      tagId: Number,
      title: String,
      count: Number,
    },
  ],
});

const Post = mongoose.models.Post || mongoose.model<IPost>("Post", postSchema);

export default Post;
