const fs = require('fs');

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
    constructor(t, d, p, i){
        this.title = t;
         this.desc = d;
         this.price = p;
         this.image = i;


    } 
     
    save() {
      this.id = Math.random().toString();
        const p = path.join(
          path.dirname(process.mainModule.filename),
          'data',
          'products.json'
        );
        fs.readFile(p, (err, fileContent) => {
          let products = [];
          if (!err) {
            products = JSON.parse(fileContent);
          }
          products.push(this);
          fs.writeFile(p, JSON.stringify(products), err => {
            console.log(err);
          });
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

}