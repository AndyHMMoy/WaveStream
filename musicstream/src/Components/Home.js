import Button from '@mui/material/Button';
import { useState } from 'react';
import Header from '../Fragments/Header';
import Dashboard from './Dashboard';
import useAuth from '../Hooks/useAuth';
import useInitUserData from '../Hooks/useInitUserData';
import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import UserDataContext from '../Contexts/UserDataContext';
import SearchTermContext from '../Contexts/SearchTermContext';
import SpotifyAccessContext from '../Contexts/SpotifyAccessContext';
import PlaybackSettingsContext from '../Contexts/PlaybackSettingsContext';

const code = new URLSearchParams(window.location.search).get("code")
const authorizeURL = "https://accounts.spotify.com/en/authorize?client_id=24a3298301624748953767abdf60ec0a&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-top-read%20playlist-read-private%20playlist-read-collaborative%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";

function Home() {

  const accessToken = useAuth(code);
  const [trackSearchResults, setTrackSearchResults] = useState([]);
  const [artistSearchResults, setArtistSearchResults] = useState([]);
  const [albumSearchResults, setAlbumSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPlaylistPage, setIsPlaylistPage] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatStatus, setRepeatStatus] = useState('off');

  const data = useInitUserData(accessToken);

  const username = data[3]
  const spotifyApi = data[4]

  return(
    <div>
      {code ? 
        <>  
          <SpotifyAccessContext.Provider value = {{accessToken, username, spotifyApi}}>
            <UserDataContext.Provider value = {data}>
              <SearchTermContext.Provider value = {searchTerm}>
                <PlaybackSettingsContext.Provider value = {{isShuffle, setIsShuffle, repeatStatus, setRepeatStatus}}>
                  <Header onTrackQuery = {setTrackSearchResults} onArtistQuery = {setArtistSearchResults} onAlbumQuery = {setAlbumSearchResults} onSetPlaylistPage = {setIsPlaylistPage} termChange = {setSearchTerm} />
                  <Dashboard trackQuery = {trackSearchResults} artistQuery = {artistSearchResults} albumQuery = {albumSearchResults} playlistPageStatus = {isPlaylistPage} onSetPlaylistPage = {setIsPlaylistPage} term = {searchTerm} />
                </PlaybackSettingsContext.Provider>
              </SearchTermContext.Provider>
            </UserDataContext.Provider>
          </SpotifyAccessContext.Provider>
        </>: 
        <Backdrop open sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} >
          <Button variant="outlined" href={authorizeURL}>Login to Spotify</Button>
        </Backdrop>
      }
    </div>
  );

}

export default Home;