const path = require ('path');

const express = require ('express');
const {check} = require ('express-validator');

const adminController = require ('../controllers/admin');
const isAuth = require ('../middleware/is-auth.js');

const router = express.Router ();

router.get ('/add-product', isAuth, adminController.getAddProduct);

router.post (
  '/add-product',
  isAuth,
  [
    check ('title')
      .trim ()
      .isLength ({min: 5})
      .isAlphanumeric ()
      .withMessage ('The title should be at least 5 characthers'),
    check ('price')
      .trim ()
      .isFloat ()
      .withMessage ('Price should be a numeric value with cents'),
    check ('description')
      .trim ()
      .isLength ({min: 10, max: 400})
      .withMessage (
        'The description should be at least 10 characters and maximum of 400 characters'
      ),
  ],
  adminController.postAddProduct
);

router.get ('/products', isAuth, adminController.getProducts);

router.get ('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post (
  '/edit-product',
  isAuth,
  [
    check ('title')
      .trim ()
      .isString ()
      .isLength ({min: 5})
      .withMessage ('The title should be at least 5 characthers'),
    check ('price')
      .trim ()
      .isFloat ()
      .withMessage ('Price should be a numeric value with cents'),
    check ('description')
      .trim ()
      .isLength ({min: 10, max: 400})
      .withMessage (
        'The description should be at least 10 characters and maximum of 400 characters'
      ),
  ],
  adminController.postEditProduct
);

router.delete ('/product/:productId', isAuth, adminController.deleteProduct);

module.exports = router;
