const fs = require('fs');
const Cart = require('./cart');


 const path = require('path');
 const getProductsFromFile = cb => {
  const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');

  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
    constructor(id, t, d, p, i){
         this.id = id;
         this.title = t;
         this.desc = d;
         this.price = p;
         this.image = i;


    } 
     
    save() {
        getProductsFromFile(products => {
          if(this.id){
            const existingproductindex = products.findIndex(prod => prod.id === this.id);
            const updatedProduct = [...products];
            updatedProduct[existingproductindex] = this;
            const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');

            fs.writeFile(p, JSON.stringify(updatedProduct), err => {
              console.log(err);
            });
            
          

          

        } else {
          this.id = Math.random().toString();

          products.push(this);
          const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');


          fs.writeFile(p, JSON.stringify(products), err => {
            console.log(err);
          });
        
      
      
          
        }
      });
        
      }

    static fetchAll(cb){
         const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');

         fs.readFile(p, (err, fileContent) => {
            if (err) {
                cb([]);
            }
            cb(JSON.parse(fileContent));
         });
       

    }

    static findbyId(id, cb){

      getProductsFromFile(products =>{
        const product = products.find(p => p.id === id);
        cb(product);
      });
    }
//delete product
    static deleteById(id){
      

      getProductsFromFile(products =>{
        const product = products.find(prod => prod.id === id);
         
      const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');

      const updatedProduct = products.filter(prod => prod.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProduct), err =>{
        if(!err){
          Cart.deleteProduct(id, product.price);

        }
      });

      });


    }

}


