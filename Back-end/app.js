const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const exhbs = require('express-handlebars');
const dbo = require('./db');
// const cors = require("cors");
// console.log("App listen at port 5000");
// app.use(express.json());
// app.use(cors());

app.engine('hbs', exhbs.engine({layoutsDir:'views/', defaultLayout:"main", extname:"hbs"}));
app.set('view engine','hbs');
app.set('views','views');

app.get('/',async (req,res) =>{

    let database = await dbo.getDatabse();
    const collection = database.collection('tbluser');
    const cursor = collection.find({});
    let data = await cursor.toArray();

    let message = '';
    res.render('main',{message, data})
})

app.listen(8000, () =>{console.log('Listing to 8000 port')});