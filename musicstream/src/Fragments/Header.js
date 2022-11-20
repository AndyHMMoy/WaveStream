import { createContext, useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import spotifyWebApi from 'spotify-web-api-node';
import React from 'react';
import '../Stylesheets/Header.css';

const spotifyApi = new spotifyWebApi({
    clientId: '24a3298301624748953767abdf60ec0a'
});

export default function Header({ accessToken, onQuery, termChange }) { 

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    // Create the authorization URL
    var authorizeURL = "https://accounts.spotify.com/en/authorize?client_id=24a3298301624748953767abdf60ec0a&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";

    useEffect(() => {
      if (!accessToken) return;
      spotifyApi.setAccessToken(accessToken)
    }, [accessToken])

    useEffect(() => {
      termChange(searchTerm);
      if (!searchTerm) return setSearchResults([])
      if (!accessToken) return
  
      let cancel = false
      spotifyApi.searchTracks(searchTerm).then(res => {
        if (cancel) return
        setSearchResults(
          res.body.tracks.items.map(track => {
            const smallestAlbumImage = track.album.images.reduce(
              (smallest, image) => {
                if (image.height < smallest.height) return image
                return smallest
              },
              track.album.images[0]
            )
            return {
              artist: track.artists[0].name,
              title: track.name,
              uri: track.uri,
              albumUrl: smallestAlbumImage.url,
            }
          })
        )
      })
      onQuery(searchResults); 
      return () => (cancel = true)
    }, [searchTerm, accessToken, onQuery])

    return (
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between' }}>
            <AppBar position="static">
                <Toolbar>
                    <div className='container-fluid'>
                        <div className="d-flex justify-content-between">
                            {/* App Name */}
                            <div className="align-self-center">
                                <Typography variant="h6" component="div">WaveStream</Typography> 
                            </div>
                            {/* Search Bar */}
                            <div className="align-self-center">
                                <TextField hiddenLabel id="filled-hidden-label-small" color="info" placeholder="Search for a song, artist or album" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} variant="standard" size="small" sx={{ minWidth: 500, input: { color: 'white' } }} />
                            </div>
                            {/* Refresh Token Button */}
                            <div className="align-self-center">
                                <Button color="inherit" href={authorizeURL} disabled></Button> 
                            </div>
                        </div>
                    </div>
                </Toolbar>
            </AppBar> 
       </Box>
    );
}