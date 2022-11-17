import Button from '@mui/material/Button';
import { Container } from '@mui/system';
import { useEffect, useState } from 'react';
import Header from '../Fragments/Header';
import Dashboard from './Dashboard';
import Backdrop from '@mui/material/Backdrop';

const code = new URLSearchParams(window.location.search).get("code")
const authorizeURL = "https://accounts.spotify.com/en/authorize?client_id=24a3298301624748953767abdf60ec0a&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";

function Home() {

  return(
    <div>
      {code ? 
          <Dashboard code = {code} /> : 
        <Backdrop open sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} >
          <Button color="inherit" href={authorizeURL}>Login to Spotify</Button>
        </Backdrop>
      }
    </div>
  );

}

export default Home;