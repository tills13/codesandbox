import { MongoClient } from "mongodb";

export const mongoClient = new MongoClient(
  `mongodb://${process.env.MONGODB_HOST}:27017`
);

export const projectsCollection = mongoClient
  .db(process.env.DB_NAME)
  .collection(process.env.PROJECTS_COLLECTION);
