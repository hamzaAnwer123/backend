const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
  },
  productName: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    validate: {
      validator: function (value) {
        return value.every(url => typeof url === 'string');
      },
      message: 'Each image must be a URL string.',
    },
  },
  price: {
    type: Number,
    required: true,
  },
  originalPrice: {
    type: Number,
  },
  discount: {
    type: String,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
  },
  specifications: {
    type: Object,
    default: null,
  },
  colors: {
    type: [String],
    validate: {
      validator: function (value) {
        return value ? value.every(color => /^#[0-9A-F]{6}$/i.test(color)) : true;
      },
      message: 'Each color must be a valid hex code.',
    },
    default: null,
  },
  seller: {
    type: String,
  },
  availability: {
    type: String,
    enum: ['In Stock', 'Out of Stock', 'Preorder', 'Limited Stock'],
  },
  
  tags: {
    type: [String],
  },
  newProduct: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    default: 0,
  },
  actions: {
    addToCart: {
      type: Boolean,
      default: false,
    },
    buyNow: {
      type: Boolean,
      default: false,
    },
    wishlist: {
      type: Boolean,
      default: false,
    },
  },
});

module.exports = mongoose.model('Product', productSchema);
