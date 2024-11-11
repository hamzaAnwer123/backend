require('dotenv').config();
const ConnectDB = require('./db/connect');
const Product = require('./models/products.model');
const ProductJson = require('./products.json');
const start = async () => {
    try {
        await ConnectDB(process.env.MONGODB_URL)
        await Product.deleteMany()
        await Product.create(ProductJson);
        console.log('success');
        
    } catch (error) {
        console.log(error);
        
    }
};
start();