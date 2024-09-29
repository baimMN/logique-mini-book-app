import { StatusCodes } from "http-status-codes";

import type { Book } from "@/api/book/bookModel";
import { BookRepository } from "@/api/book/bookRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import type { createBookBody, updateBookBody } from "./bookRouter";

export class BookService {
  private bookRepository: BookRepository;

  constructor(repository: BookRepository = new BookRepository()) {
    this.bookRepository = repository;
  }

  // Retrieves all books from the database
  async findAll(search?: string, limit?: number, offset?: number): Promise<ServiceResponse<updateBookBody[] | null>> {
    try {
      let books: Book[];
      if (search) books = await this.bookRepository.searchBooksAsync(search, limit, offset);
      else books = await this.bookRepository.findAllAsync(limit, offset);

      if (!books || books.length === 0) {
        return ServiceResponse.failure("No Books found", null, StatusCodes.NOT_FOUND);
      }

      // convert back genre to JSON
      const formattedData: updateBookBody[] = books.map((data) => ({
        ...data,
        genres: data.genres ? JSON.parse(data.genres) : null,
      }));

      return ServiceResponse.success<updateBookBody[]>("Books found", formattedData);
    } catch (ex) {
      const errorMessage = `Error finding all books: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving books.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Retrieves a single book by their ID
  async findById(id: string): Promise<ServiceResponse<Book | null>> {
    try {
      const book = await this.bookRepository.findByIdAsync(id);
      if (!book) {
        return ServiceResponse.failure("Book not found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<Book>("Book found", book);
    } catch (ex) {
      const errorMessage = `Error finding book with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while finding book.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  // Retrieves all books from the database
  async updateById(id: string, payload: updateBookBody): Promise<ServiceResponse<updateBookBody | null>> {
    try {
      const books = await this.bookRepository.updateByIdAsync(id, {
        ...payload,
        genres: JSON.stringify(payload.genres),
      });
      if (!books[0]) {
        return ServiceResponse.failure("No Books found", null, StatusCodes.NOT_FOUND);
      }
      const responseData = { ...payload, id };

      return ServiceResponse.success<updateBookBody>("Book updated successfully", responseData);
    } catch (ex) {
      const errorMessage = `Error finding all books: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving books.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Retrieves all books from the database
  async deleteById(id: string): Promise<ServiceResponse<boolean>> {
    try {
      const books = await this.bookRepository.deleteByIdAsync(id);
      if (!books) {
        return ServiceResponse.failure("No Books found", false, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<boolean>("Book deleted successfully", true);
    } catch (ex) {
      const errorMessage = `Error finding all books: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving books.",
        false,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Retrieves all books from the database
  async create(data: createBookBody): Promise<ServiceResponse<Book | null>> {
    try {
      const books = await this.bookRepository.createAsync({ ...data, genres: JSON.stringify(data.genres) });
      if (!books) {
        return ServiceResponse.failure("Failed create book", null, StatusCodes.BAD_REQUEST);
      }
      books.genres = JSON.parse(books.genres);
      return ServiceResponse.success<Book>("Book created successfully", books);
    } catch (ex) {
      const errorMessage = `Error finding all books: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving books.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const bookService = new BookService();
