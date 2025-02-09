const mongoose = require('mongodb');

const PropertySchema = new mongoose.Schema({
    address: String,
    price: Number,
    bedrooms: Number,
    bathrooms: Number
});

module.exports = mongoose.model('Property', PropertySchema);