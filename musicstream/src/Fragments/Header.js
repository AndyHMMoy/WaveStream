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

export default function Header({ accessToken, onTrackQuery, onArtistQuery, onAlbumQuery, termChange }) { 

    const [searchTerm, setSearchTerm] = useState('');
    const [trackSearchResults, setTrackSearchResults] = useState([]);
    const [artistSearchResults, setArtistSearchResults] = useState([]);
    const [albumSearchResults, setAlbumSearchResults] = useState([]);


    // Create the authorization URL
    var authorizeURL = "https://accounts.spotify.com/en/authorize?client_id=24a3298301624748953767abdf60ec0a&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";

    useEffect(() => {
      if (!accessToken) return;
      spotifyApi.setAccessToken(accessToken)
    }, [accessToken])

    useEffect(() => {
      termChange(searchTerm);
      if (!searchTerm) return setTrackSearchResults([]), setArtistSearchResults([]), setAlbumSearchResults([])
      if (!accessToken) return
  
      let cancel = false
      spotifyApi.searchTracks(searchTerm).then(res => {
        if (cancel) return
        setTrackSearchResults(
          res.body.tracks.items.map(track => {
            const largestAlbumImage = track.album.images.reduce(
              (largest, image) => {
                if (image.height > largest.height) return image
                return largest
              },
              track.album.images[0]
            )
            return {
              artist: track.artists[0].name,
              title: track.name,
              uri: track.uri,
              albumUrl: largestAlbumImage.url,
            }
          })
        )
      })
      onTrackQuery(trackSearchResults);
      spotifyApi.searchArtists(searchTerm, { limit: 3 }).then(res => {
        if (cancel) return
        setArtistSearchResults(
          res.body.artists.items.map(artist => {
            const largestArtistImage = artist.images.reduce(
              (largest, image) => {
                if (image.height > largest.height) return image
                return largest
              },
              artist.images[0]
            )
            return {
              name: artist.name,
              uri: artist.uri,
              artistUrl: largestArtistImage.url,
              followers: artist.followers.total
            }
          })
        )
      })
      onArtistQuery(artistSearchResults);
      spotifyApi.searchAlbums(searchTerm, { limit: 3 }).then(res => {
        if (cancel) return
        setAlbumSearchResults(
          res.body.albums.items.map(album => {
            const largestAlbumImage = album.images.reduce(
              (largest, image) => {
                if (image.height > largest.height) return image
                return largest
              },
              album.images[0]
            )
            console.log(album)
            var tracks = [];
            spotifyApi.getAlbumTracks(album.id).then(res => {
                res.body.items.map(track => {
                    tracks.push({ 
                        artist: track.artists[0].name, 
                        name: track.name, 
                        uri: track.uri, 
                        albumUrl: largestAlbumImage.url,
                        duration: track.duration_ms
                    });
                })
            })
            return {
              name: album.name,
              artist: album.artists[0].name,
              uri: album.uri,
              albumUrl: largestAlbumImage.url,
              tracks: tracks,
            }
          })
        )
      })
      onAlbumQuery(albumSearchResults);
      return () => (cancel = true)
    }, [searchTerm, accessToken, onTrackQuery])

    return (
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between' }}>
            <AppBar position="static">
                <Toolbar>
                    <div className='container-fluid'>
                        <div className="d-flex justify-content-between">
                            {/* App Name */}
                            <div className="align-self-center" style={{ cursor: "pointer" }} onClick={() => setSearchTerm("")}>
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