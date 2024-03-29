import React from 'react'
import { useContext, useEffect, useState } from 'react';
import TrackSearchResult from './TrackSearchResult';
import AlbumSearchResult from './AlbumSearchResult';
import ArtistSearchResult from './ArtistSearchResult';
import Player from './Player';
import Button from '@mui/material/Button'
import { Container, Col } from "react-bootstrap"
import ExpandableAlbumTile from './ExpandableAlbumTile';
import ExpandablePlaylistTile from './ExpandablePlaylistTile';
import UserDataContext from '../Contexts/UserDataContext';
import SpotifyAccessContext from '../Contexts/SpotifyAccessContext';
import PlaybackSettingsContext from '../Contexts/PlaybackSettingsContext';
import SearchTermContext from '../Contexts/SearchTermContext';

export default function Dashboard({ trackQuery, artistQuery, albumQuery, onSetPlaylistPage, playlistPageStatus, setPlayingTrack, setPlayingTracks, setIsAlbum, isActiveStatus }) {

    const {accessToken, spotifyApi} = useContext(SpotifyAccessContext);

    const {isShuffle, repeatStatus} = useContext(PlaybackSettingsContext);

    const {searchTerm} = useContext(SearchTermContext);

    function chooseTrack(track) {
        if (Array.isArray(track)) {
            if (isShuffle) {
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

    // Setting Shuffle Status
    useEffect(() => {
        if (!accessToken) return;
        if (!isActiveStatus) return;

        const handleShuffle = async () => {
            await new Promise(resolve => setTimeout(resolve, 500));
            await spotifyApi.setShuffle({state: isShuffle});
        }
        handleShuffle();
    }, [accessToken, isActiveStatus, isShuffle, spotifyApi])

    // Setting Repeat Status
    useEffect(() => {
        if (!accessToken) return;
        if (!isActiveStatus) return;

        const handleRepeat = async () => {
            await new Promise(resolve => setTimeout(resolve, 750));
            await spotifyApi.setRepeat({state: repeatStatus});
        }
        handleRepeat();
    }, [accessToken, isActiveStatus, repeatStatus, spotifyApi])

    return (
        <UserDataContext.Consumer>
            {(value) => (
            <div>
                <Container fluid className="d-flex flex-column justify-content-center py-2 px-4">
                    {!playlistPageStatus ?
                        <div className="flex-grow-1 my-2">
                            {/* Show results if exist, else show home page of dashboard */}
                            {albumQuery.length > 0 && searchTerm !== '' ? 
                                <>
                                    <h1 className="ms-2">Albums</h1>
                                    <div className="d-flex flex-row-nowrap-grow-1 mx-2 my-2" style={{overflowX: "auto"}}>
                                        {albumQuery.map((album) => (
                                            <AlbumSearchResult album={album} key={album.uri} chooseTrack={chooseTrack} />
                                        ))}
                                    </div>
                                </>
                            : null}
                            
                            {artistQuery.length > 0 && searchTerm !== '' ? 
                                <>
                                    <h1 className="ms-2">Artists</h1>
                                    <div className="d-flex flex-row-nowrap-grow-1 mx-2 my-2" style={{overflowX: "auto"}}>                            
                                        {artistQuery.map((artist) => (
                                            <ArtistSearchResult artist={artist} key={artist.uri} chooseTrack={chooseTrack} />
                                        ))}
                                    </div>
                                </>
                            : null}
                            
                            {trackQuery.length > 0 && searchTerm !== '' ? 
                                <>
                                    <h1 className="ms-2">Tracks</h1>
                                    <div className="mx-3 my-2" >
                                        {trackQuery.map((track) => (  
                                            <TrackSearchResult track={track} key={track.uri} chooseTrack={chooseTrack} />
                                        ))}
                                    </div>
                                </>
                            : null}

                            {searchTerm === '' ?
                                <>
                                    <h1 className="mt-4">What's new</h1>
                                    <div className="d-flex flex-row-nowrap-grow-1 mx-2 mr-2" style={{overflowX: "auto"}}>
                                        {value[0].map((album) => (
                                            <Col className="mx-2" key={album.uri}>
                                                <ExpandableAlbumTile album={album} key={album.uri} chooseTrack={chooseTrack}/>
                                            </Col>
                                        ))}
                                    </div>
                                    <h1 className="mt-4">Your Recommendations</h1>
                                    <div className="d-flex flex-row-nowrap-grow-1 mx-2 mr-2" style={{overflowX: "auto"}}>
                                        {value[1].map((album) => (
                                            Object.keys(album).length !== 0 ?
                                                <Col className="mx-2" key={album.uri}>
                                                    <ExpandableAlbumTile album={album} key={album.uri} chooseTrack={chooseTrack}/>
                                                </Col>
                                            : null
                                        ))}
                                    </div>
                                </>
                            : null}
                        </div>
                    :
                    <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
                        <Button variant="text" className="mx-3" onClick={() => onSetPlaylistPage(false)}>Go Back</Button>
                        <h1 className="my-4 ms-4">Your Playlists</h1>
                        <div className="d-flex justify-content-center">
                            {value[2].map((playlist) => (
                                <div className="col-3 w-auto mx-auto" key={playlist.uri}>
                                    <ExpandablePlaylistTile playlist={playlist} key={playlist.uri} chooseTrack={chooseTrack}/>
                                </div>
                            ))}
                        </div>
                            
                    </div>}
                </Container>
            </div>
            )}
        </UserDataContext.Consumer>
    )
}
