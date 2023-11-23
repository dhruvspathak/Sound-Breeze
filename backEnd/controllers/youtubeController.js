const axios = require('axios')
const querystring = require('querystring')
const { google } = require('googleapis')
const { log } = require('console')
require('dotenv').config()
const keyFilePath= 'C:/Users/patha/Desktop/minorProject/minorproject-390513-a9bdd8e60fc0.json'

const youtubeSearch = async (songInfoArray) => {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: keyFilePath,
      scopes: 'https://www.googleapis.com/auth/youtube.readonly',
    })

    const authClient = await auth.getClient()
    const youtube = google.youtube({
      version: 'v3',
      auth: authClient,
    })

    const searchResults = []

    for (const songInfo of songInfoArray) {
      const { name: songName } = songInfo

      const response = await youtube.search.list({
        part: 'snippet',
        q: songName,
      });

      if (response.data.items.length > 0) {
        searchResults.push(response.data.items[0])
      }
    }
    
    return(searchResults)
  } catch (error) {
    console.error('An error occurred:', error.message)
    return []
  }
}

const youtubeCreatePL = async (req, res) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: keyFilePath, 
    //scopes: 'https://www.googleapis.com/auth/youtube.force-ssl',
    scope: 'https://www.googleapis.com/youtube/v3/playlists'
  })
  const authClient = await auth.getClient()
  const youtube = google.youtube({
    version: 'v3',
    auth: authClient,
  })

  try {
    const playlistTitle = 'spotify converted playlist'
    const response = await youtube.playlists.insert({
      part: 'snippet',
      requestBody: {
        snippet: {
          title: playlistTitle,
        },
      },
    });

    const playlist = response.data
    console.log(playlist)
    res.status(200).json(playlist)
    console.log('Displayed the YouTube playlist')

    for (const item of processedData) {
      const videoId = item.id.videoId
      await youtube.playlistItems.insert({
        part: 'snippet',
        requestBody: {
          snippet: {
            playlistId: playlist.id,
            resourceId: {
              kind: 'youtube#video',
              videoId: videoId,
            },
          },
        },
      })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred while creating the playlist.' })
  }
}


const redirectUri = 'http://localhost:3000/api/googleCallback'

const googleAuth= (req,res)=>{
  const authorizeUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
  const queryParams = querystring.stringify({
    response_type: 'code',
    client_id: process.env.clientIdYoutube,
    scope: 'https://www.googleapis.com/auth/youtube.readonly',
    redirect_uri: redirectUri,
  })

  res.redirect(`${authorizeUrl}?${queryParams}`)
}

const googleCallback= async(req,res)=>{
  let {code}= req.query
  console.log(`code: ${code}`)
  const tokenUrl = 'https://oauth2.googleapis.com/token'
  const tokenParams = querystring.stringify({
    code,
    client_id: process.env.clientIdYoutube,
    client_secret: process.env.clientSecretYoutube,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  })

  try {
    const response = await axios.post(tokenUrl, tokenParams, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    const accessToken = response.data.access_token

    res.redirect('http://localhost:5173/YoutubeLoginPage?accessToken=' + accessToken)

  } catch (error) {
    console.error('callback error', error.message)
    res.status(error.response ? error.response.status : 500).json({ error: 'callback error ' })
  }
}

module.exports={
  googleAuth,
  googleCallback,
  youtubeSearch,
  youtubeCreatePL
}
