import { Request, Response } from "express";
import mongoose from "mongoose";
import Review from "../models/review";
import Book from "../models/book";

export const createReview = async (req: any, res: Response): Promise<void> => {
  const { bookId } = req.params;
  const { rating, comment } = req.body;
  //   console.log(req.user);

  if (!rating || !comment) {
    res.status(400).json({ message: "Rating and comment are required." });
    return;
  }

  try {
    const book = await Book.findOne({ _id: bookId, deleted: false });

    if (!book) {
      res.status(404).json({ message: "Book not found." });
      return;
    }

    const review = new Review({
      bookId: new mongoose.Types.ObjectId(bookId),
      userId: req.user.userId,
      rating,
      comment,
    });

    await review.save();
    res.status(201).json({ message: "Review created successfully.", review });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to create review.", error: error.message });
  }
};

export const getReviews = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { bookId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  try {
    // we can add here later populate to get the user details / book details okey nvm I ll do it :)  ....
    const reviews = await Review.find({ bookId, deleted: false })
      .populate("userId")
      .populate("bookId")
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const totalReviews = await Review.countDocuments({ bookId });

    res.json({
      total: totalReviews,
      page: Number(page),
      pages: Math.ceil(totalReviews / Number(limit)),
      reviews,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to fetch reviews.", error: error.message });
  }
};

export const updateReview = async (req: any, res: Response): Promise<void> => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;

  try {
    const review = await Review.findOne({
      _id: reviewId,
      deleted: { $ne: true },
    });

    if (!review) {
      res.status(404).json({ message: "Review not found." });
      return;
    }
    // console.log(
    //   req.user.userId === review.userId,
    //   " user id taa eli yaaml fel requese",
    //   req.user.userId,
    //   "user Id taa moula el reqvuev",
    //   review.userId
    // );
    // console.log(req.user.role === "admin", req.user.role);

    if (!review.userId.equals(req.user.userId) && req.user.role !== "admin") {
      res.status(403).json({ message: "Permission denied." });
      return;
    }

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    await review.save();
    res.json({ message: "Review updated successfully.", review });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to update review.", error: error.message });
  }
};

export const deleteReview = async (req: any, res: Response): Promise<void> => {
  const { reviewId } = req.params;

  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      res.status(404).json({ message: "Review not found." });
      return;
    }

    if (!review.userId.equals(req.user.userId) && req.user.role !== "admin") {
      res.status(403).json({ message: "Permission denied." });
      return;
    }

    review.deleted = true;
    await review.save();

    res.json({ message: "Review deleted successfully." });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to delete review.", error: error.message });
  }
};
