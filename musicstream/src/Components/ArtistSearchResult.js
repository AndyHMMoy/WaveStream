import React from 'react'

export default function ArtistSearchResult({ artist, chooseTrack }) {
    return (
        <div className="d-flex m-2 align-items-center" style={{ cursor: "pointer" }}>
          <img src={artist.artistUrl ? artist.artistUrl : null} style={{ height: "64px", width: "64px" }} />
          <div className="ms-3">
            <div>{artist.name}</div>
          </div>
        </div>
      )
}
