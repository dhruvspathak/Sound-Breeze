import { useEffect, useState } from "react"
import axios from "axios"
import './ytPg.css'

const Playlist = () => {
  const [playlist, setPlaylist] = useState(null)
  const [showLoginButton, setShowLoginButton] = useState(true)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get("code")

    if (code) {
      axios
        .post("http://localhost:3000/api/googleCallback", { code })
        .then((response) => {
          console.log("Response from backend:", response.data)
          setPlaylist(response.data)
        })
        .catch((error) => {
          console.error("Error fetching playlist:", error.message)
        })
    }
  }, [])

  const clickHandler = () => {
    setShowLoginButton(false)
    window.location.href = "http://localhost:3000/api/auth/youtube"
  }

  return (
    <div className="container">
      {showLoginButton ? (
        <button className="login-button" onClick={clickHandler}>
          Login to YouTube
        </button>
      ) : (
        <div className="playlist-container">
          <h2 className="playlist-title">My Playlist</h2>
          {playlist ? (
            <ul className="playlist-items">
              {playlist.items.map((item) => (
                <li key={item.id} className="playlist-item">
                  {item.snippet.title}
                </li>
              ))}
            </ul>
          ) : (
            <div className="loading">Loading...</div>
          )}
        </div>
      )}
    </div>
  )
}

export default Playlist
