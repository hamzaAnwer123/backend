require('dotenv').config()
const express = require('express');
const app = express();
const products_route = require('./routes/products.route')
const ConnectDB = require('./db/connect');


const PORT = process.env.PORT || 3000;


app.get("/",(req,res)=>{
res.send("Hi I am Live!");
})

app.use("/api/products",products_route)
const start = async () =>{
    try {
        await ConnectDB(process.env.MONGODB_URL);
        app.listen(PORT,()=>{
            console.log(`${PORT} Yes I am Connected`);
            
        })
    } catch (error) {
        console.log(error);
    }
}

start();