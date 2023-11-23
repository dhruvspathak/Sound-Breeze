import { Link } from "react-router-dom"
import "./style.css"

const Header = () => {
  return (
    <div className="header-container">
      <Link to="/" className="header-logo">SoundBreeze</Link>
      <nav className="header-nav">
        <Link to="/ConnectionBtns" className="connect-button">
          Connect your platforms
        </Link>
      </nav>
    </div>
  )
}

export default Header
