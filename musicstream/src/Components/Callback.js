import { useEffect, useState } from 'react';


function Callback() {

    useEffect(() => {

        localStorage.setItem("code", new URLSearchParams(window.location.search).get('code'));

    }, []);

    return(
        <div>
            <h1>Thank you</h1>
            <p>You can close this page now.</p>
        </div>
    );

}

export default Callback;