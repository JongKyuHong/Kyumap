import mongoose from "mongoose";

interface ICounterDocument extends mongoose.Document {
  _id: string;
  seq: number;
}

const counterSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  seq: {
    type: Number,
    default: 0,
  },
});

const Counter =
  mongoose.models.Counter ||
  mongoose.model<ICounterDocument>("Counter", counterSchema);

export default Counter;
