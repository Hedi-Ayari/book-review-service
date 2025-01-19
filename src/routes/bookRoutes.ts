import { Router } from "express";
import { verifyAndCheckRole } from "../middlewares/authMiddleware";
import {
  createBook,
  deleteBook,
  getBookDetails,
  getBooks,
  searchBooks,
  updateBook,
} from "../controllers/bookController";

const router = Router();

/**
 * @swagger
 * /api/books/listAll:
 *   get:
 *     summary: Retrieve a list of books
 *     description: Retrieve a list of books with pagination.
 *     parameters:
 *       - name: page
 *         in: query
 *         description: The page number for pagination.
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         description: The number of books per page.
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: A list of books.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total number of books.
 *                   example: 50
 *                 page:
 *                   type: integer
 *                   description: Current page.
 *                   example: 1
 *                 pages:
 *                   type: integer
 *                   description: Total number of pages.
 *                   example: 5
 *                 books:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         description: The title of the book.
 *                         example: "The Great Gatsby"
 *                       author:
 *                         type: string
 *                         description: The author of the book.
 *                         example: "F. Scott Fitzgerald"
 *                       genre:
 *                         type: string
 *                         description: The genre of the book.
 *                         example: "Fiction"
 *                       coverImage:
 *                         type: string
 *                         description: The URL or path to the cover image.
 *                         example: "http://example.com/cover.jpg"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: The creation timestamp of the book.
 *                         example: "2025-01-19T12:00:00Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: The last update timestamp of the book.
 *                         example: "2025-01-19T12:00:00Z"
 *       500:
 *         description: Server error.
 */
router.get("/listAll", getBooks);

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Retrieve a single book by ID
 *     description: Get details of a book by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the book to fetch.
 *         required: true
 *         schema:
 *           type: string
 *           example: "60c72b2f9d1b8c23c4d6bc1e"  # Example bookId
 *     responses:
 *       200:
 *         description: Book details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   description: The title of the book.
 *                   example: "The Great Gatsby"
 *                 author:
 *                   type: string
 *                   description: The author of the book.
 *                   example: "F. Scott Fitzgerald"
 *                 genre:
 *                   type: string
 *                   description: The genre of the book.
 *                   example: "Fiction"
 *                 coverImage:
 *                   type: string
 *                   description: The URL or path to the cover image.
 *                   example: "http://example.com/cover.jpg"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The creation timestamp of the book.
 *                   example: "2025-01-19T12:00:00Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: The last update timestamp of the book.
 *                   example: "2025-01-19T12:00:00Z"
 *       404:
 *         description: Book not found.
 */
router.get("/one/:id", verifyAndCheckRole(["admin", "user"]), getBookDetails);

/**
 * @swagger
 * /api/books/one:
 *   post:
 *     summary: Create a new book
 *     description: Add a new book to the collection.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - genre
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the book.
 *                 example: "The Great Gatsby"
 *               author:
 *                 type: string
 *                 description: The author of the book.
 *                 example: "F. Scott Fitzgerald"
 *               genre:
 *                 type: string
 *                 description: The genre of the book.
 *                 example: "Fiction"
 *               coverImage:
 *                 type: string
 *                 description: The URL or path to the cover image.
 *                 example: "http://example.com/cover.jpg"
 *     responses:
 *       201:
 *         description: Book created successfully.
 *       400:
 *         description: Missing required fields.
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *       500:
 *         description: Server error.
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.post("/", verifyAndCheckRole(["admin", "user"]), createBook);

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Update a book
 *     description: Update details of a book by its ID.
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the book to update.
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
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the book.
 *               author:
 *                 type: string
 *                 description: The author of the book.
 *               genre:
 *                 type: string
 *                 description: The genre of the book.
 *               coverImage:
 *                 type: string
 *                 description: The URL or path to the cover image.
 *     responses:
 *       200:
 *         description: Book updated successfully.
 *       404:
 *         description: Book not found.
 *       400:
 *         description: Invalid input.
 */
router.put("/:id", verifyAndCheckRole(["admin"]), updateBook);

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Delete a book
 *     description: Delete a book by its ID.
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the book to delete.
 *         required: true
 *         schema:
 *           type: string
 *           example: "60c72b2f9d1b8c23c4d6bc1e"  # Example bookId
 *     responses:
 *       200:
 *         description: Book deleted successfully.
 *       404:
 *         description: Book not found.
 */
router.delete("/:id", verifyAndCheckRole(["admin"]), deleteBook);

/**
 * @swagger
 * /api/books/search:
 *   get:
 *     summary: Search for books
 *     description: Search for books based on query parameters.
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - name: query
 *         in: query
 *         description: Search query (title, author, genre).
 *         required: false
 *         schema:
 *           type: string
 *           example: "title=Book Title"
 *     responses:
 *       200:
 *         description: Search results.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 books:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         description: The title of the book.
 *                         example: "The Great Gatsby"
 *                       author:
 *                         type: string
 *                         description: The author of the book.
 *                         example: "F. Scott Fitzgerald"
 *                       genre:
 *                         type: string
 *                         description: The genre of the book.
 *                         example: "Fiction"
 *       404:
 *         description: No books found matching the query.
 */
router.get("/search", searchBooks);

export default router;
