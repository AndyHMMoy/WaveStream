import { useState } from 'react'
import { Card } from 'react-bootstrap';
import ArtistDetails from './ArtistDetails';

export default function ArtistSearchResult({ artist, chooseTrack }) {
  const [isShown, setIsShown] = useState(false);

  function viewArtistDetails() {
    setIsShown(!isShown);
  }

  return (
    <Card className="card text-center" style={{ width: '202px', border: "none" }}>
      <Card.Img className="g-0 btn" variant="top" src={artist.artistUrl} style={{ height: "188px", width: "200px" }} />
      <Card.Body className="d-flex flex-column align-items-center btn" onClick={viewArtistDetails}>
        {isShown && (
          <ArtistDetails isDialogOpened={isShown} handleCloseDialog={() => setIsShown(false)} album={album} chooseTrack={chooseTrack}/>
        )}
        <div className="col-12 text-truncate">{artist.name}</div>
      </Card.Body>
    </Card>
  )
}
