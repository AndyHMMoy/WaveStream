import { useState, useEffect } from "react"
import SpotifyPlayer from "react-spotify-web-playback"

export default function Player({ accessToken, trackUri, isActive }) {
  const [play, setPlay] = useState(false)
  const [isAlbum, setIsAlbum] = useState(false)

  useEffect(() => {
    if (!accessToken) return;
    if (!trackUri) return;
    setPlay(true)
    if (Array.isArray(trackUri)) {
      setIsAlbum(true)
    } else {
      setIsAlbum(false)
    }
    const timeout = setTimeout(() => {
      isActive(true)
    }, 3000)
    return () => clearTimeout(timeout)
  }, [trackUri, accessToken])

  if (!accessToken) return null
  return (
    <div>
      {!isAlbum ?
        <SpotifyPlayer token={accessToken} showSaveIcon callback={state => {
          if (!state.isPlaying) {setPlay(false);}  if (!state.isActive) {isActive(false)}
        }} play={play} uris={trackUri ? [trackUri] : []} />
      :
        <SpotifyPlayer token={accessToken} showSaveIcon callback={state => {
          if (!state.isPlaying) {setPlay(false);} if (!state.isActive) {isActive(false)}
        }} play={play} uris={trackUri ? trackUri : []} />
      }
    </div>
  )
}