const Product = require('../models/products.model');

// Controller to get all products with filters, search, sorting, and pagination
const getAllProducts = async (req, res) => {
  try {
    // Extract query parameters
    const { category, Search, productId, newProduct, sort, select, productName, description } = req.query;

    // Initialize query object
    const QueryObject = {};

    // Add filters based on query parameters
    if (category) {
      QueryObject.category = category;
    }
    if (newProduct) {
      QueryObject.newProduct = newProduct;
    }
    if (productId) {
      QueryObject.productId = productId;
    }
    if (productName) {
      QueryObject.productName = { $regex: productName, $options: 'i' }; // Case-insensitive search for productName
    }
    if (description) {
      QueryObject.description = { $regex: description, $options: 'i' }; // Case-insensitive search for description
    }

    // Build the query
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
    let page = Number(req.query.page) || 0;
    let limit = Number(req.query.limit) || 10;
    let skip = (page - 1) * limit;
    apiData = apiData.skip(skip).limit(limit);

    // Execute query
    const ProductData = await apiData;

    // Total product count (used for pagination metadata)
    const totalProducts = await Product.countDocuments(QueryObject);

    res.status(200).json({
      products: ProductData.length,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      ProductData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching products.' });
  }
};

// Controller for simple query testing
const getAllProductsTesting = async (req, res) => {
  try {
    const ProductData = await Product.find(req.query);
    res.status(200).json(ProductData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred during testing.' });
  }
};

module.exports = { getAllProducts, getAllProductsTesting };
