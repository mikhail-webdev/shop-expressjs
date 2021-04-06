const path = require ('path');

const express = require ('express');
const mongoose = require ('mongoose');
const session = require ('express-session');
const MongoDBStore = require ('connect-mongodb-session') (session);
const csrf = require ('csurf');
const flash = require ('connect-flash');
const multer = require ('multer');

const adminRoutes = require ('./routes/admin');
const shopRoutes = require ('./routes/shop');
const authRoutes = require ('./routes/auth');

const errorController = require ('./controllers/error');
const User = require ('./models/user');

const MONGODB_URI =
  'mongodb+srv://dbUser:um42@d7.AytrJRe@shop-express.o5dku.mongodb.net/Shop?retryWrites=true&w=majority';
const PORT = 3000;

const app = express ();
const store = new MongoDBStore ({
  uri: MONGODB_URI,
  collection: 'sessions',
});

const csrfProtection = csrf ();

const fileStorage = multer.diskStorage ({
  destination: (req, file, callback) => {
    callback (null, 'images');
  },
  filename: (req, file, callback) => {
    callback (null, new Date ().toISOString () + '-' + file.originalname);
  },
});

const fileFilter = (req, file, callback) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    callback (null, true);
  } else {
    callback (null, false);
  }
};

app.set ('view engine', 'ejs');
app.set ('views', 'views');

app.use (express.urlencoded ({extended: false}));
app.use (multer ({fileFilter, storage: fileStorage}).single ('image'));
app.use (express.static (path.join (__dirname, 'public')));
app.use ('/images', express.static (path.join (__dirname, 'images')));
app.use (
  session ({
    store,
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
  })
);
app.use (csrfProtection);
app.use (flash ());

app.use ((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken ();
  next ();
});

app.use ((req, res, next) => {
  if (!req.session.user) {
    return next ();
  }
  User.findById (req.session.user._id)
    .then (user => {
      if (!user) {
        return next ();
      }
      req.user = user;
      next ();
    })
    .catch (err => {
      next (new Error (err));
    });
});

app.use ('/admin', adminRoutes);
app.use (shopRoutes);
app.use (authRoutes);

app.get ('/500', errorController.get500);

app.use (errorController.get404);

app.use ((error, req, res, next) => {
  res.status (500).render ('500', {
    pageTitle: '500 Something went wrong',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn,
  });
});

mongoose
  .connect (MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then (() => {
    console.log ('Listening on Port ', PORT);
    app.listen (PORT);
  })
  .catch (err => console.log (err));
