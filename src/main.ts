import { app, BrowserWindow } from 'electron'
import path from 'path'
import dotenv from 'dotenv'

import { SpotifyClient } from './spotify/spotify-types'
import Token from './spotify/token'

dotenv.config({ path: path.join(__dirname, '../appdata/.env') })

const spotifyClient: SpotifyClient = {
  id: process.env.SPOTIFY_CLIENT_ID as string,
  secret: process.env.SPOTIFY_CLIENT_SECRET as string
}

app.on('ready', () => {
  const token: Token = new Token(spotifyClient)
});
