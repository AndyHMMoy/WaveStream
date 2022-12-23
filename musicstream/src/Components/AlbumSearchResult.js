import React from 'react'
import ExpandableAlbumTile from './ExpandableAlbumTile'

export default function AlbumSearchResult({ album, chooseTrack }) {
  return (
    <ExpandableAlbumTile album = {album} key = {album.uri} chooseTrack = {chooseTrack} />
  )
}
