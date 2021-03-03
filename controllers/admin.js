const Product = require ('../models/product');

exports.getAddProduct = (req, res) => {
  res.render ('admin/edit-product', {
    pageTitle: 'Add Product',
    path: 'admin/add-product',
    editing: false,
  });
};

exports.postAddProduct = (req, res) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description.trim ();
  const price = req.body.price;
  const product = new Product (null, title, imageUrl, description, price);
  product.save ();
  res.redirect ('/');
};

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect ('/');
  }
  const prodId = req.params.productId;
  Product.findById (prodId, product => {
    if (!product) {
      return res.redirect ('/');
    }
    res.render ('admin/edit-product', {
      product,
      pageTitle: 'Edit Product',
      path: 'admin/edit-product',
      editing: editMode,
    });
  });
};

exports.postEditProduct = (req, res) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDescription = req.body.description.trim ();
  const updatedPrice = req.body.price;
  const updatedProduct = new Product (
    prodId,
    updatedTitle,
    updatedImageUrl,
    updatedDescription,
    updatedPrice
  );
  updatedProduct.save ();
  res.redirect ('/admin/products');
};

exports.postDeleteProduct = (req, res) => {
  const prodId = req.body.productId;
  Product.deleteById (prodId);
  res.redirect ('/admin/products');
};

exports.getProducts = (req, res) => {
  Product.fetchAll (products => {
    res.render ('admin/products', {
      prods: products,
      pageTitle: 'Admin products',
      path: '/admin/products',
    });
  });
};
