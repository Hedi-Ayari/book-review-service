import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  bookId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  deleted: boolean;

  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    deleted: { type: Boolean, default: false },

    comment: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IReview>("Review", reviewSchema);
