import React from 'react'
import { useEffect, useState } from 'react';
import spotifyWebApi from 'spotify-web-api-node';
import TrackSearchResult from './TrackSearchResult';
import AlbumSearchResult from './AlbumSearchResult';
import ArtistSearchResult from './ArtistSearchResult';
import Player from './Player';
import Button from '@mui/material/Button'
import { Container, Col } from "react-bootstrap"
import DashboardContent from './DashboardContent';
import PlaylistContent from './PlaylistContent';

const spotifyApi = new spotifyWebApi({
    clientId: '24a3298301624748953767abdf60ec0a'
});

export default function Dashboard({ accessToken, trackQuery, artistQuery, albumQuery, onSetPlaylistPage, playlistPageStatus, term, shuffleStatus, repeatStatus }) {

    const [newReleases, setNewReleases] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [seedArtist, setSeedArtist] = useState('');
    const [seedTracks, setSeedTracks] = useState([]);
    const [playingTrack, setPlayingTrack] = useState();
    const [playingTracks, setPlayingTracks] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [isAlbum, setIsAlbum] = useState(false);
    const [username, setUsername] = useState('');
    const [isActiveStatus, setIsActiveStatus] = useState(false);

    function chooseTrack(track) {
        if (Array.isArray(track)) {
            if (shuffleStatus) {
                var shuffledTracks = [...track]
                for (let i = shuffledTracks.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffledTracks[i], shuffledTracks[j]] = [shuffledTracks[j], shuffledTracks[i]];
                }
                setPlayingTracks(shuffledTracks.map(t => {
                    return t.uri;
                }))
            } else {
                setPlayingTracks(track.map(t => {
                    return t.uri;
                }))
            }
            setIsAlbum(true);
        } else {
            setPlayingTrack(track);
            setIsAlbum(false);
        }
    }

    // Setting Basic Information
    useEffect(() => {
        if (!accessToken) return;
        const handleBasicInformation = async () => {
            spotifyApi.setAccessToken(accessToken);
            await spotifyApi.getMe().then(res => {
                setUsername(res.body.id);
            })
        }
        handleBasicInformation();
    }, [accessToken])

    // Setting Shuffle Status
    useEffect(() => {
        if (!accessToken) return;
        if (!isActiveStatus) return;

        const handleShuffle = async () => {
            await spotifyApi.setShuffle({state: shuffleStatus});
        }
        handleShuffle();
    }, [accessToken, isActiveStatus, shuffleStatus])

    // Setting Repeat Status
    useEffect(() => {
        if (!accessToken) return;
        if (!isActiveStatus) return;

        const handleRepeat = async () => {
            await spotifyApi.setRepeat({state: repeatStatus});
        }
        handleRepeat();
    }, [accessToken, isActiveStatus, repeatStatus])

    // Get User Playlists
    useEffect(() => {
        if (!accessToken) return
        if (username === "") return
        
        let cancel = false
        
        const handleGetPlaylists = async () => {
            await spotifyApi.getUserPlaylists(username).then(res => {
                if (cancel) return
                res.body.items.map(playlist => {
                    setPlaylists([]);
                    spotifyApi.getPlaylist(playlist.id).then(res => {
                        var tracks = [];
                        res.body.tracks.items.map(track => {
                            const largestAlbumImage = track.track.album.images.reduce(
                                (largest, image) => {
                                    if (image.height > largest.height) return image
                                        return largest
                                },
                                track.track.album.images[0]
                            )
                            tracks.push({
                                artist: track.track.artists[0].name, 
                                name: track.track.name, 
                                uri: track.track.uri, 
                                albumUrl: largestAlbumImage,
                                duration: track.track.duration_ms
                            })
                        })
                        const largestPlaylistImage = res.body.images.reduce(
                            (largest, image) => {
                                if (image.height > largest.height) return image
                                    return largest
                            },
                            res.body.images[0]
                        )
                        setPlaylists(current => [...current, { image: largestPlaylistImage, name: res.body.name, tracks: tracks, uri: res.body.uri, id: res.body.id }])
                    })
                })
            })
        }
        handleGetPlaylists();

        return () => (cancel = true)
    }, [accessToken, username])

    // Get Mainpage Content
    useEffect(() => {
        if (term) return
        if (!accessToken) return

        let cancel = false
        // Get New Releases
        const handleGetNewReleases = async () => {
            await spotifyApi.getNewReleases({ limit : 10, offset: 0, country: 'AU' }).then(res => {
                if (cancel) return
                setNewReleases(
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
                            res.body.items.map(track => (
                                tracks.push({ 
                                    artist: track.artists[0].name, 
                                    name: track.name, 
                                    uri: track.uri, 
                                    albumUrl: largestAlbumImage,
                                    duration: track.duration_ms
                                })
                            ))
                        })
                        return {
                            artist: album.artists[0].name,
                            name: album.name,
                            uri: album.uri,
                            albumUrl: largestAlbumImage.url,
                            tracks: tracks
                        }
                    })
                )
            });
        }
        handleGetNewReleases();
        
        // Get Top Artists for Seeding
        const handleGetTopArtists = async () => {
            await spotifyApi.getMyTopArtists({ limit: 1 }).then(res => {
                setSeedArtist(res.body.items[0].id)
            })
        }
        handleGetTopArtists();

        // Get Top Tracks for Seeding
        const handleGetTopTracks = async () => {
            await spotifyApi.getMyTopTracks({ limit: 2 }).then(res => {
                setSeedTracks(
                    res.body.items.map(track => {
                        return track.id
                    })
                )
            });
        }
        handleGetTopTracks();

        // Get recommendations
        const handleGetRecommendations = async () => {
            await spotifyApi.getRecommendations({ min_energy: 0.4, seed_tracks: seedTracks, seed_artists: seedArtist, min_popularity: 70, offset: 5 }).then(res => {
                var uriAdded = [];
                setRecommendations(
                    res.body.tracks.map(album => {
                        console.log()
                        if (!uriAdded.includes(album.album.uri)) {
                            uriAdded.push(album.album.uri);
                            const largestAlbumImage = album.album.images.reduce(
                                (largest, image) => {
                                    if (image.height > largest.height) return image
                                        return largest
                                },
                                album.album.images[0]
                            )
                            var tracks = [];
                            spotifyApi.getAlbumTracks(album.album.id).then(res => {
                                res.body.items.map(track => {
                                    tracks.push({ 
                                        artist: track.artists[0].name, 
                                        name: track.name, 
                                        uri: track.uri, 
                                        albumUrl: largestAlbumImage,
                                        duration: track.duration_ms
                                    });
                                })
                            })
                            return {
                                artist: album.album.artists[0].name,
                                name: album.album.name,
                                uri: album.album.uri,
                                albumUrl: largestAlbumImage.url,
                                tracks: tracks
                            }
                        } else {
                            return {};
                        }
                    })
                )
            });
        }  

        if (seedArtist && seedTracks) {
            handleGetRecommendations();
        }   

        return () => (cancel = true)
    }, [term, accessToken, seedArtist]);

    return (
        <div>
            <Container fluid className="d-flex flex-column py-2" style={{ height: "93vh" }}>
                {!playlistPageStatus ?
                    <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
                        {/* Show results if exist, else show home page of dashboard */}
                        {albumQuery && term !== '' ? 
                            <>
                                <h1 className="ms-2">Albums</h1>
                                <div className="d-flex flex-row-nowrap-grow-1 mx-2 my-2" style={{overflowX: "auto"}}>
                                    {albumQuery.map((album) => (
                                        <AlbumSearchResult album={album} key={album.uri} chooseTrack={chooseTrack} />
                                    ))}
                                </div>
                            </>
                        : null}
                        
                        {artistQuery && term !== '' ? 
                            <>
                                <h1 className="ms-2">Artists</h1>
                                <div className="d-flex flex-row-nowrap-grow-1 mx-2 my-2" style={{overflowX: "auto"}}>                            
                                    {artistQuery.map((artist) => (
                                        <ArtistSearchResult artist={artist} key={artist.uri} chooseTrack={chooseTrack} />
                                    ))}
                                </div>
                            </>
                        : null}
                        
                        {trackQuery && term !== '' ? 
                            <>
                                <h1 className="ms-2">Tracks</h1>
                                {trackQuery.map((track) => (  
                                    <TrackSearchResult track={track} key={track.uri} chooseTrack={chooseTrack} />
                                ))}
                            </>
                        : null}

                        {term === '' ?
                            <>
                                <h1 className="mt-4 ms-4">What's new</h1>
                                <div className="d-flex flex-row-nowrap-grow-1 mx-2 my-2" style={{overflowX: "auto"}}>
                                    {newReleases.map((album) => (
                                        <Col className="mx-2" key={album.uri}>
                                            <DashboardContent album={album} key={album.uri} chooseTrack={chooseTrack}/>
                                        </Col>
                                    ))}
                                </div>
                                <h1 className="mt-4 ms-4">Your Recommendations</h1>
                                <div className="d-flex flex-row-nowrap-grow-1 mx-2 my-2" style={{overflowX: "auto"}}>
                                    {recommendations.map((album) => (
                                        Object.keys(album).length !== 0 ?
                                            <Col className="mx-2" key={album.uri}>
                                                <DashboardContent album={album} key={album.uri} chooseTrack={chooseTrack}/>
                                            </Col>
                                        : null
                                    ))}
                                </div>
                            </>
                        : null}
                    </div>
                :
                <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
                    <Button variant="text" onClick={() => onSetPlaylistPage(false)}>Go Back</Button>
                    <h1 className="my-4 ms-4">Your Playlists</h1>
                    <div className="d-flex justify-content-center">
                        {playlists.map((playlist) => (
                                <div className="col-3" key={playlist.uri}>
                                    <div className="d-flex justify-content-center">
                                        <PlaylistContent playlist={playlist} key={playlist.uri} chooseTrack={chooseTrack}/>
                                    </div>
                                </div>
                            ))}
                    </div>
                        
                </div>}
                <div>
                    {!isAlbum ? 
                        <Player accessToken={accessToken} trackUri={playingTrack?.uri} isActive = {setIsActiveStatus} />
                        :
                        <Player accessToken={accessToken} trackUri={playingTracks} isActive = {setIsActiveStatus} />
                    }
                </div>
            </Container>
        </div>
    )
}
