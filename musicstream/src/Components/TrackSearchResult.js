import React from "react"

export default function TrackSearchResult({ track, chooseTrack }) {
  function handlePlay() {
    chooseTrack(track)
  }

  return (
    <div className="d-flex m-2 align-items-center">
      <div className="d-inline-flex" style={{ cursor: "pointer" }} onClick={handlePlay}>
        <img id="albumArt" src={track.albumUrl} alt = {track.albumUrl} style={{ height: "64px", width: "64px" }} />
        <div className="ms-3">
          <div>{track.title}</div>
          <div className="text-muted">{track.artist}</div>
        </div>
      </div>
    </div>
  )
}