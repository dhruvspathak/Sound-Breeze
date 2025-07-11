const express = require('express')
const router = express.Router()
const spotifyController = require('../controllers/spotifyController')
const youtubeController= require('../controllers/youtubeController')

router.get('/login', spotifyController.redirFunction)
router.get('/callback', spotifyController.callBack)
router.get('/refresh-token', spotifyController.refreshToken)

router.get('/getPlaylists', (req, res) => {
    const accessToken = req.headers.authorization.split(' ')[1]
    res.set({
      'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self';",
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Content-Type': 'application/json'
    })
    spotifyController.getPlaylists(accessToken).then((playlists) => res.json(playlists))
  })
router.get('/getPlaylistSongs/:playlistId', (req, res) => {
   const accessToken = req.headers.authorization.split(' ')[1]
   const playlistId = req.params.playlistId
   spotifyController.getPlaylistSongs(accessToken, playlistId).then((songs) => res.json(songs))
 })
 
  
router.get('/auth/youtube', youtubeController.googleAuth) //.get (previous stable version)
router.get('/googleCallback', youtubeController.googleCallback)

router.post('/convert', async (req, res) => {
  const { songs } = req.body;

  if (!Array.isArray(songs) || songs.length === 0) {
    return res.status(400).json({ error: "Invalid data" })
  }

  try {
    const songsInfoArray = songs

    const searchResults = await youtubeController.youtubeSearch(songsInfoArray)

    res.json({ searchResults })
  } catch (error) {
    console.error('An error occurred:', error.message)
    res.status(500).json({ error: "Internal server error" });
  }
})

module.exports = router
