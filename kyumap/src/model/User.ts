import mongoose, { Document, Schema } from "mongoose";

interface UserID {
  email: string;
}

// interface Image {
//   size: number;
//   type: string;
//   name: string;
//   lastModified: number;
// }

export interface IUser extends Document {
  email: string;
  nickname: string;
  password: string;
  image: string;
  Followers: UserID[];
  Followings: UserID[];
  Saved: string[];
  Info: {
    website: string;
    intro: string;
    gender: string;
  };
  _count: {
    Followers: number;
    Followings: number;
    posts: number;
  };
}

export const userSchema: Schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  Saved: [
    {
      id: { type: String },
    },
  ],
  Followers: [
    {
      email: { type: String },
    },
  ],
  Followings: [
    {
      email: { type: String },
    },
  ],
  Info: {
    website: { type: String, default: "" },
    intro: { type: String, default: "" },
    gender: { type: String, default: "" },
  },
  _count: {
    Followers: { type: Number, default: 0 },
    Followings: { type: Number, default: 0 },
    posts: { type: Number, default: 0 },
  },
});

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
