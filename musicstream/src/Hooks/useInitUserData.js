import { useState, useEffect } from 'react';
import spotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new spotifyWebApi({
    clientId: '24a3298301624748953767abdf60ec0a'
});

export default function useInitUserData(accessToken) {

    const [newReleases, setNewReleases] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [seedArtist, setSeedArtist] = useState('');
    const [seedTracks, setSeedTracks] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [username, setUsername] = useState('');

    // Setting Basic Information
    useEffect(() => {
        if (!accessToken) return;
        const handleBasicInformation = async () => {
            await spotifyApi.setAccessToken(accessToken);
            await spotifyApi.getMe().then(res => {
                setUsername(res.body.id);
            })
        }
        handleBasicInformation();
    }, [accessToken])

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
                                albumUrl: largestAlbumImage.url,
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
                        setPlaylists(current => [...current, { image: largestPlaylistImage, name: res.body.name, tracks: tracks, uri: res.body.uri, id: res.body.id, description: res.body.description }])
                    })
                })
            })
        }
        handleGetPlaylists();

        return () => (cancel = true)
    }, [accessToken, username])

    // Get Mainpage Content
    useEffect(() => {
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
                                    albumUrl: largestAlbumImage.url,
                                    duration: track.duration_ms
                                })
                            ))
                        })
                        return {
                            artist: album.artists[0].name,
                            name: album.name,
                            uri: album.uri,
                            albumUrl: largestAlbumImage.url,
                            tracks: tracks,
                            type: album.album_type,
                            total_tracks: album.total_tracks,
                            release_date: album.release_date
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
                                        albumUrl: largestAlbumImage.url,
                                        duration: track.duration_ms
                                    });
                                })
                            })
                            return {
                                artist: album.album.artists[0].name,
                                name: album.album.name,
                                uri: album.album.uri,
                                albumUrl: largestAlbumImage.url,
                                tracks: tracks,
                                type: album.album.album_type,
                                total_tracks: album.album.total_tracks,
                                release_date: album.album.release_date
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
    }, [accessToken, seedArtist]);

    return [newReleases, recommendations, playlists, username, spotifyApi]

}