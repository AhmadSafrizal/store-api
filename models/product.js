const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'nama product harus ada'],
  },
  price: {
    type: Number,
    required: [true, 'harga product harus ada'],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  company: {
    type: String,
    enum:{
      values: ['sungsang','susu','caca','mami'],
      message: '{VALUE} tidak didukung',
    },
    // enum:['sungsang','susu','caca','mami'],
  },
})

module.exports = mongoose.model('Product', productSchema)