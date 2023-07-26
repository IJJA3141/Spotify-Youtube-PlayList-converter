import { BrowserWindow } from 'electron'

import { client, token, image, playlist } from '../types'

class Spotify {
  private window_: BrowserWindow
  private resolve_: any

  private token_!: token
  private userId_!: string

  public playlists: playlist[]
  private offset_: number

  private client_: client

  public constructor() {
    this.client_ = { id: process.env.SPOTIFY_CLIENT_ID as string, secret: process.env.SPOTIFY_CLIENT_SECRET as string }
    this.playlists = []

    this.window_ = new BrowserWindow({
      show: false
    })

    this.window_.webContents.on('will-redirect', ((_event: any) => { this.resolve_(_event.url) }))
    this.offset_ = 0
  }

  public async fetch(): Promise<void> {
    this.window_.loadURL(`https://accounts.spotify.com/authorize?response_type=code&scope=playlist-read-private&redirect_uri=http://localhost:3000&client_id=${this.client_.id}`)
    this.window_.show()

    const code: string = (await new Promise<string>((_resolve) => { this.resolve_ = _resolve })).slice(28)

    let res: Response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${this.client_.id}:${this.client_.secret}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURI('http://localhost:3000')}&client_id=${this.client_.id}&client_secret=${this.client_.secret}`
    })

    let data = await res.json()

    this.token_ = await data.access_token

    res = await fetch('https://api.spotify.com/v1/me', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${this.token_}` }
    })

    data = await res.json()
    this.userId_ = data.id

    await this.playlist_()

    return new Promise<void>((_resolve) => { _resolve() })
  }

  private async playlist_(): Promise<boolean> {
    const res: Response = await fetch(`https://api.spotify.com/v1/users/${this.userId_}/playlists?limit=50&offset=${this.offset_}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${this.token_}` }
    })

    const data = await res.json()

    data.items.forEach((_playlist: any) => {
      this.playlists.push({
        id: _playlist.id,
        name: _playlist.name,
        owner: _playlist.owner.display_name,
        images: _playlist.images,
      })
    });

    if (data.next === null || data.next === undefined || data.next === null) return false
    else return true
  }
}

export default Spotify
