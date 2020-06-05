const Product = require('../models/product');
const path = require('path');
const Cart = require('../models/cart');



exports.getAddProdct = (req, res, next) =>{
   res.render('admin', {
    pagetitle: 'AddProduct',
    editmode: false

   });
  }
  exports.geteditProdct = (req, res, next) =>{
        const editmode = req.query.edit;
        console.log(editmode);

        if (!editmode){
          return res.redirect('/');

        }
        const prodId = req.params.productId;
        Product.findbyId(prodId, product =>{
          res.render('admin', {
            product: product,
            price: +product.price,
            pagetitle: 'Edit Product',
            editmode:editmode
          });
        })
   }

   exports.postEditproduct = (req, res, next)=>{
      const prodId = req.body.productId;
      if(!prodId){
        console.log('no id');

      }
      const updatedTitle = req.body.title;
      const updatedDesc = req.body.desc;
      const updatedPrice = req.body.price;
      const updatedImage = req.body.image;
    const updatedproduct = new Product(prodId, updatedTitle, updatedDesc, updatedPrice, updatedImage);
    updatedproduct.save();
    res.redirect('/adminproduct');

   }



exports.postProduct = (req, res, next)=>{
    const product = new Product(
      null, 
      req.body.title,
      req.body.desc,
      req.body.price,
      req.body.image);

        product.save();
        res.redirect('/products');

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
    productCSS: true
  


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

//carts
exports.getCarts = (req, res, next) =>{
 Cart.getCart(cart =>{
   Product.fetchAll(products =>{
      const cartProducts = [];
      for(product of products) {

        const cartProductData = cart.products.find(prod => prod.id === product.id);
        if(cartProductData){
          cartProducts.push({productData: product, qty: cartProductData.qty});

        }
      }
    res.render('cart', {
      pagetitle: 'Cart',
      path: '/cart',
      products: cartProducts
      
    });



   });

 });


  


}


//delete cart

exports.cartDeleteProduct = (req, res, next)=>{
  const prodId = req.body.productId;
  const price = req.body.price;
  console.log(prodId);
  Cart.deleteProduct(prodId, price);

    res.redirect('/cart');

}
exports.getAdminProducts = (req, res, next) =>{
 Product.fetchAll((products) => {
  res.render('adminproduct', {
    prods: products,
    pagetitle: 'AdminProducts',
    path: '/adminproducts',
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true,
  


});
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
//delete product

exports.deleteProduct = (req, res, next) =>{
  const prodId = req.body.productId;
  
  Product.deleteById(prodId);
  res.redirect('/adminproduct');




}

