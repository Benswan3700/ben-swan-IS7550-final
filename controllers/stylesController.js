const MustacheStyle = require("../models/MustacheStyle");
const path = require("path");
const fs = require("fs");

exports.getStyles = async (req, res, next) => {
  try {
    const styles = await MustacheStyle.find();
    res.render("gallery", { pageTitle: "Gallery", styles, path: req.baseUrl });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.getSingleStyle = async (req, res, next) => {
  const { styleSlug } = req.params;
  try {
    const style = await MustacheStyle.findOne({
      titleSlug: styleSlug.toLowerCase(),
    });
    if (!style) {
      return res.status(404).send("Style not found");
    }
    res.render("gallery-single-post", {
      pageTitle: style.title,
      style,
      path: req.baseUrl,
    });
  } catch (err) {
    console.log("error: ", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.getNewPost = (req, res, next) => {
  res.render("new-style", { pageTitle: "New Style", path: req.path });
};

exports.createStyle = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const image = req.files.image;

    if (!image) {
      return res.status(400).send("No image uploaded.");
    }

    const titleSlug = title.toLowerCase().replace(/\s+/g, "-");

    const imagePath = path.join(__dirname, "../public/images/", image.name);
    image.mv(imagePath, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error uploading image.");
      }
    });

    const style = new MustacheStyle({
      title,
      description,
      titleSlug,
      imageURL: "images/" + image.name,
    });
    await style.save();

    res.redirect("/styles");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};
