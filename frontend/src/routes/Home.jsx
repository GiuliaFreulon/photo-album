import axios from "../axios-config";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "./Home.css";

const Home = () => {
  const [albuns, setAlbuns] = useState([]);

  useEffect(() => {
    const getAlbuns = async () => {
      const res = await axios.get("/albuns");

      setAlbuns(res.data);
    };

    getAlbuns();
  }, []);

  return (
    <div className="home">
      <h2>Últimos Álbuns:</h2>
      <div className="albuns-container">
        {albuns.length > 0 &&
          albuns.map((album) => (
            <div className="album" key={album._id}>
              <img
                src={`${axios.defaults.baseURL}/${album.src}`}
                alt={album.title}
              />
              <p>{album.title}</p>
              <Link className="btn" to={`/albuns/${album._id}`}>
                Expandir
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Home;
