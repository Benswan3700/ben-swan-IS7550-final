const mongoose = require("mongoose");
const slugify = require("slugify");

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /\.(jpg|png)$/.test(v);
      },
      message: (props) =>
        `${props.value} .jpg or .png are the only accepted file tyoes`,
    },
  },
  summary: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  postDate: {
    type: Date,
    default: Date.now,
  },
  titleSlug: {
    type: String,
  },
});

blogPostSchema.pre("save", function (next) {
  this.titleSlug = slugify(this.title, { lower: true, trim: true });
  next();
});

const BlogPost = mongoose.model("BlogPost", blogPostSchema);

module.exports = BlogPost;
