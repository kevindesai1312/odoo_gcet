import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "";
const dbName = process.env.MONGODB_DB || "dayflow";

if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable in your .env file");
}

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

if (!clientPromise) {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getMongoClient(): Promise<MongoClient> {
  return clientPromise!;
}

export async function getDb() {
  const c = await getMongoClient();
  return c.db(dbName);
}
