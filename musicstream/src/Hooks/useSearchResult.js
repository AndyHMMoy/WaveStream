import { useState, useEffect } from 'react';

export default function useSearchResult (searchTerm, termChange, onSetPlaylistPage, spotifyApi, accessToken) {

    const [trackSearchResults, setTrackSearchResults] = useState([]);
    const [artistSearchResults, setArtistSearchResults] = useState([]);
    const [albumSearchResults, setAlbumSearchResults] = useState([]);

    useEffect(() => {
        termChange(searchTerm);
        if (searchTerm !== '') {
          onSetPlaylistPage(false)
        }
        if (!searchTerm) return (setTrackSearchResults([]), setArtistSearchResults([]), setAlbumSearchResults([]));
        if (!accessToken) return;
    
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
                albumUrl: largestAlbumImage?.url,
              }
            })
          )
        })
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
                artistUrl: largestArtistImage?.url,
                followers: artist.followers.total,
                id: artist.id
              }
            })
          )
        })
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
                          albumUrl: largestAlbumImage?.url,
                          duration: track.duration_ms
                      });
                  })
              })
              return {
                name: album.name,
                artist: album.artists[0].name,
                uri: album.uri,
                albumUrl: largestAlbumImage?.url,
                tracks: tracks,
              }
            })
          )
        })
        return () => (cancel = true)
    }, [searchTerm, accessToken])

    return [trackSearchResults, artistSearchResults, albumSearchResults]
}