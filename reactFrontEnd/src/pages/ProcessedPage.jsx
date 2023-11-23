// import { useEffect, useState } from "react"
// const axios = require('axios')

// const ProcessedPage = () => {
//   const [processedData, setProcessedData] = useState([])

//   useEffect(() => {
//     const searchParams = new URLSearchParams(window.location.search)
//     const data = searchParams.get("data")
//     const decodedData = JSON.parse(decodeURIComponent(data))
//     console.log('Processed Data:', decodedData)
//     setProcessedData(decodedData)
//   }, [])

//   return (
//     <div>
//       <h1>Processed Data</h1>
//       <ul>
//         {processedData.map((item, index) => (
//           <li key={index}>
//             <strong>Title:</strong> {item.snippet.title}<br />
//             <strong>Video ID:</strong> {item.id.videoId}<br />
//           </li>
//         ))}
//       </ul>
//     </div>
//   )
// }

// export default ProcessedPage

import { useEffect, useState } from "react"
import axios from "axios"

const ProcessedPage = () => {
  const [processedData, setProcessedData] = useState([])
  const [playlist, setPlaylist] = useState(null)

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const data = searchParams.get("data")
    const decodedData = JSON.parse(decodeURIComponent(data))
    console.log('Processed Data:', decodedData)
    setProcessedData(decodedData)

    // Fetch the playlist details from the backend
    //*incomplete*
    axios.get('http://localhost:3000/api/playlist')
      .then(response => {
        setPlaylist(response.data)
      })
      .catch(error => {
        console.error('Error fetching playlist:', error)
      })
  }, [])

  return (
    <div>
      <h1>Processed Data</h1>
      <ul>
        {processedData.map((item, index) => (
          <li key={index}>
            <strong>Title:</strong> {item.snippet.title}<br />
            <strong>Video ID:</strong> {item.id.videoId}<br />
          </li>
        ))}
      </ul>

      {playlist && (
        <div>
          <h2>YouTube Playlist</h2>
          <p>Playlist Title: {playlist.snippet.title}</p>
          <ul>
            {playlist.items.map((item, index) => (
              <li key={index}>
                <strong>Title:</strong> {item.snippet.title}<br />
                <strong>Video ID:</strong> {item.snippet.resourceId.videoId}<br />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default ProcessedPage
