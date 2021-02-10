const router = require("express").Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');


router.get("/login", (req, res) => {
    res.render("login");
  });


  router.post('/login', (req, res) => {
    const { username, password } = req.body;
    // check if we have a user with the entered username
    User.findOne({ username: username })
      .then(user => {
        if (user === null) {
          // if not we show login again
          return res.render('login', { message: 'Invalid credentials' });
        }
        // if username is existing then we want to check the password
        if (bcrypt.compareSync(password, user.password)) {
          // password and hash match
          // now we want to log the user in
          req.session.user = user;
          res.redirect('/profile');
        } else {
          res.render('login', { message: 'Invalid credentials' });
        }
      })
  })


router.get("/signup", (req, res) => {
    res.render("signup");
  });


router.post('/signup', (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);
    // is the password longer than 8 chars and the username not empty
    if (password.length < 8) {
      // if not show the signup again with a message
      return res.render('signup', { message: 'Your password must have 8 chars min' });
    }
    if (username === '') {
        return res.render('signup', { message: 'Username field cannot be empty' });
    }
    // check if the username already exists
    User.findOne({ username: username })
      .then(user => {
        if (user !== null) {
          // if yes show the signup again with a message
          res.render('signup', { message: 'Username is already taken' });
        } else {
          // all validation passed - > we can create a new user in the database with a hashed password
          // create salt and hash
          const salt = bcrypt.genSaltSync();
          const hash = bcrypt.hashSync(password, salt)
          // create the user in the db
          User.create({ username: username, password: hash })
            .then(user => {
              console.log(user);
              // then redirect to login
              res.redirect('/login');
            })
        }
      })
      .catch(err => {
        console.log(err);
      })
  })




module.exports = router;