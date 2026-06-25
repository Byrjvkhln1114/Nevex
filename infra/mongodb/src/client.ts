import { MongoClient, type Db } from "mongodb";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectDb(): Promise<Db> {
  if (db) return db;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI environment variable is not set");

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(process.env.MONGODB_DB_NAME ?? "nevex");

  return db;
}

export async function disconnectDb(): Promise<void> {
  await client?.close();
  client = null;
  db = null;
}

export function getDb(): Db {
  if (!db) throw new Error("Database not connected. Call connectDb() first.");
  return db;
}
