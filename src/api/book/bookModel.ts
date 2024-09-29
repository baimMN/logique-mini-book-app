import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { DataTypes, type Optional } from "sequelize";
import { AllowNull, Column, Default, IsUUID, Model, PrimaryKey, Table } from "sequelize-typescript";

extendZodWithOpenApi(z);

export type Book = z.infer<typeof BookSchema>;
export const BookSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  author: z.string(),
  genres: z.string(),
  stock: z.number(),
  publishedYear: z.number(),
});

interface BookCreationAttributes extends Optional<Book, "id"> {}

@Table({
  tableName: "books",
  timestamps: false,
  indexes: [
    {
      type: "FULLTEXT",
      fields: ["title", "author", "genres"],
    },
  ],
})
export default class BookDBSchema extends Model<Book, BookCreationAttributes> {
  @IsUUID(4)
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.STRING)
  declare id: string;

  @AllowNull(false)
  @Column(DataTypes.STRING)
  declare title: Book["title"];

  @AllowNull(false)
  @Column(DataTypes.STRING)
  declare author: Book["author"];

  @Column(DataTypes.INTEGER)
  declare publishedYear: Book["publishedYear"];

  @Column(DataTypes.STRING)
  declare genres: Book["genres"];

  @Default(1)
  @Column(DataTypes.INTEGER)
  declare stock: Book["stock"];
}
