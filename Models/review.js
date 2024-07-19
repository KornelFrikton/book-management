const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema({
  review: {
    type: String,
    required: [true, "Review is required"],
    trim: true,
    minLength: 2
  },
  stars: {
    type: Number,
    required: [true, "Stars is required"],
    min: [1, 'Value must be at least 1 star'],
    max: [5, 'Value must be maximum 5 stars'],
    validate: {
      validator: Number.isInteger,
      message: 'The value must be an integer'
    },
    default: 1
  },
  reviewAuthor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
  },
  bookId: {
    type: String
  }
});

module.exports = mongoose.model("Review", ReviewSchema);