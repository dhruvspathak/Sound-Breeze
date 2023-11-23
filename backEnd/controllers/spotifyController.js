const axios = require('axios')
require('dotenv').config()
const querystring = require('querystring')
const REDIRECT_URI = 'http://localhost:3000/api/callback'


const redirFunction= async(req,res)=>{
  const SCOPES = 'user-read-private user-read-email'
  let state = generateRandomString(16)
  const authorizeUrl = 'https://accounts.spotify.com/authorize?' + querystring.stringify({
    response_type: 'code',
    client_id: process.env.clientIdSpotify,
    scope: SCOPES,
    redirect_uri: REDIRECT_URI,
    state: state,
    show_dialog: true,
  })
  res.redirect(authorizeUrl)
  console.log(`a user logged in`)
}


const refreshToken = (req, res) => {
  var refresh_token = req.query.refresh_token
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer.from(process.env.clientIdSpotify + ':' + process.env.clientSecretSpotify).toString('base64')),
               'Content-Type': 'application/x-www-form-urlencoded'
              },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
      client_id: process.env.clientIdSpotify
    },
    json: true
  }

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token
      res.send({
        'access_token': access_token
      })
    }
  })
}


function generateRandomString(length) {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}


const callBack = async (req, res) => {
  let state = req.query.state || null
  let code = req.query.code || null

  if (state === null) {
    res.redirect('/#' + querystring.stringify({ error: 'state_mismatch' }))
  } else {
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      method: 'POST',
      data: querystring.stringify({
        code: code,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
        client_id: process.env.clientIdSpotify
      }),
      headers: {
        'Authorization': 'Basic ' + (new Buffer.from(process.env.clientIdSpotify + ':' + process.env.clientSecretSpotify).toString('base64')),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    }

    try {
      const response = await axios(authOptions)
      const accessToken = response.data.access_token
      res.redirect('http://localhost:5173/SpotifyLoginPage?access_token=' + accessToken)
      //res.redirect('http://localhost:5173/ConnectionBtns?access_token=' + accessToken)
    } catch (error) {
      console.error(error)
    }
  }
}


const getPlaylists = async (accessToken) => {
  try {
    const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

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


module.exports = {
  redirFunction,
  callBack,
  refreshToken,
  getPlaylists,
  getPlaylistSongs
}
