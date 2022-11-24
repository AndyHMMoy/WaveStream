import React from 'react'
import DashboardContent from './DashboardContent'

export default function AlbumSearchResult({ album, chooseTrack }) {
  return (
    <DashboardContent album = {album} key = {album.uri} chooseTrack = {chooseTrack} />
  )
}
