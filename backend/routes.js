const express = require("express");

const router = express.Router();

const upload = require("./helpers/upload");

const {
  createAlbum,
  getAlbuns,
  getAlbum,
  deleteAlbum,
  updateAlbum,
  toggleFavorite,
  addComment,
} = require("./controllers/AlbumController");

router.post(
  "/",
  upload.single("image"),
  (req, res, next) => {
    const image = req.file;
    if (!image) {
      return res.status(400).json({ msg: "Por favor, envie um arquivo." });
    }

    next();
  },
  (req, res) => createAlbum(req, res)
);

router.get("/", (req, res) => getAlbuns(req, res));

router.get("/:id", (req, res) => getAlbum(req, res));

router.delete("/:id", (req, res) => deleteAlbum(req, res));

router.patch("/:id", upload.single("image"), (req, res) =>
  updateAlbum(req, res)
);

router.patch("/favorite/:id", (req, res) => toggleFavorite(req, res));

router.patch("/:id/comment", (req, res) => addComment(req, res));

module.exports = router;
