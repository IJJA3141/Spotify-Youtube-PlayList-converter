import { app, BrowserWindow } from 'electron'
import http from 'http'
import { SpotifyClient, SpotifyTokenResponse } from './spotify-types'

class Token {
  private token_?: string;
  private refreshToken_?: string;
  private expired_: number = -1;
  private date_: Date;

  private server_: http.Server;
  private window_: BrowserWindow;

  private client_: SpotifyClient

  public constructor(_client: SpotifyClient) {
    this.date_ = new Date();
    this.server_ = http.createServer(() => { })
    this.window_ = new BrowserWindow({
      show: false
    })
    this.window_.webContents.on('will-redirect', (_event: any) => { this.resolve_(_event.url) })
    this.client_ = _client;
  }

  public async get(): Promise<string> {
    return new Promise<string>((_resolve) => {
      console.log('new token request')
      if (this.token_) {
        console.log('token exist')
        if (this.expired_ > this.date_.getTime()) return _resolve(this.token_)
        console.log('token need refresh')
        this.refresh_().then(() => { _resolve(this.token_ as string) })
      } else {
        console.log("token doesn't exist")
        this.fetch_().then(() => {
          _resolve(this.token_ as string)
        })
      }
    })
  }

  private async fetch_(): Promise<void> {
    let resolve = () => { }
    let promise = new Promise<void>((_resolve) => { resolve = _resolve });

    this.server_.listen(3000)

    this.window_.loadURL(`https://accounts.spotify.com/authorize?response_type=code&scope=playlist-read-private&redirect_uri=http://localhost:3000&client_id=${this.client_.id}`);
    this.window_.show()

    let code: string = await new Promise<string>((_resolve: any) => { this.resolve_ = _resolve })
    this.window_.hide()
    code = code.slice(28)

    fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${this.client_.id}:${this.client_.secret}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURI('http://localhost:3000')}&client_id=${this.client_.id}&client_secret=${this.client_.secret}`
    }).then((_res: Response) => {
      _res.json().then((_data: SpotifyTokenResponse) => {
        this.token_ = _data.access_token;
        this.refreshToken_ = _data.refresh_token;
        this.expired_ = this.date_.getTime() + 1000 * _data.expires_in
        resolve()
      })
    })

    return promise
  }

  private resolve_(_url: string) { }

  private refresh_(): Promise<void> {
    return new Promise<void>((_resolve) => {
      fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${this.client_.id}:${this.client_.secret}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: `grant_type=refresh_token&client_id=${this.client_.id}&client_secret=${this.client_.secret}&refresh_token=${this.refreshToken_}`
      }).then((_res: Response) => {
        _res.json().then((_data: SpotifyTokenResponse) => {
          this.token_ = _data.access_token;
          this.refreshToken_ = _data.refresh_token
          this.expired_ = this.date_.getTime() + 1000 * _data.expires_in;
          _resolve()
        })
      });
    })
  }
}

export default Token
