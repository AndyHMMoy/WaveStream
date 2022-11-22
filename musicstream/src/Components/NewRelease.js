import React from 'react';
import { Card } from 'react-bootstrap';

export default function NewRelease({ album, chooseTrack }) {

  async function handleAlbumPlay() {
    chooseTrack(album.tracks);
  }

  return (
    <Card style={{ width: '202px', border: "none" }}>
      <Card.Img variant="top" src={album.albumUrl} onClick={handleAlbumPlay} style={{ height: "200px", width: "200px" }} />
      <Card.Body>
        <div className="ml-3">
          <div>{album.name}</div>
          <div className="text-muted">{album.artist}</div>
        </div>
      </Card.Body>
    </Card>
  )
}
