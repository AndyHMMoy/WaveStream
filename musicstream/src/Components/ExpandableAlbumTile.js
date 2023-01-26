import { useState, useEffect } from 'react';
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

function capitalizeFirstLetter(string) {
  return string.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

export default function ExpandableAlbumTile({ album, chooseTrack }) {

  const format = require('format-duration')

  const [open, setOpen] = useState(false);

  const handleAlbumPlay = () => {
    chooseTrack(album.tracks);
  }

  const handleClickOpen = () => {
    if (open) return;
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    // console.log(album)
  }, [open])

  const handlePlay = (track) => {
    chooseTrack(track)
  }

  return (
    <Card className="card text-center" style={{ width: '202px', border: "none" }}>
      <Card.Img id="albumArt" className="g-0 btn" variant="top" src={album.albumUrl} onClick={handleAlbumPlay} style={{ height: "188px", width: "200px" }} />
      <Card.Body className="d-flex flex-column align-items-center btn" onClick={handleClickOpen}>
        <div>
          <BootstrapDialog fullWidth={true} maxWidth={"lg"} open={open} onClose={handleClose} aria-labelledby="max-width-dialog-title">
            <BootstrapDialogTitle id="max-width-dialog-title" onClose={handleClose}>
              <div className="d-flex flex-row bd-highlight mb-3 align-items-center">
                <img id="albumArt" src={album.albumUrl} className="me-2" alt="" style={{ height: "100px", width: "100px" }} />
                <div className="ms-2">
                  <Typography variant="h6">{album.name}</Typography>
                  <Typography variant="subtitle1" className="mb-1">{capitalizeFirstLetter(album.type) + " • " + album.release_date + " • " + album.total_tracks + (album.total_tracks === 1 ? " song" : " songs")}</Typography>
                  <div><Button variant="contained" size="medium" onClick={() => chooseTrack(album.tracks)}>Play Album</Button></div>
                </div>
              </div>
            </BootstrapDialogTitle>
            <DialogContent dividers sx={{ minHeight: '50vh', maxHeight: '50vh' }}>
              {
                album.tracks.map((track) => {
                  return (
                    <div className="m-2" style={{ cursor: "pointer" }}  key={track.uri}>
                      <div className="row">
                          <div className="ml-3 col-11" onClick={() => handlePlay(track)}>
                            <div>{track.name}</div>
                            <div className="text-muted">{track.artist}</div>
                          </div>
                          <div className="col-1 d-flex align-items-center">
                            <div className="d-flex justify-content-between align-items-center">
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
        <div className="col-12 text-truncate">{album.name}</div>
        <div className="col-12 text-truncate text-muted">{album.artist}</div>
      </Card.Body>
    </Card>
  )
}
