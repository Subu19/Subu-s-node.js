const http = require('http');
const express = require('express')
const bodyParser = require('body-parser');

const app = express();
app.set('view engine' , 'ejs');
app.set('views', 'htmlfiles');


const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const path = require('path');
const sequelize = require('./util/database');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItems = require('./models/cartItems');
const Order = require('./models/order');
const OrderItems = require('./models/orderItems');



app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/products/:productId', express.static(path.join(__dirname, 'public')));
app.use('/editproduct/:productId', express.static(path.join(__dirname, 'public')));

app.use((req, res, next)=>{
    User.findByPk(1).then(user =>{
        req.user = user;
        next();

    }).catch(err => console.log(err));
})


app.use(adminData);
app.use(shopRoutes);
app.use((req, res, next) => {
   

    res.status(404).sendfile(path.join(__dirname, 'htmlfiles', '404page.html'))


});

Product.belongsTo(User, {constraints:true, onDelete: 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItems});
Product.belongsToMany(Cart, {through: CartItems});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through: OrderItems});

sequelize.sync().then(result => {
   
    return User.findByPk(1);

    
}).then(user => {
    if(!user){
        return User.create({
            name: 'Subu',
            email:'subu@gmail.com'
        });
    }
    return user;
})
.then(user => {
    return user.createCart();
    
    // console.log(user);
})
.then(cart => {
    app.listen(80);
})
.catch(err => console.log(err));
