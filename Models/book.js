const mongoose = require("mongoose");

const BookSchema = mongoose.Schema({
  author: {
    type: String,
    required: [true, "Author is required"],
    trim: true,
  },
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  reviewsNumber: {
    type: Number,
    default: 0,
  },
  averageRate: {
    type: Number,
    default: 0,
  },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
});

module.exports = mongoose.model("Book", BookSchema);