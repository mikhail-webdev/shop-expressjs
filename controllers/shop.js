const Product = require ('../models/product');

exports.getProducts = (req, res) => {
  Product.fetchAll ()
    .then (products => {
      res.render ('shop/product-list', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch (err => {
      console.log (err);
    });
};

exports.getProduct = (req, res) => {
  const prodId = req.params.productId;
  Product.findById (prodId)
    .then (product => {
      res.render ('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products',
      });
    })
    .catch (err => console.log (err));
};

exports.getCart = (req, res) => {
  req.user
    .getCart ()
    .then (products => {
      res.render ('shop/cart', {
        products,
        pageTitle: 'You Cart',
        path: '/cart',
      });
    })
    .catch (err => console.log (err));
};

exports.postCart = (req, res) => {
  const prodId = req.body.productId;
  Product.findById (prodId)
    .then (product => {
      return req.user.addToCart (product);
    })
    .then (result => {
      console.log ('Cart Posted');
      res.redirect ('/cart');
    })
    .catch (err => {
      console.log (err);
    });
};

exports.getOrders = (req, res) => {
  req.user
    .getOrders ()
    .then (orders => {
      res.render ('shop/orders', {
        orders,
        pageTitle: 'Your Orders',
        path: '/orders',
      });
    })
    .catch (err => console.log (err));
};

exports.postOrder = (req, res) => {
  let fetchedCart;
  req.user
    .addOrder ()
    .then (result => {
      console.log ('Order Posted');
      res.redirect ('/orders');
    })
    .catch (err => console.log (err));
};

exports.postCartDeleteProduct = (req, res) => {
  const prodId = req.body.productId;
  req.user
    .deleteItemFromCart (prodId)
    .then (result => {
      res.redirect ('/cart');
    })
    .catch (err => console.log (err));
};

exports.getIndex = (req, res) => {
  Product.fetchAll ()
    .then (products => {
      res.render ('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch (err => {
      console.log (err);
    });
};

exports.getCheckout = (req, res) => {
  res.render ('shop/checkout', {
    pageTitle: 'Check out',
    path: '/checkout',
  });
};
