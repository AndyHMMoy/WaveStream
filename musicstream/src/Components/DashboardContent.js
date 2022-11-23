import { useState } from 'react';
import { Card } from 'react-bootstrap';
import AlbumDetails from './AlbumDetails';

export default function DashboardContent({ album, chooseTrack }) {
  const [isShown, setIsShown] = useState(false);

  async function handleAlbumPlay() {
    chooseTrack(album.tracks);
  }

  function viewAlbumDetails() {
    setIsShown(!isShown);
  }

  return (
    <Card className="card text-center" style={{ width: '202px', border: "none" }}>
      <Card.Img className="g-0 btn" variant="top" src={album.albumUrl} onClick={handleAlbumPlay} style={{ height: "188px", width: "200px" }} />
      <Card.Body className="d-flex flex-column align-items-center btn" onClick={viewAlbumDetails}>
          {isShown && (
            <AlbumDetails isDialogOpened={isShown} handleCloseDialog={() => setIsShown(false)} album={album} chooseTrack={chooseTrack}/>
          )}
          <div className="col-12 text-truncate">{album.name}</div>
          <div className="col-12 text-truncate text-muted">{album.artist}</div>
      </Card.Body>
    </Card>
  )
}
