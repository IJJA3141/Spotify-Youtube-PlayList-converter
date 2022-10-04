require("dotenv").config({ path: "./.env" });

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const open = require("open");
const fs = require("fs");
const express = require("express");

const app = express();

const redirect_uri = "http://127.0.0.1:" + process.env.PORT;

const spotify_access_url = "https://accounts.spotify.com/authorize";
const spotify_search_url = "https://api.spotify.com/v1/me/tracks";
const SPOTIFY_TOKEN = "https://accounts.spotify.com/api/token";

const youtube_search_url = "https://youtube.googleapis.com/youtube/v3/search";
const youtube_access_url = "https://accounts.google.com/o/oauth2/v2/auth";
const YOUTUBE_TOKEN = "https://oauth2.googleapis.com/token";

var youtube_API_key = "AIzaSyCxKg3qpas-lkSICmioqpXJJsuvIgIt1yE";

var youtube_access_token = null;
var youtube_code = undefined;
var youtube_add = null;

var spotify_access_token = null;
var spotify_code = undefined;
var spotify_offset = 0;

var current_song_position = undefined;

var spotify_song_list = { song: [] };
try {
  var spotify_song_list_temp = require("./spotify_song_list.json");
  var last_song = spotify_song_list_temp.song[0].title;
} catch {
  // p't'etre pas le meilleur nom
  var spotify_song_list_temp = { song: [], PlaylistID: null };
  var last_song = undefined;
}

//app
app.listen(process.env.PORT);
app.set("view engine", "ejs");

//exit
app.get("/exit", (req, res) => {
  res.render("exit");
});

function ex(exit_message) {
  console.log(exit_message);
  process.exit();
}

//fetch tokens
function waitTokens(_callBack) {
  if (spotify_access_token == undefined || youtube_access_token == undefined) {
    setTimeout(() => {
      waitTokens(_callBack, arguments[1]);
    }, 1000);
  } else {
    _callBack(arguments[1]);
  }
}

//get spotify code
function getSpotifyAccessToken(_callBack) {
  open("http://127.0.0.1:" + process.env.PORT + "/login/spotify");
  waitSpotifyCode(_callBack);
}

function waitSpotifyCode(_callBack) {
  if (spotify_code == undefined) {
    setTimeout(() => {
      waitSpotifyCode(_callBack);
    }, 100);
  } else {
    _callBack();
  }
}

function waitYoutubeCode(_callBack) {
  if (youtube_code == undefined) {
    setTimeout(() => {
      waitYoutubeCode(_callBack);
    }, 100);
  } else {
    _callBack();
  }
}

app.get("/login/spotify", (req, res) => {
  let url = spotify_access_url;
  url += "?client_id=" + process.env.SPOTIFY_CLIENT_ID;
  url += "&response_type=code";
  url += "&redirect_uri=" + encodeURI(redirect_uri + "/loginresponse/spotify");
  url += "&show_dialog=true";
  url += "&scope=user-library-read";
  res.redirect(url);
});

function getCodeSpotify(req_url) {
  let code = null;
  code = req_url.substr(req_url.search(/code/) + 5, req_url.length);
  return code;
}

app.get("/loginresponse/spotify", (req, res) => {
  spotify_code = getCodeSpotify(req.url);
  setTimeout(() => {
    res.redirect("/exit");
  }, 100);
});

//fetch spotify access token
function fetchAccessTokenSpotify() {
  let body = "grant_type=authorization_code";
  body += "&code=" + spotify_code;
  body += "&redirect_uri=" + encodeURI(redirect_uri + "/loginresponse/spotify");
  body += "&client_id=" + process.env.SPOTIFY_CLIENT_ID;
  body += "&client_secret=" + process.env.SPOTIFY_CLIENT_SECRET;
  callAuthorizationApiSpotify(body);
}

function callAuthorizationApiSpotify(body) {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", SPOTIFY_TOKEN, true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.setRequestHeader(
    "Authorization",
    "Basic " +
      btoa(
        process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
      )
  );
  xhr.send(body);
  xhr.onload = handleAuthorizationResponseSpotify;
}

function handleAuthorizationResponseSpotify() {
  if (this.status === 200) {
    let data = JSON.parse(this.responseText);
    if (data.access_token != undefined) {
      spotify_access_token = data.access_token;
    }
  } else if (this.status === 400) {
    getSpotifyAccessAndRefreshToken(fetchAccessTokenSpotify);
  } else {
    ex(this.responseText);
  }
}

//get youtube code
function getYoutubeAccessToken(_callBack) {
  open("http://127.0.0.1:" + process.env.PORT + "/login/youtube");
  waitYoutubeCode(_callBack);
}

function waitYoutubeCode(_callBack) {
  if (youtube_code == undefined) {
    setTimeout(() => {
      waitYoutubeCode(_callBack);
    }, 100);
  } else {
    _callBack();
  }
}

app.get("/login/youtube", function (req, res) {
  let url = youtube_access_url;
  url += "?redirect_uri=" + encodeURI(redirect_uri + "/loginresponse/youtube");
  url += "&prompt=consent";
  url += "&response_type=code";
  url += "&client_id=" + process.env.YOUTUBE_CLIENT_ID;
  url += "&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.force-ssl";
  url += "&access_type=offline";
  res.redirect(url);
});

