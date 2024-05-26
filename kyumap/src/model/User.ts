import mongoose, { Document, Schema } from "mongoose";

interface UserID {
  id: string;
}

// interface Image {
//   size: number;
//   type: string;
//   name: string;
//   lastModified: number;
// }

export interface IUser extends Document {
  id: string;
  nickname: string;
  image: string;
  Followers: UserID[];
  _count: {
    Followers: number;
    Followings: number;
  };
}

export const userSchema: Schema = new mongoose.Schema({
  id: {
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
  // image: {
  //   size: { type: Number },
  //   Imgtype: { type: String },
  //   name: { type: String },
  //   lastModified: { type: Number },
  // },
  Followers: [
    {
      userId: String,
    },
  ],
  _count: {
    Followers: Number,
    Followings: Number,
  },
});

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
