import React from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import "../Stylesheets/Login.css";

const ColorButton = styled(Button)({
  color: '#ffffff',
  backgroundColor: "#00d95f",
  '&:hover': {
    backgroundColor: "#0ead54",
    color: '#ffffff'
  },
  borderRadius: 15
});

export default function Login({ authorizeURL }) {
  return ( 
    <Grid container spacing={0} direction="column" alignItems="center" justifyContent="center" style={{ minHeight: '100vh' }}>
      <Box className="loginBox" sx={{ minWidth: '15vw', minHeight: '20vh', backgroundColor: '#ffffff', borderRadius: '15px' }}>
        <div className="d-flex flex-column align-items-center mt-4">
          <h1 className="title">WaveStream</h1>
        </div>
        <div className="d-flex justify-content-center py-4">
          <ColorButton variant="contained" href={authorizeURL} startIcon={<img src={require("../Assets/Spotify-icon.png")} className="spotifyIcon" alt="spotifyIcon" width="25" height="25" />}>Login with Spotify</ColorButton>
        </div>
        <div className="d-flex justify-content-center">
          <p className="loginText mb-2">Note this app requires spotify. </p>
        </div>
      </Box>
    </Grid>
  )
}
