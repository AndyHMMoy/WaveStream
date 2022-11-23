import React from 'react'
import { useEffect, useState } from 'react';
import spotifyWebApi from 'spotify-web-api-node';
import TrackSearchResult from './TrackSearchResult';
import Player from './Player';
import { Container, Col } from "react-bootstrap"
import DashboardContent from './DashboardContent';

const spotifyApi = new spotifyWebApi({
    clientId: '24a3298301624748953767abdf60ec0a'
});

export default function Dashboard({ accessToken, query, term }) {

    const [newReleases, setNewReleases] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [seedArtist, setSeedArtist] = useState('');
    const [seedTracks, setSeedTracks] = useState([]);
    const [playingTrack, setPlayingTrack] = useState();
    const [playingTracks, setPlayingTracks] = useState([]);
    const [isAlbum, setIsAlbum] = useState(false);

    function chooseTrack(track) {
        if (Array.isArray(track)) {
            setPlayingTracks(track.map(t => {
                return t.uri;
            }))
            setIsAlbum(true);
        } else {
            setPlayingTrack(track);
            setIsAlbum(false);
        }
    }

    useEffect(() => {
        if (!accessToken) return;
        spotifyApi.setAccessToken(accessToken)
    }, [accessToken])

    useEffect(() => {
        if (term) return
        if (!accessToken) return

        let cancel = false
        // Get New Releases
        spotifyApi.getNewReleases({ limit : 10, offset: 0, country: 'AU' }).then(res => {
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
                        res.body.items.map(track => {
                            tracks.push({ 
                                artist: track.artists[0].name, 
                                name: track.name, 
                                uri: track.uri, 
                                albumUrl: largestAlbumImage
                            });
                        })
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
        // Get recommendations
        spotifyApi.getMyTopArtists({ limit: 1 }).then(res => {
            setSeedArtist(res.body.items[0].id)

        });
        spotifyApi.getMyTopTracks({ limit: 2 }).then(res => {
            setSeedTracks(
                res.body.items.map(track => {
                    return track.id
                })
            )
        });
        spotifyApi.getRecommendations({ min_energy: 0.4, seed_tracks: seedTracks, seed_artists: seedArtist, min_popularity: 70 }).then(res => {
            setRecommendations(
                res.body.tracks.map(album => {
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
                                albumUrl: largestAlbumImage
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
                })
            )
        });
        
        return () => (cancel = true)
    }, [term, accessToken, seedArtist]);

    return (
        <div>
            <Container fluid className="d-flex flex-column py-2" style={{ height: "91vh" }}>
                <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
                    {/* Show results if exist, else show home page of dashboard */}
                    {query && term !== '' ? query.map((track, index) => (
                    <TrackSearchResult track={track} key={track.uri} chooseTrack={chooseTrack} />
                    )) : 
                    <>
                    <h1 className="mt-4 ms-4">What's new</h1>
                    <div className="d-flex flex-row-nowrap-grow-1 mx-2 my-2" style={{overflowX: "auto"}}>
                        {newReleases.map((album, index) => (
                            <Col className="mx-2">
                                <DashboardContent album={album} key={album.uri} chooseTrack={chooseTrack}/>
                            </Col>
                            
                        ))}
                    </div>
                    <h1 className="mt-4 ms-4">Your Recommendations</h1>
                    <div className="d-flex flex-row-nowrap-grow-1 mx-2 my-2" style={{overflowX: "auto"}}>
                        {recommendations.map((album, index) => (
                            <Col className="mx-2">
                                <DashboardContent album={album} key={album.uri} chooseTrack={chooseTrack}/>
                            </Col>
                        ))}
                    </div>
                    </>
                    }
                </div>
                <div>
                    {!isAlbum ? 
                        <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
                        :
                        <Player accessToken={accessToken} trackUri={playingTracks} />
                    }
                </div>
            </Container>
        </div>
    )
}
