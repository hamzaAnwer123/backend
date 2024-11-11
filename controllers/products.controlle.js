const Product = require('../models/products.model');

const getAllProducts = async (req,res)=>{
    const { category ,productName,newProduct,sort,select}  = req.query;
    const  QueryObject = {};
    if(category){
        QueryObject.category = category;
    }
    if(newProduct){
        QueryObject.newProduct = newProduct;
    }
    if(productName){
        QueryObject.productName = {$regex : productName, $options : 'i'};
    }
    let apiData =  Product.find(QueryObject)
    if(sort){
        let sortFix = sort.split(",").join(" ");
        apiData = apiData.sort(sortFix);
    }
    if(select){
        let selectFix = select.split(",").join(" ");
        apiData = apiData.select(selectFix);
    }

    let page = req.query.page || 1 ;
    let limit = req.query.limit || 10 ;
    let skip = (page-1) * limit ;

    apiData = apiData.skip(skip).limit(limit);
    
    const ProductData = await apiData;

    res.status(200).json({ProductData ,products : ProductData.length});
}
const getAllProductsTesting = async (req,res)=>{
    const ProductData = await Product.find(req.query); 
    res.status(200).json(ProductData);
}

module.exports = {getAllProducts, getAllProductsTesting}