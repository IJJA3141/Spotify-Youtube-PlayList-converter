import { app, BrowserWindow } from 'electron'
import path from 'path'
import dotenv from 'dotenv'

import { SpotifyClient, SpotifyPlaylist } from './spotify/spotify-types'
import SpotifyApi from './spotify/api'

dotenv.config({ path: path.join(__dirname, '../appdata/.env') })

const spotifyClient: SpotifyClient = {
  id: process.env.SPOTIFY_CLIENT_ID as string,
  secret: process.env.SPOTIFY_CLIENT_SECRET as string
}

function sleep(ms: number): Promise<void> {
  return new Promise<void>(resolve => setTimeout(resolve, ms))
}

app.on('ready', () => {
  const API: SpotifyApi = new SpotifyApi(spotifyClient)
  API.playlists().then((_playlists: SpotifyPlaylist[]) => { console.log(_playlists) })
});
