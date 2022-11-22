import { useState, useEffect } from "react"
import SpotifyPlayer from "react-spotify-web-playback"

export default function Player({ accessToken, trackUri }) {
  const [play, setPlay] = useState(false)
  const [isAlbum, setIsAlbum] = useState(false)

  useEffect(() => {
    setPlay(true)
    if (Array.isArray(trackUri)) {
      setIsAlbum(true)
    } else {
      setIsAlbum(false)
    }
  }, [trackUri])

  console.log(trackUri);
  console.log(isAlbum)

  if (!accessToken) return null
  return (
    <div>
      {!isAlbum ?
        <SpotifyPlayer token={accessToken} showSaveIcon callback={state => {
          if (!state.isPlaying) setPlay(false)
        }} play={play} uris={trackUri ? [trackUri] : []} />
      :
        <SpotifyPlayer token={accessToken} showSaveIcon callback={state => {
          if (!state.isPlaying) setPlay(false)
        }} play={play} uris={trackUri ? trackUri : []} />
      }
    </div>
  )
}