const Album = require("../models/Album");

const fs = require("fs");

const removeOldImage = (album) => {
  fs.unlink(`public/${album.src}`, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Imagem excluída do servidor!");
    }
  });
};

const createAlbum = async (req, res) => {
  try {
    const { title, description } = req.body;

    const src = `images/${req.file.filename}`;

    if (!title || !description) {
      return res
        .status(400)
        .json({ msg: "Por favor, preencha todos os campos." });
    }

    const newAlbum = new Album({
      title,
      src,
      description,
    });

    await newAlbum.save();

    res.json({ msg: "Álbum criado com sucesso!", newAlbum });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Ocorreu um erro.");
  }
};

const getAlbuns = async (req, res) => {
  try {
    const albuns = await Album.find();

    res.json(albuns);
  } catch (error) {
    res.status(500).send("Ocorreu um erro.");
  }
};

const getAlbum = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);

    if (!album) {
      return res.statu(404).json({ msg: "Álbum não encontrado." });
    }

    res.json(album);
  } catch (error) {
    res.status(500).send("Ocorreu um erro.");
  }
};

const deleteAlbum = async (req, res) => {
  try {
    const album = await Album.findByIdAndDelete(req.params.id);

    if (!album) {
      return res.statu(404).json({ msg: "Álbum não encontrado." });
    }

    removeOldImage(album);

    res.json({ msg: "Álbum excluído!" });
  } catch (error) {
    res.status(500).send("Ocorreu um erro.");
  }
};

const updateAlbum = async (req, res) => {
  try {
    const { title, description } = req.body;

    let src = null;

    if (req.file) {
      src = `images/${req.file.filename}`;
    }

    const album = await Album.findById(req.params.id);

    if (!album) {
      return res.status(404).json({ msg: "Álbum não encontrado." });
    }

    if (src) {
      removeOldImage(album);
    }

    const updateData = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (src) updateData.src = src;

    const updateAlbum = await Album.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({ updateAlbum, msg: "Álbum atualizado com sucesso!" });
  } catch (error) {
    res.status(500).send("Ocorreu um erro.");
  }
};

const toggleFavorite = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);

    if (!album) {
      return res.statu(404).json({ msg: "Álbum não encontrado." });
    }

    album.favorite = !album.favorite;

    await album.save();

    res.json({ msg: "Adicionado aos favoritos!", album });
  } catch (error) {
    res.status(500).send("Ocorreu um erro.");
  }
};

const addComment = async (req, res) => {
  try {
    const { name, text } = req.body;

    if (!name || !text) {
      return res
        .status(400)
        .json({ msg: "Por favor, preencha todos os campos." });
    }

    const comment = { name, text };

    const album = await Album.findById(req.params.id);

    if (!album) {
      return res.statu(404).json({ msg: "Álbum não encontrado." });
    }

    album.comments.push(comment);

    await album.save();

    res.json({ msg: "Comentário adicionado!", album });
  } catch (error) {
    res.status(500).send("Ocorreu um erro.");
  }
};

module.exports = {
  createAlbum,
  getAlbuns,
  getAlbum,
  deleteAlbum,
  updateAlbum,
  toggleFavorite,
  addComment,
};
