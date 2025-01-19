import { Request, Response, NextFunction } from "express";
import Book, { IBook } from "../models/book";
import axios from "axios";
import { getRedisClient, redisClient } from "../config/cache";
import { log } from "node:console";

export const createBook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, author, genre, coverImage } = req.body;

    if (!title || !author || !genre || !coverImage) {
      res.status(400).json({
        message:
          "Missing required fields. Title, author, image, and genre are required.",
      });
      return;
    }

    const newBook = new Book({ title, author, genre, coverImage });
    await newBook.save();

    const redisClient = getRedisClient();
    const keys = await redisClient.keys("books:page:*:limit:*");
    for (const key of keys) {
      await redisClient.del(key);
    }

    res
      .status(201)
      .json({ message: "Book created successfully", book: newBook });
  } catch (error) {
    next(error);
  }
};
export const getBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { page = 1, limit = 10 } = req.query;
  const cacheKey = `books:page:${page}:limit:${limit}`;

  try {
    if (redisClient) {
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        console.log("Cache hit");
        res.status(200).json(JSON.parse(cachedData));
        return;
      }

      console.log("Cache miss");
    }
    // Fetch from the database
    const books = await Book.find({ deleted: false })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Book.countDocuments({ deleted: false });

    const result = {
      books,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
    };
    if (redisClient) {
      await redisClient.set(cacheKey, JSON.stringify(result), {
        EX: 3600, // Cache expires after 1 hour
      });
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// RETRIEVE details of a specific book
export const getBookDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;

  try {
    const book = await Book.findOne({ _id: id, deleted: false });
    if (!book) {
      res.status(404).json({ error: "Book not found" });
      return;
    }

    const googleBooksData = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${book.title}`
    );
    const metadata = googleBooksData.data.items?.[0]?.volumeInfo;

    res.status(200).json({
      book,
      metadata: metadata || {},
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE book details
export const updateBook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  const { title, author, genre, coverImage } = req.body;

  try {
    const book = await Book.findByIdAndUpdate(
      id,
      { title, author, genre, coverImage },
      { new: true }
    );
    if (!book) {
      res.status(404).json({ error: "Book not found" });
      return;
    }
    res.status(200).json({ message: "Book updated successfully", book });
  } catch (error) {
    next(error);
  }
};

export const deleteBook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;

  try {
    const book = await Book.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true }
    );

    if (!book) {
      res.status(404).json({ error: "Book not found" });
      return;
    }

    res.status(200).json({
      message: "Book marked as deleted successfully",
      book,
    });
  } catch (error) {
    next(error);
  }
};

export const searchBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { page = 1, limit = 10 } = req.query;

  try {
    // console.warn("Search books");
    const filter: any = {};
    if (req.query.title)
      filter.title = { $regex: req.query.title, $options: "i" };
    if (req.query.author)
      filter.author = { $regex: req.query.author, $options: "i" };
    if (req.query.genre)
      filter.genre = { $regex: req.query.genre, $options: "i" };

    const books = await Book.find({ ...filter, deleted: false })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Book.countDocuments(filter);

    res.status(200).json({
      books,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
    });
  } catch (error) {
    next(error);
  }
};
