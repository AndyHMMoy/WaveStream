import { useContext, useState } from 'react';
import SpotifyAccessContext from '../Contexts/SpotifyAccessContext';
import PlaybackSettingsContext from '../Contexts/PlaybackSettingsContext';
import Player from '../Components/Player';

export default function Footer({ isAlbum, playingTrack, playingTracks, setActiveStatus }) {

  const {accessToken} = useContext(SpotifyAccessContext);

  return (
    <div className='Footer'>
      {!isAlbum ? 
        <Player accessToken={accessToken} track={playingTrack} isActive = {setActiveStatus} />
        :
        <Player accessToken={accessToken} track={playingTracks} isActive = {setActiveStatus} />
      }
    </div> 
  )
}
