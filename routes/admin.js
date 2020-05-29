const express = require('express');
const router = express.Router();
const controller = require('../controllers/products');




router.use('/addproduct', controller.getAddProdct);
router.post('/product', controller.postProduct);
router.use('/adminproduct', controller.getAdminProducts);

module.exports = router;

