// my import
import { spotify, youtube } from "./my_library/implementProtectedInfo.js";
import {getTokens} from "./my_library/getToken.js"
import {code} from "./my_library/getCode.js"

// import
import express from "express";
import * as dotenv from "dotenv"
dotenv.config({ path: "./.env" });

// create variables
let spotifyCode = new code()
let youtubeCode = new code()

// app
const app = express();
app.listen(process.env.PORT);
app.set("view engine", "ejs");

app.get("/exit", (req, res) => {
  res.render("exit");
});

app.get("/loginresponse/spotify", (req, res) => {
  spotifyCode.resolve(getCodeSpotify(req.url))
  setTimeout(() => {
    res.redirect("/exit");
  }, 1000);
});

app.get("/loginresponse/youtube", (req, res) => {
  youtubeCode.resolve(getCodeYoutube(req.url));
  setTimeout(() => {
    res.redirect("/exit");
  }, 1000);
});


// a voir
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

getTokens(spotify, spotifyCode)
getTokens(youtube, youtubeCode)