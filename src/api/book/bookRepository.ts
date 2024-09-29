import type { Book } from "@/api/book/bookModel";
import BookDBSchema from "@/api/book/bookModel";
import sequelize from "../../common/database/sequelize";

export class BookRepository {
  async findAllAsync(limit?: number, offset?: number): Promise<Book[]> {
    return BookDBSchema.findAll({ raw: true, limit, offset });
  }

  async findByIdAsync(id: string): Promise<Book | null> {
    return (await BookDBSchema.findByPk(id))?.get() || null;
  }

  async createAsync(data: Book): Promise<Book | null> {
    return (await BookDBSchema.create(data)).get();
  }

  async updateByIdAsync(id: string, payload: Book): Promise<any> {
    return BookDBSchema.update(payload, { where: { id } });
  }

  async deleteByIdAsync(id: string): Promise<number> {
    return BookDBSchema.destroy({ where: { id } });
  }

  async searchBooksAsync(query: string, limit?: number, offset?: number): Promise<Book[]> {
    return BookDBSchema.findAll({
      where: sequelize.literal("MATCH (title, author, genres) AGAINST(:query IN NATURAL LANGUAGE MODE)"),
      replacements: { query },
      limit,
      offset,
      raw: true,
    });
  }
}
