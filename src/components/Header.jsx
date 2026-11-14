import { Link } from "react-router-dom";
import logoMobisi from "../assets/logo-mobisi.png";
import logoSimbolo from "../assets/logo-simbolo.png";

export default function Header() {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link className="brand" to="/" aria-label="Mobisi, início">
          <img
            className="brand-symbol"
            src={logoSimbolo}
            alt=""
            aria-hidden="true"
          />
          <img className="brand-wordmark" src={logoMobisi} alt="Mobisi" />
        </Link>
        <div className="profile-chip">
          <span className="profile-avatar" aria-hidden="true">
            V
          </span>
          <span>Vicente Souza</span>
        </div>
      </div>
    </header>
  );
}
