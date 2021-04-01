const Product = require ('../models/product');

exports.getAddProduct = (req, res) => {
  res.render ('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.postAddProduct = (req, res) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description.trim ();
  const product = new Product ({
    title,
    price,
    description,
    imageUrl,
    userId: req.user,
  });
  product
    .save ()
    .then (result => {
      res.redirect ('/admin/products');
    })
    .catch (err => {
      console.log (err);
    });
};

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect ('/');
  }
  const prodId = req.params.productId;
  Product.findById (prodId)
    .then (product => {
      if (!product) {
        return res.redirect ('/');
      }
      res.render ('admin/edit-product', {
        product,
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
      });
    })
    .catch (err => console.log (err));
};

exports.postEditProduct = (req, res) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDescription = req.body.description.trim ();

  Product.findById (prodId)
    .then (product => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDescription;
      product.imageUrl = updatedImageUrl;
      return product.save ();
    })
    .then (result => {
      res.redirect ('/admin/products');
    })
    .catch (err => console.log (err));
};

exports.postDeleteProduct = (req, res) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove (prodId)
    .then (() => {
      console.log ('Deleted the product');
      res.redirect ('/admin/products');
    })
    .catch (err => console.log (err));
};

exports.getProducts = (req, res) => {
  Product.find ()
    .then (products => {
      res.render ('admin/products', {
        prods: products,
        pageTitle: 'Admin products',
        path: '/admin/products',
      });
    })
    .catch (err => console.log (err));
};
