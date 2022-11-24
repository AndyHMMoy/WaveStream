import Button from '@mui/material/Button';
import { useState } from 'react';
import Header from '../Fragments/Header';
import Dashboard from './Dashboard';
import useAuth from '../Hooks/useAuth';
import React from 'react';
import Backdrop from '@mui/material/Backdrop';

const code = new URLSearchParams(window.location.search).get("code")
const authorizeURL = "https://accounts.spotify.com/en/authorize?client_id=24a3298301624748953767abdf60ec0a&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-top-read%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";

function Home() {

  const accessToken = useAuth(code);
  const [trackSearchResults, setTrackSearchResults] = useState([]);
  const [artistSearchResults, setArtistSearchResults] = useState([]);
  const [albumSearchResults, setAlbumSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  return(
    <div>
      {code ? 
        <>
        <Header accessToken = {accessToken} onTrackQuery = {setTrackSearchResults} onArtistQuery = {setArtistSearchResults} onAlbumQuery = {setAlbumSearchResults} termChange = {setSearchTerm} />
        <Dashboard accessToken = {accessToken} trackQuery = {trackSearchResults} artistQuery = {artistSearchResults} albumQuery = {albumSearchResults} term = {searchTerm} /> 
        </>: 
        <Backdrop open sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} >
          <Button color="inherit" href={authorizeURL}>Login to Spotify</Button>
        </Backdrop>
      }
    </div>
  );

}

export default Home;