function getCodeYoutube(req_url) {
  let code = null;
  code = req_url.substr(req_url.search(/code/) + 5, req_url.length);
  return code;
}

app.get("/loginresponse/youtube", (req, res) => {
  youtube_code = getCodeYoutube(req.url);
  res.redirect("/exit");
});

//fetch youtube access token
function fetchAccessTokenYoutube() {
  let body = "grant_type=authorization_code";
  body += "&code=" + youtube_code;
  body += "&redirect_uri=" + encodeURI(redirect_uri + "/loginresponse/youtube");
  body += "&client_id=" + process.env.YOUTUBE_CLIENT_ID;
  body += "&client_secret=" + process.env.YOUTUBE_CLIENT_SECRET;
  callAuthorizationApiYoutube(body);
}

function callAuthorizationApiYoutube(body) {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", YOUTUBE_TOKEN, true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.setRequestHeader(
    "Authorization",
    "Basic " +
      btoa(
        process.env.YOUTUBE_CLIENT_ID + ":" + process.env.YOUTUBE_CLIENT_SECRET
      )
  );
  xhr.send(body);
  xhr.onload = handleAuthorizationResponseYoutube;
}

function handleAuthorizationResponseYoutube() {
  if (this.status === 200) {
    let data = JSON.parse(this.responseText);
    if (data.access_token != undefined) {
      youtube_access_token = data.access_token;
    }
  } else if (this.status === 400) {
    getYoutubeAccessAndRefreshToken(fetchAccessTokenYoutube);
  } else {
    ex(this.responseText);
  }
}

//save json file
function storeSpotifySongList(file_name, data) {
  fs.writeFile("./" + file_name + ".json", JSON.stringify(data), (err) => {
    if (err) {
      ex(err);
    }
  });
}

//call the spotify api to get a list of the followed songs
function callSpotifyApi(offset) {
  let url = spotify_search_url;
  url += "?limit=" + 50;
  url += "&offset=" + offset;

  let xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.setRequestHeader("Authorization", "Bearer " + spotify_access_token);
  xhr.send();
  xhr.onload = handleSpotifyAPIResponse;
}

function handleSpotifyAPIResponse() {
  if (this.status === 200) {
    let data = JSON.parse(this.responseText);
    createListeSpotifyTitles(data.items);
  } else {
    ex(this.responseText);
  }
}

function createListeSpotifyTitles(items) {
  let exit_function = false;
  for (x = 0; x <= items.length - 1; x++) {
    if (items[x].track.name == last_song) {
      exit_function = true;
      break;
    } else {
      spotify_song_list.song.push({
        title: items[x].track.name,
        artist: items[x].track.artists[0].name,
        ID: null,
      });
    }
  }
  if (exit_function == true || items.length != 50) {
    spotify_song_list.song = spotify_song_list.song.concat(
      spotify_song_list_temp.song
    );
    try {
      spotify_song_list.PlaylistID = spotify_song_list_temp.PlaylistID;
    } catch {
      spotify_song_list.PlaylistID = null;
    }
    storeSpotifySongList("spotify_song_list", spotify_song_list);
    startConvertion();
  } else {
    spotify_offset += 50;
    callSpotifyApi(spotify_offset);
  }
}

//get songs youtubes ids
function startConvertion() {
  let x = 0;
  while (spotify_song_list.song[x].ID === null) {
    x++;
  }
  current_song_position = x - 1;
  convertTitleToYoutubeID(current_song_position);
}

function convertTitleToYoutubeID(current_position) {
  if (current_position != -1) {
    searchYoutubeVideo(
      spotify_song_list.song[current_position].title,
      spotify_song_list.song[current_position].title
    );
  } else {
    storeSpotifySongList("spotify_song_list", spotify_song_list);
    checkIfPlaylistExist();
  }
}

function searchYoutubeVideo(current_song_title, current_song_artist) {
  let url = youtube_search_url;
  url += "?maxResults=" + 1;
  url += "&q=" + encodeURI(current_song_title + " " + current_song_artist);
  url += "&redirect_uri=" + encodeURI(redirect_uri + "/loginresponse/youtube");
  url += "&key=" + youtube_API_key;

  let xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.setRequestHeader("Authorization", "Bearer " + youtube_access_token);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send();
  xhr.onload = handleYoutubeAPISearchResponse;
}

function handleYoutubeAPISearchResponse() {
  if (this.status === 200) {
    let data = JSON.parse(this.responseText);
    if (data.items[0].id.videoId === undefined) {
      spotify_song_list.song[current_song_position].ID = "dQw4w9WgXcQ";
    } else {
      spotify_song_list.song[current_song_position].ID =
        data.items[0].id.videoId;
    }
    current_song_position--;
    if (current_song_position == -1) {
      storeSpotifySongList("spotify_song_list", spotify_song_list);
      checkIfPlaylistExist();
    } else {
      convertTitleToYoutubeID(current_song_position);
    }
  } else if (this.status === 401) {
    ex(this.responseText);
  } else if (this.status === 403) {
    ex(
      "you have exeeded your quota limit rate. Come back tomorrow and restart"
    );
  } else {
    ex(this.responseText);
  }
}

