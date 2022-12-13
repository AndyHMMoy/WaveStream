import { useState, useEffect } from "react"
import SpotifyPlayer from "react-spotify-web-playback"

export default function Player({ accessToken, track, isActive }) {
  const [play, setPlay] = useState(false);

  useEffect(() => {
    if (!accessToken) return;
    if (!track) return;
    setPlay(true)
  }, [track, accessToken])

  if (!accessToken) return null
  return (
    <div>
      <SpotifyPlayer token={accessToken}  callback={state => {
          if (!state.isPlaying) {
            setPlay(false);
          } 
          if (!state.isActive) {
            isActive(false);
          } else {
            isActive(true);
          }
      }} play={play} uris={track?.uri ? [track?.uri] : Array.isArray(track) ? track : []} />
    </div>
  )
}