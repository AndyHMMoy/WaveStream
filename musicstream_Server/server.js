const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');

const spotifyWebApi = require('spotify-web-api-node');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/refresh', (req, res) => {
    console.log("hi")
    const refreshToken = req.body.refreshToken;
    const spotifyApi = new spotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: '24a3298301624748953767abdf60ec0a',
        clientSecret: '07c5bee1b987460db3f61f7d0e25d3df',
        refreshToken
    })

    spotifyApi.refreshAccessToken().then(data => {
        res.json({
            accessToken: data.body.accessToken,
            expiresIn: data.body.expiresIn
        })
    }).catch(err => {
        console.log("Refresh error" + err)
        res.sendStatus(400);
    });

})

app.post('/login', (req, res) => {
    const code = req.body.code;
    const spotifyApi = new spotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: '24a3298301624748953767abdf60ec0a',
        clientSecret: '07c5bee1b987460db3f61f7d0e25d3df'
    })

    spotifyApi.authorizationCodeGrant(code).then(data => {
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in
        })
    }).catch(err => {
        console.log("Login error" + err)
        res.sendStatus(400);
    })
});

app.listen(3001);