const Product = require('../models/product');
const path = require('path');
const Order = require('../models/order');



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
        req.user.getProducts({where:{id:prodId}})
        .then(products =>{
          const product = products[0];
          res.render('admin', {
            product: product,
            price: +product.price,
            pagetitle: 'Edit Product',
            editmode:editmode
          });
        }).catch(err => console.log(err));
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
      Product.findByPk(prodId).then(product => {
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDesc;
        product.imageUrl = updatedImage;
        return product.save()
      }).then(result => {
        res.redirect('/adminproduct');

      }).catch(err=> console.log(err));

   }



exports.postProduct = (req, res, next)=>{
    const title = req.body.title;
    const description = req.body.desc;
    const price = req.body.price;
    const imageUrl = req.body.image;
    req.user.createProduct({
      title: title,
      description: description,
      price: price,
      imageUrl: imageUrl
    })
   .then(result => {
      res.redirect('/products');
      console.log('Added Product!');
    }).catch(err => console.log(err));
  
  }
// ---------shop------------

exports.getProduct = (req, res, next) => {
 req.user.getProducts().then(products => {
  res.render('products', {
    prods: products,
    pagetitle: 'Shop',
    path: '/products',
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true
  


});
 }).catch(err => console.log(err));

 
    }
exports.getIndex = (req, res, next) =>{
 
    res.render('home', {
      pagetitle: 'Home',
      path: '/',
      activeShop: true,
      productCSS: true,
    
  
  
  });
  

}

//carts
exports.getCarts = (req, res, next) =>{

  req.user.getCart().then(cart => {
    return cart
    .getProducts()
    .then(products => {
      res.render('cart', {
              pagetitle: 'Cart',
              path: '/cart',
              products: products
              
            });
    }).catch(err => console.log(err));
  }).catch(err => console.log(err));
//  Cart.getCart(cart =>{
//    Product.fetchAll(products =>{
//       const cartProducts = [];
//       for(product of products) {

//         const cartProductData = cart.products.find(prod => prod.id === product.id);
//         if(cartProductData){
//           cartProducts.push({productData: product, qty: cartProductData.qty});

//         }
//       }
//     res.render('cart', {
//       pagetitle: 'Cart',
//       path: '/cart',
//       products: cartProducts
      
//     });



//    });

//  });


  


}


//delete cart

exports.cartDeleteProduct = (req, res, next)=>{
  const prodId = req.body.productId;
 req.user.getCart().then(cart => {
   return cart.getProducts({where: {id: prodId}})
 })
 .then(products => {
   const product = products[0];
   return product.cartItems.destroy();
 })
 .then(result => {
   res.redirect('/cart');
 })
 .catch(err => console.log(err));

}




exports.getAdminProducts = (req, res, next) =>{
 Product.findAll().then(products => {
  res.render('adminproduct', {
    prods: products,
    pagetitle: 'AdminProducts',
    path: '/adminproducts',
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true,
  


});

 }).catch(err => console.log(err));
}




exports.getproductId = (req, res, next) =>{
  const prodId = req.params.productId;
  Product.findByPk(prodId).then(product => {
    res.render('details', {
      product: product

    });
  }).catch(err => console.log(err));

  
  

}

exports.postcart = (req, res, next) =>{
    const prodId = req.body.productId;
    let fetchCart;
    let newQuantity = 1;

    req.user.getCart().then(cart => {
      fetchCart = cart;
      return cart.getProducts({where: {id: prodId}});
    })
    .then(products => {
      let product;
      if (products.length > 0 ){
        product = products[0];
      }
      if (product) {
        const oldQuantity = product.cartItems.quantity;
        newQuantity = oldQuantity + 1;
        return product;

      }
      return Product.findByPk(prodId);
      })
      .then(product => {
        return fetchCart.addProduct(product, { through: {quantity: newQuantity}});

      })
    .then(()=> {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));



}
//delete product

exports.deleteProduct = (req, res, next) =>{
  const prodId = req.body.productId;
  
  Product.findByPk(prodId).then(product => {

    return product.destroy();

  }).then(result => {
    res.redirect('/adminproduct');

  }).catch(err => console.log(err));




}


//orders

exports.getOrder = (req, res ,next) => {

  req.user.getOrders({include: ['products']}).then(orders => {
    res.render('orders', {
      pagetitle: 'Orders',
      orders: orders
    });
  }).catch(err => console.log(err));

}





exports.postOrders = (req, res, next) => {
  let fetchCart;
  req.user.getCart().then(cart => {
    fetchCart = cart;
    return cart.getProducts();
  })
  .then(products =>{
    return req.user
    .createOrder()
    .then(order => {
      return order.addProducts(
        products.map(product => {
        product.orderItems = { quantity: product.cartItems.quantity};
        return product;
      }));
    }).catch(err => console.log(err));
  })
  .then(result => {
    return fetchCart.setProducts(null);
  })
  .then(result => {
    res.redirect('/orders');

  })
  .catch(err => console.log(err));

}
