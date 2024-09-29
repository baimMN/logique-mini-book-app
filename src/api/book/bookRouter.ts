import { OpenAPIRegistry, extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { BookSchema } from "@/api/book/bookModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { bookController } from "./bookController";

export const bookRegistry = new OpenAPIRegistry();
export const bookRouter: Router = express.Router();

bookRegistry.register("Book", BookSchema);
extendZodWithOpenApi(z);

/**
 * <<< GET - books >>>
 */
// define request attribute and validation
const getAllBooksRequest = z.object({
  query: z.object({
    search: z.string().optional(),
    limit: z.number().optional(),
    offset: z.number().optional(),
  }),
});
const allBooksQuery = getAllBooksRequest.shape.query!;
// convert from zod object to TS data type
export type getAllBooksQuery = z.infer<typeof allBooksQuery>;
// configure route
bookRouter.get("/", bookController.getBooks);
// configure swagger
bookRegistry.registerPath({
  method: "get",
  path: "/books",
  tags: ["Book"],
  request: { query: allBooksQuery },
  responses: createApiResponse(z.array(BookSchema), "Success"),
});

/**
 * <<< GET - books/:id >>>
 */
// define request attribute and validation
const getBookRequest = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});
const bookParam = getBookRequest.shape.params!;
// convert from zod object to TS data type
export type getBookParams = z.infer<typeof bookParam>;
// configure route
bookRouter.get("/:id", validateRequest(getBookRequest), bookController.getBook);
// configure swagger
bookRegistry.registerPath({
  method: "get",
  path: "/books/{id}",
  tags: ["Book"],
  request: { params: bookParam },
  responses: createApiResponse(BookSchema, "Success"),
});

/**
 * <<< POST - books >>>
 */
// define request attribute and validation
const createBookRequest = z.object({
  body: z.object({
    title: z.string(),
    author: z.string(),
    genres: z.array(z.string()),
    stock: z.number(),
    publishedYear: z.number(),
    id: z.string().uuid().optional(),
  }),
});
const createBookBodyData = createBookRequest.shape.body!;
// convert from zod object to TS data type
export type createBookBody = z.infer<typeof createBookBodyData>;
// configure route
bookRouter.post("/", validateRequest(createBookRequest), bookController.createBook);
// configure swagger
bookRegistry.registerPath({
  method: "post",
  path: "/books",
  tags: ["Book"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: createBookBodyData,
        },
      },
    },
  },
  responses: createApiResponse(BookSchema, "Success"),
});

/**
 * <<< PUT - books/:id >>>
 */
// define request attribute and validation
const updateBookRequest = z.object({
  body: z.object({
    title: z.string(),
    author: z.string(),
    genres: z.array(z.string()),
    stock: z.number(),
    publishedYear: z.number(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
});
const updateBookBodyData = updateBookRequest.shape.body!;
// convert from zod object to TS data type
export type updateBookBody = z.infer<typeof updateBookBodyData>;
// configure route
bookRouter.put("/:id", validateRequest(updateBookRequest), bookController.updateBook);
// configure swagger
bookRegistry.registerPath({
  method: "put",
  path: "/books/{id}",
  tags: ["Book"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: updateBookBodyData,
        },
      },
    },
    params: updateBookRequest.shape.params!,
  },
  responses: createApiResponse(BookSchema, "Success"),
});

/**
 * <<< DELETE - books >>>
 */
// define request attribute and validation
const deleteBookRequest = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});
const deleteBookParam = deleteBookRequest.shape.params!;
// convert from zod object to TS data type
export type deleteBookParams = z.infer<typeof bookParam>;
bookRouter.delete("/:id", validateRequest(deleteBookRequest), bookController.deleteBook);
// configure swagger
bookRegistry.registerPath({
  method: "delete",
  path: "/books/{id}",
  tags: ["Book"],
  request: { params: deleteBookParam },
  responses: createApiResponse(BookSchema, "Success"),
});
