import { app, BrowserWindow } from 'electron'
import http from 'http'
import { SpotifyClient, SpotifyTokenResponse } from './spotify-types'

class Token {
  public token: string | undefined;

  private refreshToken_: string | undefined
  private window_: BrowserWindow;
  private server_: http.Server;
  private port_: number;
  private uri_: string;
  private url_: string;
  private client_: SpotifyClient

  public constructor(_client: SpotifyClient) {
    this.client_ = _client

    this.port_ = 3000;
    this.uri_ = `http://localhost:${this.port_}`;
    this.url_ = `https://accounts.spotify.com/authorize?response_type=code&scope=playlist-read-private&redirect_uri=${this.uri_}&client_id=${this.client_.id}`

    this.server_ = http.createServer((req: any, res: any) => { })

    this.server_.listen(this.port_)

    this.window_ = new BrowserWindow({
      width: 200,
      height: 200,
      show: false,
    })

    this.window_.loadURL(this.url_)
    this.window_.show()

    this.window_.webContents.on('will-redirect', (_event: any) => { this.classBack_(_event) })
  }

  private retriveCode_(_code: string): void {
    fetch(`https://accounts.spotify.com/api/token?code=${_code}&redirect_uri=${this.uri_}&grant_type=authorization_code`, {
      headers: {
        Authorization: btoa(`${this.client_.id}:${this.client_.secret}`),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then((_res: Response) => {
        console.log(_res.body)
        /*
      _res.json().then((_data: SpotifyTokenResponse) => {
        this.token = _data.access_token,
          this.refreshToken_ = _data.refresh_token
        console.log(this.token + '\n' + this.refreshToken_)
      })*/
    })
  }

  private classBack_(_event: any): void {
    this.window_.hide()
    this.retriveCode_(_event.url.slice(this.uri_.length + '/?code='.length))
  }
}

export default Token
