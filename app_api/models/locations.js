var mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema({
  author: String,
  rating: {type: Number, "default": 0, min: 0, max: 5},
  reviewText: String,
  createdOn: {type: Date, "default": Date.now}
});

var openingTimesSchema = new mongoose.Schema({
  days: {type: String, required: true},
  opening: String,
  closing: String,
  closed: {type: Boolean, required: true}
});

var locationSchema = new mongoose.Schema({
  name: String,
  address: String,
  rating: {type: Number, "default": 0, min: 0, max: 5},
  facilities: [String],
  coords: {type: [Number], index: '2dsphere'}, // 2dsphere required for GeoJSON , order = long , lat
  openingTimes: [openingTimesSchema],
  reviews: [reviewSchema]
});

mongoose.model('Location', locationSchema);
