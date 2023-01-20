import { NextFunction, Request, Response, Router } from "express"
import passport from 'passport';
import { genPassword } from "../lib/passwordUtils";
import { db } from "../config/database";
import { isAdmin, isAuth } from "../routes/authMiddleware";

const Users = db.collection<User>('users');
const router = Router();
/**
 * -------------- POST ROUTES ----------------
 */

 router.post('/login', passport.authenticate('local', { failureRedirect: '/login-failure', successRedirect: 'login-success' }));

 router.post('/register', (req: Request, res: Response, next: NextFunction) => {
    const saltHash = genPassword(req.body.pw);
    
    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser: User = {
        username: req.body.uname,
        hash: hash,
        salt: salt,
        admin: true
    };

    Users.insertOne(newUser)
        .then((user) => {
            console.log(user);
        });

    res.redirect('/login');
 });


 /**
 * -------------- GET ROUTES ----------------
 */

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('<h1>Home</h1><p>Please <a href="/register">register</a></p>');
});

// When you visit http://localhost:3000/login, you will see "Login Page"
router.get('/login', (req: Request, res: Response, next: NextFunction) => {
   
    const form = '<h1>Login Page</h1><form method="POST" action="/login">\
    Enter Username:<br><input type="text" name="uname">\
    <br>Enter Password:<br><input type="password" name="pw">\
    <br><br><input type="submit" value="Submit"></form>';

    res.send(form);

});

// When you visit http://localhost:3000/register, you will see "Register Page"
router.get('/register', (req: Request, res: Response, next: NextFunction) => {

    const form = '<h1>Register Page</h1><form method="post" action="register">\
                    Enter Username:<br><input type="text" name="uname">\
                    <br>Enter Password:<br><input type="password" name="pw">\
                    <br><br><input type="submit" value="Submit"></form>';

    res.send(form);
    
});

/**
 * Lookup how to authenticate users on routes with Local Strategy
 * Google Search: "How to use Express Passport Local Strategy"
 * 
 * Also, look up what behaviour express session has without a maxage set
 */
router.get('/protected-route', isAuth, (req: Request, res: Response, next: NextFunction) => {
    res.send('You made it to the route.');
});

router.get('/admin-route', isAdmin, (req: Request, res: Response, next: NextFunction) => {
    res.send('You made it to the admin route.');
});

// Visiting this route logs the user out
router.get('/logout', (req: Request, res: Response, next: NextFunction) => {
    req.logout(err => {
        console.log(err);
    });
    res.redirect('/protected-route');
});

router.get('/login-success', (req: Request, res: Response, next: NextFunction) => {
    res.send('<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>');
});

router.get('/login-failure', (req: Request, res: Response, next: NextFunction) => {
    res.send('You entered the wrong password.');
});

export default router;