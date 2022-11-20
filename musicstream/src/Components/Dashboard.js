import React from 'react'
import { useEffect, useState } from 'react';
import spotifyWebApi from 'spotify-web-api-node';
import TrackSearchResult from './TrackSearchResult';
import Player from './Player';
import { Container, Col, Row } from "react-bootstrap"
import NewRelease from './NewRelease';

const spotifyApi = new spotifyWebApi({
    clientId: '24a3298301624748953767abdf60ec0a'
});

export default function Dashboard({ accessToken, query, term }) {

    const [newReleases, setNewReleases] = useState([]);
    const [playingTrack, setPlayingTrack] = useState();

    function chooseTrack(track) {
        setPlayingTrack(track)
    }

    useEffect(() => {
        if (!accessToken) return;
        spotifyApi.setAccessToken(accessToken)
    }, [accessToken])

    useEffect(() => {
        if (term) return
        if (!accessToken) return

        let cancel = false
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

                    return {
                        artist: album.artists[0].name,
                        name: album.name,
                        uri: album.uri,
                        albumUrl: largestAlbumImage.url
                    }
                })
            )
        });
        return () => (cancel = true)
    }, [term, accessToken]);

    return (
        <div>
            <Container fluid className="d-flex flex-column py-2" style={{ height: "90vh" }}>
                <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
                    {/* Show results if exist, else show home page of dashboard */}
                    {query && term !== '' ? query.map(track => (
                    <TrackSearchResult track={track} key={track.uri} chooseTrack={chooseTrack} />
                    )) : 
                    <>
                    <h1>What's new</h1>
                    <div className="d-flex flex-row-nowrap-grow-1 mx-2 my-2" style={{overflowX: "auto"}}>
                        {newReleases.map(album => (
                            <Col className="mx-2">
                                <NewRelease album={album} key={album.uri}/>
                            </Col>
                            
                        ))}
                    </div>
                    <h1>Your Recommendations</h1>
                    </>
                    }
                </div>
                <div>
                    <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
                </div>
            </Container>
        </div>
    )
}
