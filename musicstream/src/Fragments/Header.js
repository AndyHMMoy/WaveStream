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
import spotifyWebApi from 'spotify-web-api-node';
import React from 'react';
import '../Stylesheets/Header.css';
import SpotifyAccessContext from '../Contexts/SpotifyAccessContext';
import useSearchResult from '../Hooks/useSearchResult';
import PlaybackSettingsContext from '../Contexts/PlaybackSettingsContext';

const spotifyApi = new spotifyWebApi({
    clientId: '24a3298301624748953767abdf60ec0a'
});

export default function Header({ onTrackQuery, onArtistQuery, onAlbumQuery, onSetPlaylistPage, termChange }) { 

    const {accessToken, username, spotifyApi} = useContext(SpotifyAccessContext);

    const {isShuffle, setIsShuffle, repeatStatus, setRepeatStatus} = useContext(PlaybackSettingsContext);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [trackSearchResults, setTrackSearchResults] = useState([]);
    const [artistSearchResults, setArtistSearchResults] = useState([]);
    const [albumSearchResults, setAlbumSearchResults] = useState([]);

    // Create the authorization URL
    var authorizeURL = "https://accounts.spotify.com/en/authorize?client_id=24a3298301624748953767abdf60ec0a&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-top-read%20playlist-read-private%20playlist-read-collaborative%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";

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
      termChange(searchTerm);
      if (searchTerm !== '') {
        onSetPlaylistPage(false)
      }
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
                            <div className="align-self-center">
                              {/* Refresh Token Button */} 
                              <Typography variant="h6" component="small" className="me-3" style={{ cursor: "pointer" }} onClick={() => backToHome()}>WaveStream</Typography>
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