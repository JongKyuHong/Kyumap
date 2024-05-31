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
  image: string;
  Followers: UserID[];
  _count: {
    Followers: number;
    Followings: number;
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
  image: {
    type: String,
    required: true,
  },
  Followers: [
    {
      email: { type: String },
    },
  ],
  _count: {
    Followers: { type: Number },
    Followings: { type: Number },
  },
});

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
