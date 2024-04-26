const BlogPost = require("../models/BlogPost");

exports.getBlogs = async (req, res, next) => {
  try {
    const blogs = await BlogPost.find().sort({ postDate: "desc" });
    res.render("blog", { pageTitle: "Blog", blogs, path: req.baseUrl });
  } catch (err) {
    console.log("error: ", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.getSingleBlog = async (req, res, next) => {
  const { titleSlug } = req.params;
  try {
    const blog = await BlogPost.findOne({ titleSlug: titleSlug.toLowerCase() });
    if (!blog) {
      return res.status(404).send("Blog not found");
    }
    res.render("blog-single-post", {
      pageTitle: blog.title,
      blog,
      path: req.baseUrl,
    });
  } catch (err) {
    console.log("error: ", err);
    res.status(500).send("Internal Server Error");
  }
};
