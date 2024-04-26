const express = require("express");
const router = express.Router();

const isAdmin = (req, res, next) => {
  if (req.session.user.admin === true) {
    next();
  } else {
    res
      .status(401)
      .render("no-access", {
        message: "You can't access this page",
        pageTitle: "No Access",
        path: req.path,
      });
  }
};

const contactController = require("../controllers/contactController");

router.get("/new", contactController.getContact);

router.post("/create", contactController.createContact);

router.post("/:id/update", isAdmin, contactController.editContact);

router.get("/:id/edit", isAdmin, contactController.getEditContact);

router.get("/", isAdmin, contactController.getContactList);

module.exports = router;