//check if the playlist as already been created
function checkIfPlaylistExist() {
  if (
    spotify_song_list.PlaylistID != null &&
    spotify_song_list.PlaylistID != undefined
  ) {
    spotify_song_list.song.reverse();
    checkYoutubePlaylistPosition(spotify_song_list.PlaylistID);
  } else {
    createYoutubePlaylist();
  }
}

//temp
//('{"snippet":{"title":"Spotify","description":"Real Good Taste"},"status":{"privacyStatus":"private"}}');

//create a playlist
function createYoutubePlaylist() {
  let body = JSON.stringify({
    snippet: { title: "Spotify", description: "Real Good Taste" },
    status: { privacyStatus: "private" },
  });
  let xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    "https://youtube.googleapis.com/youtube/v3/playlists?part=snippet%2Cstatus&key=" +
      youtube_API_key
  );
  xhr.setRequestHeader("Authorization", "Bearer " + youtube_access_token);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send(body);
  xhr.onload = handleYoutubePlaylistCreation;
}

function handleYoutubePlaylistCreation() {
  if (this.status === 200) {
    let data = JSON.parse(this.responseText);
    spotify_song_list.PlaylistID = data.id;
    storeSpotifySongList("spotify_song_list", spotify_song_list);
    spotify_song_list.song.reverse();
    checkYoutubePlaylistPosition(data.id);
  } else if (this.status === 403) {
    ex(
      "you have exeeded your quota limit rate. Come back tomorrow and restart"
    );
  } else {
    ex(this.responseText);
  }
}

//check how many song are already in the playlist
function checkYoutubePlaylistPosition(playlistsID) {
  let url =
    "https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=1&playlistId=" +
    encodeURI(playlistsID) +
    "&key=" +
    youtube_API_key;

  let xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.setRequestHeader("Authorization", "Bearer " + youtube_access_token);
  xhr.setRequestHeader("Accept", "application/json");
  xhr.send();
  xhr.onload = handleYoutubePosition;
}

function handleYoutubePosition() {
  if (this.status === 200) {
    let data = JSON.parse(this.responseText);
    let youtube_video_ID;
    try {
      youtube_video_ID = data.items[0].snippet.resourceId.videoId;
    } catch (err) {
      if (err.message === "data.items[0] is undefined") {
        youtube_add = 0;
        youtubeAddSongToPlaylist(0);
      }
    }
    youtubePlaylistPosition(youtube_video_ID);
  } else if (this.status === 403) {
    ex(
      "you have exeeded your quota limit rate. Come back tomorrow and restart"
    );
  } else {
    ex(this.responseText);
  }
}

//add the song to the playlist
function youtubePlaylistPosition(video_id) {
  for (x = spotify_song_list.song.length - 1; x >= 0; x--) {
    if (spotify_song_list.song[x].ID === video_id) {
      youtube_add = x + 1;
      break;
    }
  }
  if (youtube_add == null) {
    youtube_add = 0;
  }
  youtubeAddSongToPlaylist(youtube_add);
}

function youtubeAddSongToPlaylist(youtube_add) {
  try {
    spotify_song_list.song[youtube_add].ID;
  } catch {
    ex("your playlist is up-to-date");
  }
  let body = JSON.stringify({
    snippet: {
      playlistId: spotify_song_list.PlaylistID,
      position: 0,
      resourceId: {
        kind: "youtube#video",
        videoId: spotify_song_list.song[youtube_add].ID,
      },
    },
  });

  let url =
    "https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&key=" +
    youtube_API_key;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url);
  xhr.setRequestHeader("Authorization", "Bearer " + youtube_access_token);
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(body);
  xhr.onload = handleYoutubeAddSongToPlaylistResponse;
}

function handleYoutubeAddSongToPlaylistResponse() {
  if (this.status === 200) {
    youtube_add += 1;
    try {
      spotify_song_list.song[youtube_add].ID;
    } catch (err) {
      ex("your playlist is up-to-date");
    }
    youtubeAddSongToPlaylist(youtube_add);
  } else if (this.status === 500) {
    youtubeAddSongToPlaylist(youtube_add);
  } else if (this.status === 400) {
    let response = JSON.parse(this.responseText);
    if (response.error.message === "Precondition check failed.") {
      spotify_song_list.song[youtube_add].ID = "dQw4w9WgXcQ";
      spotify_song_list.song.reverse();
      storeSpotifySongList("spotify_song_list", spotify_song_list);
    } else {
      ex(this.responseText);
    }
  } else if (this.status === 403) {
    ex(
      "you have exeeded your quota limit rate. Come back tomorrow and restart"
    );
  } else {
    ex(this.responseText);
  }
}

//script
getYoutubeAccessToken(fetchAccessTokenYoutube);
getSpotifyAccessToken(fetchAccessTokenSpotify);
waitTokens(callSpotifyApi, spotify_offset);
