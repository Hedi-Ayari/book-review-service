import mongoose, { Schema, Document } from "mongoose";

export interface IBook extends Document {
  title: string;
  author: string;
  genre: string;
  coverImage?: string;
  createdAt: Date;
  deleted: boolean;
  updatedAt: Date;
}

const bookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    genre: { type: String, required: true, trim: true },
    deleted: { type: Boolean, default: false },
    coverImage: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IBook>("Book", bookSchema);
