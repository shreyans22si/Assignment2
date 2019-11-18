var mongoose = require('mongoose');

var AdvertisementSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        price: Number,
        location: String,
     }
);

module.exports = mongoose.model('advertisements', AdvertisementSchema);