const express = require ('express');
const {check} = require ('express-validator');

const authController = require ('../controllers/auth');
const User = require ('../models/user');

const router = express.Router ();

router.get ('/login', authController.getLogin);
router.post (
  '/login',
  [
    check ('email')
      .isEmail ()
      .withMessage ('Please enter a valid email address')
      .normalizeEmail (),
    check (
      'password',
      'Please enter a password with only numbers and text and at least 5 characters'
    )
      .isLength ({min: 5})
      .isAlphanumeric ()
      .trim (),
  ],
  authController.postLogin
);

router.get ('/signup', authController.getSignup);
router.post (
  '/signup',
  [
    check ('email')
      .isEmail ()
      .withMessage ('Please enter a valid email')
      .custom ((value, {req}) => {
        return User.findOne ({email: value}).then (userDoc => {
          if (userDoc) {
            return Promise.reject ('Email already exists');
          }
        });
      })
      .normalizeEmail (),
    check (
      'password',
      'Please enter a password with only numbers and text and at least 5 characters'
    )
      .isLength ({min: 5})
      .isAlphanumeric ()
      .trim (),
    check ('confirmPassword')
      .custom ((value, {req}) => {
        if (value !== req.body.password) {
          throw new Error ('Passwords do not match');
        }
        return true;
      })
      .trim (),
  ],
  authController.postSignup
);

router.post ('/logout', authController.postLogout);

router.get ('/reset', authController.getReset);
router.post ('/reset', authController.postReset);

router.get ('/reset/:token', authController.getNewPassword);
router.post ('/new-password', authController.postNewPassword);

module.exports = router;
