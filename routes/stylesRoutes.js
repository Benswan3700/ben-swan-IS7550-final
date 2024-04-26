const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");

const isAdmin = (req, res, next) => {
  if (req.session && req.session.user.admin) {
    next();
  } else {
    res.status(401).send("You can't access this page");
  }
};

const stylesController = require("../controllers/stylesController");

router.use(fileUpload());

router.get("/", stylesController.getStyles);

router.get("/new", isAdmin, stylesController.getNewPost);

router.post("/new/create", isAdmin, stylesController.createStyle);

router.get("/:styleSlug", stylesController.getSingleStyle);

module.exports = router;
