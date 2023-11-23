import './spotPg.css'
import { useEffect, useState } from "react"
import axios from "axios"

const SpotifyLoginPage = () => {
  const urlParams = new URLSearchParams(window.location.search)

  const [accessToken, setAccessToken] = useState(urlParams.get("access_token"))
  const [playlists, setPlaylists] = useState([])
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)
  const [songs, setSongs] = useState([])
  const [selectedSongs, setSelectedSongs] = useState({})

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const accessTokenParam = urlParams.get("access_token")
    if (accessTokenParam) {
      setAccessToken(accessTokenParam)
    }
  }, [])

  useEffect(() => {
    if (accessToken) {
      getPlaylists(accessToken).then((playlists) => setPlaylists(playlists))
    }
  }, [accessToken])

  const getPlaylists = async (accessToken) => {
    try {
      const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
  
      return response.data.items
    } catch (error) {
      console.error(error)
      return []
    }
  }
  
  const getPlaylistSongs = async (accessToken, playlistId) => {
    try {
      const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
  
      return response.data.items
    } catch (error) {
      console.error(error)
      return []
    }
  }

  
  const handlePlaylistChange = async (e) => {
    const playlistId = e.target.value
    setSelectedPlaylist(playlistId)
    
    if (playlistId) {
      const songs = await getPlaylistSongs(accessToken, playlistId)
      setSongs(songs)

      const defaultSelectedSongs = {}
      songs.forEach((song) => {
        defaultSelectedSongs[song.track.id] = true
      })
      setSelectedSongs(defaultSelectedSongs)
    } else {
      setSongs([])
      setSelectedSongs({})
    }
  }
  
  const handleSongCheckboxChange = (e, songId) => {
    setSelectedSongs((prevSelectedSongs) => {
      return { ...prevSelectedSongs, [songId]: e.target.checked }
    })
  }
  
  
  const handleLogin = () => {
    window.location.href = "http://localhost:3000/api/login"
  }
  
  
  const conversionFunction = async () => {
    try {
      const selectedSongsArray = Object.keys(selectedSongs).filter(songName => selectedSongs[songName])
  
      if (selectedSongsArray.length === 0) {
        alert("Please select at least one song.")
        return []
      }
  
      const songDetailsPromises = selectedSongsArray.map(async songId => {
        const response = await axios.get(`https://api.spotify.com/v1/tracks/${songId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        return response.data
      })
  
      const songDetails = await Promise.all(songDetailsPromises)
  
      const songsInfoArray = songDetails.map(song => {
        return {
          name: song.name,
          artist: song.artists.map(artist => artist.name).join(', '),
        }
      })

      const response = await axios.post('http://localhost:3000/api/convert', {
        songs: songsInfoArray,
      })
      console.log(songsInfoArray)

      const processedData = response.data.searchResults
      window.location.href = `http://localhost:5173/ProcessedPage?data=${encodeURIComponent(JSON.stringify(processedData))}`
    } catch (error) {
      console.error(error)
      return [] 
    }
  }

  return (
    <div className="container">
      {!accessToken && (
        <button className="login-button" onClick={handleLogin}>
          Login with Spotify
        </button>
      )}
      {accessToken && (
        <div className="playlist-container">
          <div className="select-wrapper">
            <label className="select-label">Select Playlist:</label>
            <select className="select-dropdown" value={selectedPlaylist} onChange={handlePlaylistChange}>
              <option value={null}>Select a playlist</option>
              {playlists.map((playlist) => (
                <option key={playlist.id} value={playlist.id}>
                  {playlist.name}
                </option>
              ))}
            </select>
          </div>
          {selectedPlaylist && (
            <div className="songs-list-container">
              <ul className="songs-list">
                {songs.map((song) => (
                  <li key={song.track.id} className="song-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedSongs[song.track.id] || false}
                        onChange={(e) => handleSongCheckboxChange(e, song.track.id)}
                      />
                      {song.track.name}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}  
        </div>
      )}
      {selectedPlaylist && (
        <button onClick={conversionFunction} className="start-conversion">
          START CONVERSION
        </button>
      )}
    </div>
  )
}

export default SpotifyLoginPage
