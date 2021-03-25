const path = require ('path');

const express = require ('express');
const bodyParser = require ('body-parser');
const mongoose = require ('mongoose');

const adminRoutes = require ('./routes/admin');
const shopRoutes = require ('./routes/shop');

const errorController = require ('./controllers/error');
const User = require ('./models/user');

const app = express ();

const PORT = 3000;

app.set ('view engine', 'ejs');
app.set ('views', 'views');

app.use (bodyParser.urlencoded ({extended: false}));

app.use (express.static (path.join (__dirname, 'public')));

app.use ((req, res, next) => {
  User.findById ('605b973385896e1fc6c44255')
    .then (user => {
      req.user = user;
      next ();
    })
    .catch (err => {
      console.log (err);
    });
});

app.use ('/admin', adminRoutes);
app.use (shopRoutes);

app.use (errorController.get404);

mongoose
  .connect (
    'mongodb+srv://dbUser:um42@d7.AytrJRe@shop-express.o5dku.mongodb.net/Shop?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
    }
  )
  .then (result => {
    User.findOne ().then (user => {
      if (!user) {
        const user = new User ({
          name: 'Misha',
          email: 'mixxow@gmail.com',
          cart: {
            items: [],
          },
        });
        user.save ();
      }
    });
    console.log ('Listening on Port ', PORT);
    app.listen (PORT);
  })
  .catch (err => console.log (err));
