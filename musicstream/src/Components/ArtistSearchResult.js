import ExpandableArtistTile from './ExpandableArtistTile';

export default function ArtistSearchResult({ artist, chooseTrack }) {

  return (
    <ExpandableArtistTile artist = {artist} key = {artist.uri} chooseTrack = {chooseTrack} />
  )
}
