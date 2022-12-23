import { useState, useEffect } from 'react'
import { Card } from 'react-bootstrap';
import Dialog from '@mui/material/Dialog';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import spotifyWebApi from 'spotify-web-api-node';
import AddToPlaylistButton from './AddToPlaylistButton';

const spotifyApi = new spotifyWebApi({
  clientId: '24a3298301624748953767abdf60ec0a'
});

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
      </IconButton>
    ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function ExpandablePlaylistTile({playlist, chooseTrack}) {

  const format = require('format-duration')

  const [open, setOpen] = useState(false);

  const handleAlbumPlay = () => {
    chooseTrack(playlist.tracks);
  }

  const handleClickOpen = () => {
    if (open) return;
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    // console.log(open)
  }, [open])

  const handlePlay = (track) => {
    chooseTrack(track)
  }

  return (
    <Card className="card text-center" style={{ width: '202px', border: "none" }}>
      <Card.Img id="albumArt" className="g-0 btn" variant="top" src={playlist.image.url} onClick={handleAlbumPlay} style={{ height: "188px", width: "200px" }} />
      <Card.Body className="d-flex flex-column align-items-center btn" onClick={handleClickOpen}>
        <div>
          <BootstrapDialog fullWidth={true} maxWidth={"lg"} open={open} onClose={handleClose} aria-labelledby="max-width-dialog-title">
            <BootstrapDialogTitle id="max-width-dialog-title" onClose={handleClose}>
              <div className="d-flex flex-row bd-highlight mb-3 align-items-center">
                <img id="albumArt" src={playlist.image.url} className="me-2" alt="" style={{ height: "100px", width: "100px" }} />
                <div className="ms-2">
                  <div>{playlist.name}</div>
                </div>
              </div>
            </BootstrapDialogTitle>
            <DialogContent dividers sx={{ minHeight: '50vh', maxHeight: '50vh' }}>
              {
                playlist.tracks.map((track) => {
                  return (
                    <div className="m-2" style={{ cursor: "pointer" }}  key={track.uri}>
                      <div className="row">
                          <div className="ml-3 col-11" onClick={() => handlePlay(track)}>
                            <div>{track.name}</div>
                            <div className="text-muted">{track.artist}</div>
                          </div>
                          <div className="col-1 d-flex align-items-center">
                            <div className="d-flex justify-content-between align-items-center">
                                {/* <AddToPlaylistButton className="me-3" variant="outlined" />
                                <Button className="me-3" variant="outlined">Remove from playlist</Button> */}
                              <Typography variant="button">{format(track.duration)}</Typography>
                            </div>
                          </div>
                      </div>
                    </div>
                  )
                })
              }
            </DialogContent>
          </BootstrapDialog>
        </div>
        <div className="col-12 text-truncate">{playlist.name}</div>
      </Card.Body>
    </Card>
  )
}
