import express from "express";
import session from "express-session";
import passport from "passport";
import routes from "./routes/index";
import MongoStore from "connect-mongo";

// /**
//  * -------------- GENERAL SETUP ----------------
//  */

// // Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
// require('dotenv').config();

// // Create the Express application
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// /**
//  * -------------- SESSION SETUP ----------------
//  */

const sessionStore = MongoStore.create({
	mongoUrl: "mongodb://localhost:27017/session",
});

app.use(
	session({
		secret: process.env.SECRET || "supersecret",
		resave: false,
		saveUninitialized: true,
		store: sessionStore,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24, // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
		},
	}),
);

// /**
//  * -------------- PASSPORT AUTHENTICATION ----------------
//  */

// // Need to require the entire Passport config module so app.js knows about it
require("./config/passport");

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
	console.log(req.session);
	console.log(req.user);
    // console.log(req);
	next();
});

// /**
//  * -------------- ROUTES ----------------
//  */

// // Imports all of the routes from ./routes/index.js
app.use(routes);

/**
 * -------------- SERVER ----------------
 */

// Server listens on http://localhost:3000
app.listen(process.env.PORT || 3000, () => {
	console.log("Server working on http://localhost:3000");
});
