import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { db } from "./database";
import { validPassword } from "../lib/passwordUtils";

const Users = db.collection<User>("users");
const customFields = {
	usernameField: "uname",
	passwordField: "pw",
};

const verifyCallback = (
	username: string,
	password: string,
	done: (err: Error | null, param?: User | boolean) => void,
) => {
	Users.findOne({ username: username })
		.then((user) => {
			if (!user) {
				return done(null, false);
			}

			const isValid = validPassword(password, user.hash, user.salt);

			if (isValid) {
				return done(null, user);
			} else {
				return done(null, false);
			}
		})
		.catch((err) => {
			done(err);
		});
};

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user: Express.User, done: (err: Error | any, id?: number | undefined) => void) => {
	// @ts-ignore
	done(null, user._id);
});

passport.deserializeUser((userId, done) => {
	// @ts-ignore
	Users.findOne({ _id: userId })
		.then((user) => {
			done(null, user);
		})
		.catch((err) => done(err));
});
