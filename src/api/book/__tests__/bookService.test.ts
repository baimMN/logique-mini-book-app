import { StatusCodes } from "http-status-codes";
import type { Mock } from "vitest";

import type { Book } from "@/api/book/bookModel";
import { BookRepository } from "@/api/book/bookRepository";
import { BookService } from "@/api/book/bookService";
import { uuid } from "uuidv4";
import type { createBookBody } from "../bookRouter";

vi.mock("@/api/book/bookRepository");

describe("bookService", () => {
  let bookServiceInstance: BookService;
  let bookRepositoryInstance: BookRepository;

  const mockBooks: Book[] = [
    {
      author: "Alice",
      title: "alice@example.com",
      stock: 42,
      publishedYear: 123,
      genres: JSON.stringify(["drama", "horor"]),
      id: uuid(),
    },
    {
      author: "Bob",
      title: "bob@example.com",
      stock: 21,
      publishedYear: 123,
      genres: JSON.stringify(["action", "horor"]),
      id: uuid(),
    },
  ];

  beforeEach(() => {
    bookRepositoryInstance = new BookRepository();
    bookServiceInstance = new BookService(bookRepositoryInstance);
  });

  describe("findAll", () => {
    it("return all books", async () => {
      // Arrange
      (bookRepositoryInstance.findAllAsync as Mock).mockReturnValue(mockBooks);

      // Act
      const result = await bookServiceInstance.findAll();

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).equals("Books found");
    });

    it("returns a not found error for no books found", async () => {
      // Arrange
      (bookRepositoryInstance.findAllAsync as Mock).mockReturnValue(null);

      // Act
      const result = await bookServiceInstance.findAll();

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).equals("No Books found");
      expect(result.responseObject).toBeNull();
    });

    it("handles errors for findAllAsync", async () => {
      // Arrange
      (bookRepositoryInstance.findAllAsync as Mock).mockRejectedValue(new Error("Database error"));

      // Act
      const result = await bookServiceInstance.findAll();

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).equals("An error occurred while retrieving books.");
      expect(result.responseObject).toBeNull();
    });
  });

  describe("findById", () => {
    it("returns a book for a valid ID", async () => {
      // Arrange
      const testId = mockBooks[0].id!;
      const mockBook = mockBooks.find((book) => book.id === testId);
      (bookRepositoryInstance.findByIdAsync as Mock).mockReturnValue(mockBook);

      // Act
      const result = await bookServiceInstance.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).equals("Book found");
      expect(result.responseObject?.id).toEqual(mockBook?.id);
    });

    it("handles errors for findByIdAsync", async () => {
      // Arrange
      const testId = mockBooks[0].id!;
      (bookRepositoryInstance.findByIdAsync as Mock).mockRejectedValue(new Error("Database error"));

      // Act
      const result = await bookServiceInstance.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).equals("An error occurred while finding book.");
      expect(result.responseObject).toBeNull();
    });

    it("returns a not found error for non-existent ID", async () => {
      // Arrange
      const testId = mockBooks[0].id!;
      (bookRepositoryInstance.findByIdAsync as Mock).mockReturnValue(null);

      // Act
      const result = await bookServiceInstance.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).equals("Book not found");
      expect(result.responseObject).toBeNull();
    });
  });
});
