import { useState } from 'react'
import Dialog from '@mui/material/Dialog';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export default function AlbumDetails({album, isDialogOpened, handleCloseDialog, chooseTrack}) {

  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth] = useState("lg");

  const handleClose = () => {
    handleCloseDialog(false);
  };

  function handlePlay(track) {
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
        {onClose ? (
          <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}>
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

  return (
    <div>
      <BootstrapDialog fullWidth={fullWidth} maxWidth={maxWidth} open={isDialogOpened} onClose={handleClose} aria-labelledby="max-width-dialog-title">
        <BootstrapDialogTitle>
          <div className="d-flex flex-row bd-highlight mb-3 align-items-center">
            <img src={album.albumUrl} className="img-thumbnail me-2" alt="" style={{ height: "100px", width: "100px" }} />
            {album.name}
          </div>
        </BootstrapDialogTitle>
        <DialogContent dividers>
          {
            album.tracks.map((track, index) => {
              return (
                <div className="d-flex m-2 align-items-center" style={{ cursor: "pointer" }} onClick={() => handlePlay(track)}>
                  <div className="ml-3">
                    <div>{track.name}</div>
                    <div className="text-muted">{track.artist}</div>
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
