import { Link, Routes, Route } from "react-router-dom"
import SpotifyLoginPage from "./SpotifyLoginPage"
import YoutubeLoginPage from "./YoutubeLoginPage"
import "./conBtn.css"

const ConnectionBtns = () => {
  return (
    <div className="container">
      <nav>
        <Link to="/SpotifyLoginPage" className="login-button">Connect Spotify</Link>
        <Link to="/YoutubeLoginPage" className="login-button">Connect Youtube</Link>
      </nav>
      <Routes>
        <Route path="/SpotifyLoginPage" element={<SpotifyLoginPage />} />
        <Route path="/YoutubeLoginPage" element={<YoutubeLoginPage />} />
      </Routes>
    </div>
  )
}

export default ConnectionBtns