import logo from "../../logo.png";
import styles from "./Header.module.scss";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header>
      <div className={styles.logo}>
        <Link to='/'>
          <img src={logo} alt='logo' />
          <span>Crypto ARS</span>
        </Link>
      </div>
      <nav>
        <ul>
          <li>
            <Link to={`/`}>Inicio</Link>
          </li>
          <li>
            <Link to={`/mint`}>Cobrar</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
