import { useEffect } from 'react';


function Callback() {
    const querystring = require('query-string');
    useEffect(() => {

        var rawQueryString = window.location.href.toString();
        rawQueryString = rawQueryString.replace("http://localhost:3000/callback/?code=", "")
        rawQueryString = rawQueryString.replace("&state=xyz", "")

        localStorage.setItem("access_Token", rawQueryString);

        console.log(rawQueryString);

        let accessToken = querystring.parse(window.location.search).access_token

        console.log(accessToken);

    }, []);

    return(
        <div>
            <h1>Thank you</h1>
            <p>You can close this page now.</p>
        </div>
    );

}

export default Callback;