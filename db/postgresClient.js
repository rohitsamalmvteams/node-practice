// db/postgresClient.js
import { Client } from "pg";
import dotenv from "dotenv";
dotenv.config();

export const client = new Client({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
});

client
  .connect()
  .then(() => console.log("Connected to the PostgreSQL"))
  .catch((err) => console.error("Connection error", err.stack));
