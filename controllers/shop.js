const fs = require ('fs');
const path = require ('path');

const PDFDocument = require ('pdfkit');

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
      const error = new Error (err);
      error.httpStatusCode = 500;
      return next (error);
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
    .catch (err => {
      const error = new Error (err);
      error.httpStatusCode = 500;
      return next (error);
    });
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
    .catch (err => {
      const error = new Error (err);
      error.httpStatusCode = 500;
      return next (error);
    });
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
      const error = new Error (err);
      error.httpStatusCode = 500;
      return next (error);
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
    .catch (err => {
      const error = new Error (err);
      error.httpStatusCode = 500;
      return next (error);
    });
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
    .catch (err => {
      const error = new Error (err);
      error.httpStatusCode = 500;
      return next (error);
    });
};

exports.postCartDeleteProduct = (req, res) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart (prodId)
    .then (() => {
      res.redirect ('/cart');
    })
    .catch (err => {
      const error = new Error (err);
      error.httpStatusCode = 500;
      return next (error);
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById (orderId)
    .then (order => {
      if (!order) {
        return next (new Error ('No order found'));
      }
      if (order.user.userId.toString () !== req.user._id.toString ()) {
        return next (new Error ('Unauthorized'));
      }
      const invoiceName = 'invoice-' + orderId + '.pdf';
      const invoicePath = path.join ('data', 'invoices', invoiceName);

      const pdfDoc = new PDFDocument ();
      res.setHeader ('Content-Type', 'Application/pdf');
      res.setHeader (
        'Content-Disposition',
        'inline; filename="' + invoiceName + '"'
      );
      pdfDoc.pipe (fs.createWriteStream (invoicePath));
      pdfDoc.pipe (res);

      pdfDoc.fontSize (26).text ('Invoice', {underline: true});
      pdfDoc.fontSize (14).text ('_______________');
      pdfDoc.fontSize (14).text ('Order #' + order._id);
      pdfDoc.fontSize (14).text ('Items');
      let totalPrice = 0;
      order.products.forEach (prod => {
        totalPrice += prod.quantity * prod.product.price;
        pdfDoc
          .fontSize (14)
          .text (
            prod.product.title +
              ' - ' +
              prod.quantity +
              ' x ' +
              '$' +
              prod.product.price
          );
      });
      pdfDoc.text ('_______________');
      pdfDoc.fontSize (20).text ('Total: $' + totalPrice);
      pdfDoc.end ();
    })
    .catch (err => next (err));
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
      const error = new Error (err);
      error.httpStatusCode = 500;
      return next (error);
    });
};

exports.getCheckout = (req, res) => {
  res.render ('shop/checkout', {
    pageTitle: 'Check out',
    path: '/checkout',
  });
};
