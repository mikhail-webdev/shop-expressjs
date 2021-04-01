const Product = require ('../models/product');
const Order = require ('../models/order');

exports.getProducts = (req, res) => {
  Product.find ()
    .then (products => {
      res.render ('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
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
    .populate ('cart.items.productId')
    .execPopulate ()
    .then (user => {
      const products = user.cart.items;
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
      res.redirect ('/cart');
    })
    .catch (err => {
      console.log (err);
    });
};

exports.getOrders = (req, res) => {
  Order.find ({'user.userId': req.user})
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
  req.user
    .populate ('cart.items.productId')
    .execPopulate ()
    .then (user => {
      const products = user.cart.items.map (item => {
        return {quantity: item.quantity, product: {...item.productId._doc}};
      });
      const order = new Order ({
        products,
        user: {
          email: req.user.email,
          userId: req.user._id,
        },
      });
      return order.save ();
    })
    .then (() => {
      return req.user.clearCart ();
    })
    .then (() => {
      res.redirect ('/orders');
    })
    .catch (err => console.log (err));
};

exports.postCartDeleteProduct = (req, res) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart (prodId)
    .then (() => {
      res.redirect ('/cart');
    })
    .catch (err => console.log (err));
};

exports.getIndex = (req, res) => {
  Product.find ()
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
