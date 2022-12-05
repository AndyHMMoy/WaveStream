import { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import spotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new spotifyWebApi({
  clientId: '24a3298301624748953767abdf60ec0a'
});

export default function PlaylistDetails({playlist, isDialogOpened, handleCloseDialog, chooseTrack, accessToken}) {

  const format = require('format-duration')

  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth] = useState("lg");

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken])

  const handleClose = () => {
    handleCloseDialog(false);
  };

  const handleRemoveFromPlaylist = (track_uri) => {
    // var track = [{ uri: track_uri}]
    // spotifyApi.removeTracksFromPlaylist(playlist.id, track)
  }

  const handlePlay = (track) => {
    chooseTrack(track)
  }

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
      </DialogTitle>
    );
  }

  BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
  };

  return (
    <div>
      <BootstrapDialog fullWidth={fullWidth} maxWidth={maxWidth} open={isDialogOpened} onClose={handleClose} aria-labelledby="max-width-dialog-title">
        <BootstrapDialogTitle onClose={handleClose}>
          <div className="d-flex flex-row bd-highlight mb-3 align-items-center">
            <img src={playlist.image.url} className="img-thumbnail me-2" alt="" style={{ height: "100px", width: "100px" }} />
            <div className="ms-2">
              <div>{playlist.name}</div>
            </div>
          </div>
        </BootstrapDialogTitle>
        <DialogContent dividers>
          {
            playlist.tracks.map((track) => {
              return (
                <div className="m-2" style={{ cursor: "pointer" }} onClick={() => handlePlay(track)} key={track.uri}>
                  <div className="row">
                      <div className="ml-3 col-9">
                        <div>{track.name}</div>
                        <div className="text-muted">{track.artist}</div>
                      </div>
                      <div className="col-3 align-items-center">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <Button className="me-3" variant="outlined" onClick={() => handleRemoveFromPlaylist(track.uri)}>Remove from playlist</Button>
                          </div>
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
  )
}
