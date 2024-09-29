import dotenv from "dotenv";
import { Sequelize } from "sequelize-typescript";
import BookDBSchema from "../../api/book/bookModel";

dotenv.config();

const sequelize = new Sequelize({
  database: process.env.MYSQL_DATABASE,
  dialect: "mysql",
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  host: process.env.MYSQL_HOST,
  port: (process.env.MYSQL_PORT || 3306) as number,
  models: [BookDBSchema],
});

export default sequelize;
