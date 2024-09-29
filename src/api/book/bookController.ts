import type { Request, RequestHandler, Response } from "express";

import { bookService } from "@/api/book/bookService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import type { TypedRequestBody } from "../../common/models/request";
import type { createBookBody, getAllBooksQuery, getBookParams, updateBookBody } from "./bookRouter";

class BookController {
  public getBooks: RequestHandler = async (req: Request, res: Response) => {
    const { search, limit, offset } = req.query as unknown as getAllBooksQuery;
    const serviceResponse = await bookService.findAll(search, limit, offset);
    return handleServiceResponse(serviceResponse, res);
  };

  public getBook: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params as unknown as getBookParams;
    const serviceResponse = await bookService.findById(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public createBook: RequestHandler = async (req: TypedRequestBody<createBookBody>, res: Response) => {
    const serviceResponse = await bookService.create(req.body);
    return handleServiceResponse(serviceResponse, res);
  };

  public deleteBook: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params as unknown as getBookParams;
    const serviceResponse = await bookService.deleteById(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public updateBook: RequestHandler = async (req: TypedRequestBody<updateBookBody>, res: Response) => {
    const { id } = req.params as unknown as getBookParams;

    const serviceResponse = await bookService.updateById(id, req.body);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const bookController = new BookController();
