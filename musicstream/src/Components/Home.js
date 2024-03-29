import Button from '@mui/material/Button';
import { useState } from 'react';
import Header from '../Fragments/Header';
import Footer from '../Fragments/Footer';
import Dashboard from './Dashboard';
import useAuth from '../Hooks/useAuth';
import useInitUserData from '../Hooks/useInitUserData';
import React from 'react';
import UserDataContext from '../Contexts/UserDataContext';
import SearchTermContext from '../Contexts/SearchTermContext';
import SpotifyAccessContext from '../Contexts/SpotifyAccessContext';
import PlaybackSettingsContext from '../Contexts/PlaybackSettingsContext';
import '../Stylesheets/Home.css';
import Login from './Login';

const code = new URLSearchParams(window.location.search).get("code")
// Development URL
// const authorizeURL = "https://accounts.spotify.com/en/authorize?client_id=24a3298301624748953767abdf60ec0a&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-top-read%20playlist-read-private%20playlist-read-collaborative%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";
// Production URL
const authorizeURL = "https://accounts.spotify.com/en/authorize?client_id=24a3298301624748953767abdf60ec0a&response_type=code&redirect_uri=https://wave-stream.vercel.app&scope=streaming%20user-read-email%20user-top-read%20playlist-read-private%20playlist-read-collaborative%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";

function Home() {

  const accessToken = useAuth(code);
  const [trackSearchResults, setTrackSearchResults] = useState([]);
  const [artistSearchResults, setArtistSearchResults] = useState([]);
  const [albumSearchResults, setAlbumSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPlaylistPage, setIsPlaylistPage] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isAlbum, setIsAlbum] = useState(false);
  const [isActiveStatus, setIsActiveStatus] = useState(false);
  const [playingTrack, setPlayingTrack] = useState();
  const [playingTracks, setPlayingTracks] = useState([]);
  const [repeatStatus, setRepeatStatus] = useState('off');

  const data = useInitUserData(accessToken);

  const username = data[3]
  const spotifyApi = data[4]

  return(
    <div>
      {code ? 
        <>  
          <SpotifyAccessContext.Provider value = {{accessToken, username, spotifyApi}}>
            <SearchTermContext.Provider value = {{searchTerm, setSearchTerm}}>
              <PlaybackSettingsContext.Provider value = {{isShuffle, setIsShuffle, repeatStatus, setRepeatStatus}}>
                <Header onTrackQuery = {setTrackSearchResults} onArtistQuery = {setArtistSearchResults} onAlbumQuery = {setAlbumSearchResults} onSetPlaylistPage = {setIsPlaylistPage} />
                <UserDataContext.Provider value = {data}>
                  <Dashboard trackQuery = {trackSearchResults} artistQuery = {artistSearchResults} albumQuery = {albumSearchResults} 
                            playlistPageStatus = {isPlaylistPage} 
                            onSetPlaylistPage = {setIsPlaylistPage} setPlayingTrack = {setPlayingTrack} setPlayingTracks = {setPlayingTracks} setIsAlbum = {setIsAlbum}
                            isActiveStatus = {isActiveStatus} />
                </UserDataContext.Provider>
                <Footer isAlbum = {isAlbum} playingTrack = {playingTrack} playingTracks = {playingTracks} setActiveStatus = {setIsActiveStatus} />
              </PlaybackSettingsContext.Provider>
            </SearchTermContext.Provider>
          </SpotifyAccessContext.Provider>
        </>: 
        <Login authorizeURL={authorizeURL} />
      }
    </div>
  );

}

export default Home;