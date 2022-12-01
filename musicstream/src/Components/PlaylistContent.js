import { useState } from 'react'
import { Card } from 'react-bootstrap';
import PlaylistDetails from './PlaylistDetails';

export default function PlaylistContent({playlist, chooseTrack}) {
  const [isShown, setIsShown] = useState(false);

  async function handleAlbumPlay() {
    chooseTrack(playlist.tracks);
  }

  function viewAlbumDetails() {
    setIsShown(!isShown);
  }

  return (
    <Card className="card text-center" style={{ width: '202px', border: "none" }}>
      <Card.Img className="g-0 btn" variant="top" src={playlist.image.url} onClick={handleAlbumPlay} style={{ height: "188px", width: "200px" }} />
      <Card.Body className="d-flex flex-column align-items-center btn" onClick={viewAlbumDetails}>
          {isShown && (
            <PlaylistDetails isDialogOpened={isShown} handleCloseDialog={() => setIsShown(false)} playlist={playlist} chooseTrack={chooseTrack}/>
          )}
        <div className="col-12 text-truncate">{playlist.name}</div>
      </Card.Body>
    </Card>
  )
}
