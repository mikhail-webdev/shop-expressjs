const mongoose = require ('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema ({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model ('Product', productSchema);

// const mongodb = require ('mongodb');
// const getDb = require ('../util/db').getDb;

// class Product {
//   constructor (title, price, description, imageUrl, id, userId) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this._id = id ? new mongodb.ObjectId (id) : null;
//     this.userId = userId;
//   }

//   save () {
//     const db = getDb ();
//     let dbOperation;
//     if (this._id) {
//       dbOperation = db.collection ('products').updateOne (
//         {
//           _id: this._id,
//         },
//         {
//           $set: this,
//         }
//       );
//     } else {
//       dbOperation = db.collection ('products').insertOne (this);
//     }
//     return dbOperation
//       .then (result => {
//         console.log ('Product Saved');
//       })
//       .catch (err => {
//         console.log (err);
//       });
//   }

//   static fetchAll () {
//     const db = getDb ();
//     return db
//       .collection ('products')
//       .find ()
//       .toArray ()
//       .then (products => {
//         console.log ('Products Fetched');
//         return products;
//       })
//       .catch (err => {
//         console.log (err);
//       });
//   }

//   static findById (prodId) {
//     const db = getDb ();
//     return db
//       .collection ('products')
//       .find ({_id: new mongodb.ObjectId (prodId)})
//       .next ()
//       .then (product => {
//         return product;
//       })
//       .catch (err => {
//         console.log (err);
//       });
//   }

//   static deleteById (prodId) {
//     const db = getDb ();
//     return db
//       .collection ('products')
//       .deleteOne ({_id: new mongodb.ObjectId (prodId)})
//       .then (() => {
//         console.log ('Deleted');
//       })
//       .catch (err => {
//         console.log (err);
//       });
//   }
// }

// module.exports = Product;
