


const Product = require('../models/products.model');

const getAllProducts = async (req, res) => {
  try {
    const { category, search, productId, newProduct, sort, select } = req.query;

    // Initialize query object
    const QueryObject = {};

    // Add category and other filters
    if (category) {
      QueryObject.category = category;
    }
    if (newProduct) {
      QueryObject.newProduct = newProduct;
    }
    if (productId) {
      QueryObject.productId = productId;
    }

    // Add search logic for both productName and description
    if (search) {
      QueryObject.$or = [
        { productName: { $regex: search, $options: 'i' } }, // Case-insensitive search in productName
        { description: { $regex: search, $options: 'i' } }, // Case-insensitive search in description
      ];
    }

    // Build the query
    let apiData = Product.find(QueryObject);

    // Apply sorting
    if (sort) {
      let sortFix = sort.split(',').join(' ');
      apiData = apiData.sort(sortFix);
    }

    // Apply field selection
    if (select) {
      let selectFix = select.split(',').join(' ');
      apiData = apiData.select(selectFix);
    }

    // Pagination logic
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;
    let skip = (page - 1) * limit;
    apiData = apiData.skip(skip).limit(limit);

    // Execute query
    const ProductData = await apiData;

    // Total product count
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

module.exports = { getAllProducts };
