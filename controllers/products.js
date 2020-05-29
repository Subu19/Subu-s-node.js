const Product = require('../models/product');
const path = require('path');
const Cart = require('../models/cart');



exports.getAddProdct = (req, res, next) =>{
    res.sendfile(path.join(__dirname, '../', 'htmlfiles', 'admin.html'))
  };



exports.postProduct = (req, res, next)=>{
    const product = new Product(req.body.title,
      req.body.desc,
      req.body.price,
      req.body.image);

        product.save();
        res.redirect('/');

    }
 
// ---------shop------------

exports.getProduct = (req, res, next) => {
 Product.fetchAll((products) => {
  res.render('products', {
    prods: products,
    pagetitle: 'Shop',
    path: '/products',
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true,
  


});
 });

 
    }
exports.getIndex = (req, res, next) =>{
  Product.fetchAll((products) => {
    res.render('home', {
      prods: products,
      pagetitle: 'Home',
      path: '/',
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true,
    
  
  
  });
   });

}
exports.getCarts = (req, res, next) =>{
  res.render('cart', {
    pagetitle: 'cart',
    path: '/cart'

  });


}
exports.getAdminProducts = (req, res, next) =>{
  res.render('adminproduct', {
    pagetitle: 'Admin Products',
    path: '/adminproducts'
    
  });


}
exports.getproductId = (req, res, next) =>{
  const prodId = req.params.productId;
  Product.findbyId(prodId, product => {
    res.render('details', {
      product: product

    });
  });

  
  

}

exports.postcart = (req, res, next) =>{
    const prodId = req.body.productId;
    Product.findbyId(prodId, product => {
      Cart.addProduct(prodId, product.price);
      
    });
    res.redirect('/cart');



}

