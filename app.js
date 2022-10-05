import getCode from "./my_library/getCode.js"
import code from "./my_library/getCode.js"

import * as dotenv from "dotenv"
dotenv.config({ path: "./.env" });

import express from "express";

const app = express();

const redirectUri = "http://127.0.0.1:" + process.env.PORT;

import spotify from "./data/spotify.json" assert { type: 'json' };
import youtube from "./data/youtube.json" assert { type: 'json' };

spotify.clientId = process.env.SPOTIFY_CLIENT_ID

youtube.APIKey = process.env.YOUTUBE_API_KEY
youtube.clientId = process.env.YOUTUBE_CLIENT_ID

spotify.accesUrl = spotify.accesUrl0 + spotify.clientId + spotify.accesUrl1 + encodeURI(redirectUri + "/loginresponse/spotify") + spotify.accesUrl2
youtube.accesUrl = youtube.accesUrl0 + encodeURI(redirectUri + "/loginresponse/youtube") + youtube.accesUrl1 + youtube.clientId + youtube.accesUrl2

var spotifyCode = new code()
var youtubeCode = new code()

//app
app.listen(process.env.PORT);
app.set("view engine", "ejs");

//exit
app.get("/exit", (req, res) => {
  res.render("exit");
});

function getCodeYoutube(req_url) {
  let code = null;
  code = req_url.substr(req_url.search(/code/) + 5, req_url.length);
  return code;
}

function getCodeSpotify(req_url) {
  let code = null;
  code = req_url.substr(req_url.search(/code/) + 5, req_url.length);
  return code;  
}

app.get("/loginresponse/spotify", (req, res) => {
  console.log("J suis la")
  spotifyCode.resolve(getCodeSpotify(req.url))
  setTimeout(() => {
    res.redirect("/exit");
  }, 100);
});

app.get("/loginresponse/youtube", (req, res) => {
  youtube_code = getCodeYoutube(req.url);
  setTimeout(() => {
    res.redirect("/exit");
  }, 100);
});

//getCode(youtube, redirectUri)
async function getToken()
{
  getCode(spotify, spotifyCode).then(result => {console.log(result)})
}

getToken()