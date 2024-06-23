import mongoose, { Document, Schema } from "mongoose";
import { IPost } from "./Post";
import { IUser } from "./User";

export interface PostImage extends Document {
  link: string;
  imageId: string;
  Post?: IPost;
}

const postImageSchema: Schema = new mongoose.Schema({
  link: {
    type: String,
    required: true,
  },
  imageId: {
    type: String,
    required: true,
  },
});

const PostImage =
  mongoose.models.PostImage ||
  mongoose.model<PostImage>("PostImage", postImageSchema);

export default PostImage;
