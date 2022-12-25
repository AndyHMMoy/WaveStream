import { useContext, useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import RepeatIcon from '@mui/icons-material/Repeat';
import RepeatOneIcon from '@mui/icons-material/RepeatOne';
import React from 'react';
import '../Stylesheets/Header.css';
import SpotifyAccessContext from '../Contexts/SpotifyAccessContext';
import PlaybackSettingsContext from '../Contexts/PlaybackSettingsContext';
import SearchTermContext from '../Contexts/SearchTermContext';
import useSearchResult from '../Hooks/useSearchResult';

export default function Header({ onTrackQuery, onArtistQuery, onAlbumQuery, onSetPlaylistPage }) { 

    const {accessToken, username, spotifyApi} = useContext(SpotifyAccessContext);
    const {searchTerm, setSearchTerm} = useContext(SearchTermContext);
    const {isShuffle, setIsShuffle, repeatStatus, setRepeatStatus} = useContext(PlaybackSettingsContext);

    const searchResults = useSearchResult(searchTerm, setSearchTerm, onSetPlaylistPage, spotifyApi, accessToken);

    // Create the authorization URL
    const authorizeURL = "https://accounts.spotify.com/en/authorize?client_id=24a3298301624748953767abdf60ec0a&response_type=code&redirect_uri=https://wave-stream.vercel.app&scope=streaming%20user-read-email%20user-top-read%20playlist-read-private%20playlist-read-collaborative%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";

    const backToHome = () => {
      setSearchTerm("")
      onSetPlaylistPage(false)
    }

    const handleRepeat = () => {
      if (repeatStatus === "off") {
        setRepeatStatus("context");
      } else if (repeatStatus === "context") {
        setRepeatStatus("track");
      } else {
        setRepeatStatus("off");
      }
    }

    useEffect(() => {
      onTrackQuery(searchResults[0]);
      onArtistQuery(searchResults[1]);
      onAlbumQuery(searchResults[2]);
    },[accessToken, searchTerm, searchResults])

    return (
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between' }}>
            <AppBar position="static">
                <Toolbar>
                    <div className='container-fluid'>
                        <div className="d-flex justify-content-between">
                            {/* App Name */}
                            <div className="align-self-center">
                              {/* Refresh Token Button */} 
                              <Typography variant="h6" component="small" className="me-3 align-middle" style={{ cursor: "pointer" }} onClick={() => backToHome()}>WaveStream</Typography>
                              <ToggleButton value="shuffle" selected={isShuffle} onChange={() => {setIsShuffle(!isShuffle)}}><ShuffleIcon /></ToggleButton>
                              <ToggleButton value="repeat" selected = {repeatStatus === "context" || repeatStatus === "track" ? true : false} onChange={() => {handleRepeat()}}>{repeatStatus !== "track" ? <RepeatIcon /> : <RepeatOneIcon />}</ToggleButton>
                            </div>
                            {/* Search Bar */}
                            <div className="align-self-center">
                              <TextField hiddenLabel id="filled-hidden-label-small" color="info" placeholder="Search for a song, artist or album" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} variant="standard" size="small" sx={{ minWidth: 500, input: { color: 'white' } }} />
                            </div>
                            {/* User */}
                            <div className="align-self-center">
                              {/* Refresh Token Button */}
                              <Button color="inherit" href={authorizeURL}>Refresh Token</Button> 
                              {/* View Playlist Button */}
                              <Button color="inherit" className="me-3" onClick={() => onSetPlaylistPage(true)}>View Playlists</Button>
                              <Typography variant="overline">{username}</Typography> 
                            </div>
                        </div>
                    </div>
                </Toolbar>
            </AppBar> 
       </Box>
    );
}