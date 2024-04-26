const User = require("../models/UserModel");
const MustacheFavorite = require("../models/favsModel");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  res.render("login", { pageTitle: "Login", path: req.path });
};

exports.getRegister = (req, res) => {
  res.render("register", { pageTitle: "Register", path: req.path });
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.render("login", {
        pageTitle: "Login",
        message: "Invalid email or password",
        entries: req.body,
        path: req.path,
      });
    }

    req.session.isLoggedIn = true;
    req.session.user = user;
    req.session.save((err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
      }
      res.redirect("/");
    });
  } catch (err) {
    console.error(err);
    return res.render("login", {
      pageTitle: "Login",
      message: "Something went wrong",
      entries: req.body,
      errors: Object.values(err.errors),
    });
  }
};

exports.postRegister = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.redirect("/auth");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.redirect("/");
    }
  });
};

exports.saveFavorite = async (req, res, next) => {
  const styleSlug = req.params.styleSlug;
  try {
    const userId = req.session.user._id;
    const styleId = req.body.styleId;

    const existingFavorite = await MustacheFavorite.findOne({
      userId: userId,
      mustacheStyleId: styleId,
    });

    if (!existingFavorite) {
      await User.findByIdAndUpdate(userId, {
        $addToSet: { favoriteStyles: styleId },
      });

      await MustacheFavorite.create({
        userId: userId,
        mustacheStyleId: styleId,
      });
    }

    res.redirect(`/styles/${styleSlug}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.getFavoriteStyles = async (req, res) => {
  try {
    const user = req.session.user;
    const userData = await User.findById(user._id).populate("favoriteStyles");

    const favoriteStyles = userData.favoriteStyles || [];

    res.render("favorite-styles", {
      pageTitle: "Favorite Styles",
      path: req.path,
      favoriteStyles,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.renderAdminPrivileges = async (req, res) => {
  try {
    const users = await User.find();
    res.render("admin-privileges", {
      pageTitle: "Update Privileges",
      path: req.path,
      users,
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.updateAdminPrivileges = async (req, res) => {
  try {
    const users = req.body.users;

    users.forEach(async (user) => {
      if (!user.admin) {
        user.admin = false;
      }
      await User.findByIdAndUpdate(user.id, { admin: user.admin });
    });

    res.redirect("/auth/admin-privileges");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.renderRecentFavorites = async (req, res, next) => {
  try {
    const favorites = await MustacheFavorite.find({})
      .populate({
        path: "userId",
        select: "firstName lastName",
      })
      .populate({
        path: "mustacheStyleId",
        select: "description title",
      })
      .sort({ createdAt: -1 })
      .limit(20);

    res.render("recent-favs", {
      pageTitle: "recent favs",
      path: req.path,
      favorites,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};
