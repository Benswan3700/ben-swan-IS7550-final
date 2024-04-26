const MustacheStyle = require("../models/MustacheStyle");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const qs = require("qs");
require("dotenv").config();

const client_id = process.env.SPOTIFY_API_ID; 
const client_secret = process.env.SPOTIFY_CLIENT_SECRET; 
const auth_token = Buffer.from(
  `${client_id}:${client_secret}`,
  "utf-8"
).toString("base64");

exports.getStyles = async (req, res, next) => {
  try {
    const styles = await MustacheStyle.find();

    const stylesWithFullImageUrl = styles.map((style) => {
      return {
        id: style._id,
        title: style.title,
        description: style.description,
        imageUrl: `http://localhost:3000/${style.imageURL}`,
      };
    });

    res.json(stylesWithFullImageUrl);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.getToken = async (req, res, next) => {
  try {
    const token = jwt.sign({}, "Secret", { expiresIn: "24h" });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.query.token;

    if (!token) {
      return res.status(401).json({ message: "Token is required" });
    }

    jwt.verify(token, "Secret", (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }
      next();
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getExternalAuth = async () => {
  try {
    const token_url = "https://accounts.spotify.com/api/token";
    const data = qs.stringify({ grant_type: "client_credentials" });

    const response = await axios.post(token_url, data, {
      headers: {
        Authorization: `Basic ${auth_token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data.access_token;
  } catch (error) {
    console.log(error);
  }
};

exports.getTaylorSwiftAlbums = async (req, res, next) => {
  const access_token = await getExternalAuth();

  api_url = "https://api.spotify.com/v1/artists/06HL4z0CvFAxyc27GXpf02/albums";
  try {
    const response = await axios.get(api_url, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });


    const albums = response.data.items.map((album) => ({
      name: album.name,
      total_tracks: album.total_tracks,
      release_date: album.release_date,
    }));

    res.render("external-api", {
      pageTitle: "externalAPI",
      path: req.path,
      albums,
    });
  } catch (error) {
    console.log(error);
  }
};
