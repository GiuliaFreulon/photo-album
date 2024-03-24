import { Link } from "react-router-dom";

import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2>
        <Link to="/">Álbum de Fotos</Link>
      </h2>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/add-album">Adicionar Álbum</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
