import * as dotenv from "dotenv"
dotenv.config({ path: "./.env" });

Array.prototype.insert = function ( index, ...items ) {
    this.splice( index, 0, ...items );
};

function constructUrl(arr){
    let url = arr[0]
    for(let i = 1; i < arr.length; i++){
        console.log(arr[i])
        url += arr[i]
    }
    return url
}

const redirectUri = "http://127.0.0.1:" + process.env.PORT;

import spotify from "../data/spotify.json" assert { type: 'json' };
import youtube from "../data/youtube.json" assert { type: 'json' };

spotify.clientId = process.env.SPOTIFY_CLIENT_ID
spotify.cleintSecret = process.env.SPOTIFY_CLIENT_SECRET

youtube.APIKey = process.env.YOUTUBE_API_KEY
youtube.clientId = process.env.YOUTUBE_CLIENT_ID
youtube.cleintSecret = process.env.YOUTUBE_CLIENT_SECRET

spotify.accesUrl.insert(1, spotify.clientId)
spotify.accesUrl.insert(3, encodeURI(redirectUri + "/loginresponse/spotify"))

youtube.accesUrl.insert(1, encodeURI(redirectUri + "/loginresponse/youtube"))
youtube.accesUrl.insert(3, youtube.clientId)

export {spotify, youtube, constructUrl, redirectUri}