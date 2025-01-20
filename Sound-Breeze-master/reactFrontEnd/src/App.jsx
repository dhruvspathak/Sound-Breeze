import Home from './pages/Home'
import SpotifyLoginPage from './pages/SpotifyLoginPage'
import YoutubeLoginPage from './pages/YoutubeLoginPage'
import ConnectionBtns from './pages/ConnectionBtns'
import ProcessedPage from './pages/ProcessedPage'
import Layout from './components/Layout'
import {BrowserRouter, Routes, Route} from 'react-router-dom'

function App() {

  return (
    <BrowserRouter>
      <Routes>
      <Route element={<Layout/>}>
        <Route path='/' element={<Home/>} />
        <Route path='/SpotifyLoginPage/*' element={<SpotifyLoginPage/>} />
        <Route path='/YoutubeLoginPage/*' element={<YoutubeLoginPage/>} />
        <Route path="/ConnectionBtns/*" element={<ConnectionBtns/>} />
        <Route path='/ProcessedPage/*' element= {<ProcessedPage/>} />
      </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
