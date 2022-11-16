import Button from '@mui/material/Button';
import { useEffect } from 'react';

function Home() {

  const SpotifyWebApi = require('spotify-web-api-node');

  var scopes = [],
      redirectUri = 'http://localhost:3000/callback/',
      clientId = '24a3298301624748953767abdf60ec0a',
      state = 'xyz',
      showDialog = true,
      responseType = 'token';

  // Setting credentials can be done in the wrapper's constructor, or using the API object's setters.
  var spotifyApi = new SpotifyWebApi({
  redirectUri: redirectUri,
  clientId: clientId
  });

  // Create the authorization URL
  var authorizeURL = spotifyApi.createAuthorizeURL(
  scopes,
  state,
  showDialog,
  responseType
  );

  // Authorise URL
  console.log(authorizeURL);

  // console.log(localStorage.getItem("access_Token").toString())
  useEffect(() => {
    if (localStorage.getItem("access_Token") !== null) {
      spotifyApi.setAccessToken(localStorage.getItem("access_Token").toString());
      console.log("Token: " + localStorage.getItem("access_Token").toString());
      console.log("Access Token Set.")
    }
  }, []);
  
  
  const action = async (event) => {
    event.preventDefault();

    console.log(spotifyApi.getAccessToken());
    spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE')
      .then(function(data) {
        console.log('Artist albums', data.body);
      }, function(err) {
        console.error(err);
    });
  }
    


  return(
      <div>
          <h1>Hi</h1>
          <Button variant="contained" onClick={(event) => action(event)}>Hello World</Button>
      </div>
  );

}

export default Home;