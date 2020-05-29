const express = require('express');
const path = require('path');
const adminData = require('./admin');
const controller = require('../controllers/products');


const router = express.Router();
router.get('/products', controller.getProduct);
router.get('/', controller.getIndex);
router.get('/cart', controller.getCarts);
router.post('/cart', controller.postcart);
router.get('/products/:productId', controller.getproductId);

module.exports = router;
