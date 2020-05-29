const http = require('http');
const express = require('express')
const bodyParser = require('body-parser');

const app = express();
app.set('view engine' , 'ejs');
app.set('views', 'htmlfiles');


const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const path = require('path');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/products/:productId', express.static(path.join(__dirname, 'public')));

app.use(adminData);
app.use(shopRoutes);
app.use((req, res, next) => {
   

    res.status(404).sendfile(path.join(__dirname, 'htmlfiles', '404page.html'))


});


app.listen(80);