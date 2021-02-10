const express = require('express');
const router = express.Router();

//middleware that check if user is logged in

const loginCheck = () => {
    return (req, res, next) => {
      // if user is logged in proceed to the next step
      if (req.session.user) {
        next();
      } else {
        // redirect to /login
        res.redirect('/login');
      }
    }
  }

/* GET home page */
router.get('/', (req, res, next) => {
    const user = req.session.user;
    res.render('index', {user: user})
});

// profile page is a protected route and we use the middleware to access it

router.get('/profile', loginCheck(), (req, res) => {
    const user = req.session.user;
    res.render('profile', {user: user});
  })

module.exports = router;
