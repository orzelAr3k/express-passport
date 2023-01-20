import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";

dotenv.config();

/**
 * -------------- DATABASE ----------------
 */

/**
 * Connect to MongoDB Server using the connection string in the `.env` file.  To implement this, place the following
 * string into the `.env` file
 *
 * DB_STRING=mongodb://<user>:<password>@localhost:27017/database_name
 */

const conn = process.env.DB_STRING || "mongodb://localhost:27017";

const connection = new MongoClient(conn);
connection.connect((err, conn) => {
	if (err) console.log(err);
	console.log("Connected to the configuration base!");
});

export const db = connection.db("AUTH");
// export const Users = db.collection("users");
