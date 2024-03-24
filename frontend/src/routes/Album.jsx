import axios from "../axios-config";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { toast } from "react-toastify";

import "./Album.css";

const Album = () => {
  const { id } = useParams();

  const [album, setAlbum] = useState(null);
  const [comments, setComments] = useState([]);

  const [name, setName] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    const getAlbum = async () => {
      const res = await axios.get(`/albuns/${id}`);

      setAlbum(res.data);

      setComments(res.data.comments);
    };

    getAlbum();
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const comment = { name, text };

      const res = await axios.patch(`/albuns/${album._id}/comment`, comment);

      const lastComment = res.data.album.comments.pop();

      setComments((comments) => [...comments, lastComment]);

      setName("");
      setText("");

      toast.success(res.data.msg);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.msg);
    }
  };

  if (!album) return <p className="comment-text">Carregando...</p>;

  return (
    <div className="album-page">
      <img src={`${axios.defaults.baseURL}/${album.src}`} alt={album.title} />
      <h2>{album.title}</h2>
      <p className="description">{album.description}</p>
      <div className="comment-form">
        <h3>Envie o seu comentário:</h3>
        <form onSubmit={handleSubmit}>
          <label>
            <input
              type="text"
              placeholder="Seu nome"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </label>
          <label>
            <textarea
              placeholder="Escreva seu comentário..."
              onChange={(e) => setText(e.target.value)}
              value={text}
            ></textarea>
          </label>
          <input type="submit" value="Enviar" className="btn" />
        </form>
      </div>
      <div className="comments-container">
        <h3>Comentários ({comments.length})</h3>
        {comments.length === 0 && (
          <p className="comment-text">Não há comentários...</p>
        )}
        {comments.length > 0 &&
          comments.map((comment) => (
            <div className="comment" key={comment._id}>
              <p className="comment-name">{comment.name}</p>
              <p className="comment-text">{comment.text}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Album;
