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

const userController = require("../controllers/userController");

router.get("/", userController.getLogin);

router.post("/login", userController.postLogin);

router.get("/register", userController.getRegister);

router.post("/register", userController.postRegister);

router.get("/logout", userController.logout);

router.post("/save-favorite/:styleSlug", userController.saveFavorite);

router.get("/favorite-styles", userController.getFavoriteStyles);

router.get("/admin-privileges", isAdmin, userController.renderAdminPrivileges);

router.post("/admin-privileges", isAdmin, userController.updateAdminPrivileges);

router.get("/recent-favs", userController.renderRecentFavorites);

module.exports = router;
