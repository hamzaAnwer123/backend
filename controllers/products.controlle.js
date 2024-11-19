const Product = require('../models/products.model');

// Controller to get all products with filters, search, sorting, and pagination
const getAllProducts = async (req, res) => {
  try {
    const { category, Search, productId, newProduct, sort, select, productName, description } = req.query;

    // Initialize query object
    const QueryObject = {};
    if (category) QueryObject.category = category;
    if (newProduct) QueryObject.newProduct = newProduct;
    if (productId) QueryObject.productId = productId;
    if (productName) QueryObject.productName = { $regex: productName, $options: 'i' }; 
    if (description) QueryObject.description = { $regex: description, $options: 'i' };

    // Build query
    let apiData = Product.find(QueryObject);

    // Apply sorting
    if (sort) {
      let sortFix = sort.split(",").join(" ");
      apiData = apiData.sort(sortFix);
    }

    // Apply field selection
    if (select) {
      let selectFix = select.split(",").join(" ");
      apiData = apiData.select(selectFix);
    }

    // Pagination logic
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;
    if (page < 1) page = 1;
    if (limit < 1) limit = 10;

    let skip = (page - 1) * limit;
    apiData = apiData.skip(skip).limit(limit);

    // Execute query
    const ProductData = await apiData;
    const totalProducts = await Product.countDocuments(QueryObject);

    res.status(200).json({
      productsOnPage: ProductData.length,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      limit,
      ProductData,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: 'An error occurred while fetching products.' });
  }
};

module.exports = { getAllProducts };
