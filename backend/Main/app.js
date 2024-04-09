const express = require('express');
const mongoose= require('mongoose');
const app=express();
const bodyParser = require('body-parser');
const userrouter = require('../Routes/CustomerRouter');
const vendorrouter = require('../Routes/VendorRouter');
const dbURI = 'mongodb+srv://Sameer123:sameer123@cluster0.tssquen.mongodb.net/Test?retryWrites=true&w=majority';

mongoose.connect(dbURI).then((result)=>{
    app.listen(8081);
    console.log("Connected...");
    console.log("App is running");
   
}).catch((err)=>{
    console.log(err);
});
mongoose.set('strictQuery',true);

var cors = require('cors');
app.use(cors());
app.set('view engine', 'ejs');
app.use(bodyParser.json());

app.use('/CustomerContent',userrouter);

app.use('/VendorContent',vendorrouter);