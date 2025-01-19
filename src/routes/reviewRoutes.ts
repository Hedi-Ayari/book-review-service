import express from "express";
import {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
} from "../controllers/reviewController";
import { verifyAndCheckRole } from "../middlewares/authMiddleware";

const router = express.Router();

/**
 * @swagger
 * /api/reviews/{bookId}:
 *   post:
 *     summary: Create a review for a book
 *     description: Allows users and admins to create a review for a specific book.
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - name: bookId
 *         in: path
 *         description: The ID of the book to review.
 *         required: true
 *         schema:
 *           type: string
 *           example: "60c72b2f9d1b8c23c4d6bc1e"  # Example bookId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - comment
 *             properties:
 *               rating:
 *                 type: number
 *                 description: The rating given to the book (e.g., 1-5).
 *                 example: 4
 *               comment:
 *                 type: string
 *                 description: The comment or review text.
 *                 example: "Great book! Very insightful and well-written."
 *     responses:
 *       201:
 *         description: Review created successfully.
 *       400:
 *         description: Missing required fields (rating or comment).
 *       404:
 *         description: Book not found.
 */
router.post("/:bookId/", verifyAndCheckRole(["admin", "user"]), createReview);

/**
 * @swagger
 * /api/reviews/{bookId}:
 *   get:
 *     summary: Get reviews for a book
 *     description: Retrieve all reviews for a specific book.
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - name: bookId
 *         in: path
 *         description: The ID of the book whose reviews are to be fetched.
 *         required: true
 *         schema:
 *           type: string
 *           example: "60c72b2f9d1b8c23c4d6bc1e"  # Example bookId
 *     responses:
 *       200:
 *         description: A list of reviews for the book.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 10
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 pages:
 *                   type: integer
 *                   example: 2
 *                 reviews:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       rating:
 *                         type: number
 *                         example: 4
 *                       comment:
 *                         type: string
 *                         example: "Great book!"
 *       404:
 *         description: No reviews found for the book.
 */
router.get("/:bookId/", verifyAndCheckRole(["admin", "user"]), getReviews);

/**
 * @swagger
 * /api/reviews/{reviewId}:
 *   put:
 *     summary: Update a review
 *     description: Allows users and admins to update an existing review by review ID.
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - name: reviewId
 *         in: path
 *         description: The ID of the review to update.
 *         required: true
 *         schema:
 *           type: string
 *           example: "60c72b2f9d1b8c23c4d6bc1e"  # Example reviewId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 description: Updated rating for the review.
 *                 example: 5
 *               comment:
 *                 type: string
 *                 description: Updated comment or review text.
 *                 example: "Fantastic book, a must-read!"
 *     responses:
 *       200:
 *         description: Review updated successfully.
 *       400:
 *         description: Invalid input or missing fields.
 *       404:
 *         description: Review not found.
 *       403:
 *         description: Permission denied (for non-author users).
 */
router.put("/:reviewId", verifyAndCheckRole(["admin", "user"]), updateReview);

/**
 * @swagger
 * /api/reviews/{reviewId}:
 *   delete:
 *     summary: Delete a review
 *     description: Allows users and admins to delete a review by its ID.
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - name: reviewId
 *         in: path
 *         description: The ID of the review to delete.
 *         required: true
 *         schema:
 *           type: string
 *           example: "60c72b2f9d1b8c23c4d6bc1e"  # Example reviewId
 *     responses:
 *       200:
 *         description: Review deleted successfully.
 *       404:
 *         description: Review not found.
 *       403:
 *         description: Permission denied (for non-author users).
 */
router.delete(
  "/:reviewId",
  verifyAndCheckRole(["admin", "user"]),
  deleteReview
);

export default router;
