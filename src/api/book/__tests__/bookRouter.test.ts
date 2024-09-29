import { StatusCodes } from "http-status-codes";
import request from "supertest";

import type { Book } from "@/api/book/bookModel";
import type { ServiceResponse } from "@/common/models/serviceResponse";
import { app } from "@/server";
import { uuid } from "uuidv4";
import sequelize from "../../../common/database/sequelize";

describe("Book API Endpoints", () => {
  let id: string;
  const mockData = {
    title: "test title",
    author: "ibra",
    genres: ["action"],
    stock: 10,
    publishedYear: 2019,
  };
  beforeAll(async () => {
    await sequelize.sync({ force: true });
    const resp = await request(app).post("/books").send(mockData).expect(200);
    const responseBody: ServiceResponse<Book> = resp.body;
    id = responseBody.responseObject?.id!;
  });

  describe("POST /books", () => {
    it("should return a created book", async () => {
      const resp = await request(app).post("/books").send(mockData).expect(200);
      const responseBody: ServiceResponse<Book> = resp.body;

      expect(responseBody.responseObject).toBeDefined();
      expect(responseBody.responseObject.title).toEqual(mockData.title);
      expect(responseBody.responseObject.author).toEqual(mockData.author);
      expect(responseBody.responseObject.genres).toEqual(mockData.genres);
    });
  });

  describe("GET /books", () => {
    it("should return a list of books", async () => {
      // Act
      const response = await request(app).get("/books");
      const responseBody: ServiceResponse<Book[]> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
    });
  });

  describe("PUT /books:id", () => {
    it("should return an updated book", async () => {
      // Act
      const newData = {
        title: "new title",
        author: "ibraim",
        genres: ["action"],
        stock: 11,
        publishedYear: 2011,
      };
      const response = await request(app).put(`/books/${id}`).send(newData);
      const responseBody: ServiceResponse<Book> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.responseObject.genres).toEqual(newData.genres);
      expect(responseBody.responseObject.title).toEqual(newData.title);
      expect(responseBody.responseObject.author).toEqual(newData.author);
      expect(responseBody.success).toBeTruthy();
    });
  });

  describe("GET /books/:id", () => {
    it("should return a book for a valid ID", async () => {
      // Act
      const response = await request(app).get(`/books/${id}`);
      const responseBody: ServiceResponse<Book> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain("Book found");
      expect(responseBody.responseObject.id).toEqual(id);
    });

    it("should return a not found error for non-existent ID", async () => {
      // Act
      const response = await request(app).get(`/books/${uuid()}`);
      const responseBody: ServiceResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(responseBody.success).toBeFalsy();
    });
  });

  afterAll(async () => {
    const mockData = {
      title: "test title",
      author: "ibra",
      genres: ["action"],
      stock: 10,
      publishedYear: 2019,
    };

    describe("DELETE /books:id", () => {
      it("should delete a record", async () => {
        const resp = await request(app).delete(`/books/${id}`).expect(200);

        const getData = await request(app).get(`/books/${id}`);
        const responseBody: ServiceResponse<Book> = getData.body;
        expect(responseBody.statusCode).toEqual(StatusCodes.NOT_FOUND);
      });
    });
  });
});
