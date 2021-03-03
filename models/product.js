const fs = require ('fs');
const path = require ('path');

const Cart = require ('../models/cart');

const filePath = path.join (
  path.dirname (process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = callBack => {
  fs.readFile (filePath, (err, fileContent) => {
    if (err) {
      return callBack ([]);
    }
    callBack (JSON.parse (fileContent));
  });
};

module.exports = class Product {
  constructor (id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save () {
    getProductsFromFile (products => {
      if (this.id) {
        const existingProductIndex = products.findIndex (
          prod => prod.id === this.id
        );
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile (filePath, JSON.stringify (updatedProducts), err => {
          console.log (err);
        });
      } else {
        this.id = Math.random ().toString ();
        products.push (this);
        fs.writeFile (filePath, JSON.stringify (products), err => {
          console.log (err);
        });
      }
    });
  }

  static deleteById (id) {
    getProductsFromFile (products => {
      const product = products.find (prod => prod.id === id);
      const updatedProducts = products.filter (prod => prod.id !== id);
      fs.writeFile (filePath, JSON.stringify (updatedProducts), err => {
        if (!err) {
          Cart.deleteProduct (id, product.price);
        }
      });
    });
  }

  static fetchAll (callBack) {
    getProductsFromFile (callBack);
  }

  static findById (id, callBack) {
    getProductsFromFile (products => {
      const product = products.find (prod => prod.id === id);
      callBack (product);
    });
  }
};
