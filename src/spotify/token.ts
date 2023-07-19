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
    console.log('start token constructor')

    this.date_ = new Date();
    this.server_ = http.createServer(() => { })
    this.window_ = new BrowserWindow({
      show: false
    })
    this.window_.webContents.on('will-redirect', (_event: any) => { this.resolve_(_event.url) })
    this.client_ = _client;

    console.log('end token constructor')
  }

  public async get(): Promise<string> {
    console.log('start token get')

    return new Promise<string>((_resolve) => {
      if (this.token_) {
        if (this.expired_ > this.date_.getTime()) return _resolve(this.token_)
        this.refresh_().then(() => { _resolve(this.token_ as string) })
      }
      this.fetch_().then(() => {

        console.log('end token get')

        _resolve(this.token_ as string)
      })
    })
  }

  private async fetch_(): Promise<void> {
    console.log('start token fetch')

    let resolve = () => { }
    let promise = new Promise<void>((_resolve) => { _resolve = resolve });

    this.server_.listen(3000)

    this.window_.loadURL(`https://accounts.spotify.com/authorize?response_type=code&scope=playlist-read-private&redirect_uri=http://localhost:3000&client_id=${this.client_.id}`);
    this.window_.show()

    let code: string = await new Promise<string>((_resolve: any) => { _resolve = this.resolve_ })

    console.log(code)

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

    console.log('end token fetch')
    return promise
  }

  private resolve_(_url: string): string {
    console.log('recover code')

    return _url.slice(28)
  }

  private refresh_(): Promise<void> {
    console.log('start token refresh')

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

          console.log('end token refresh')

          _resolve()
        })
      });
    })
  }
}

export default Token






/*
class Token {
  private token_: string | undefined;
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

    this.window_ = new BrowserWindow({
      width: 200,
      height: 200,
      show: false,
    })
    this.window_.webContents.on('will-redirect', (_event: any) => { this.classBack_(_event) })
  }

  public async init(): Promise<void> {
    return new Promise<void>((_resolve) => {
      this.server_.listen(this.port_)
      this.window_.loadURL(this.url_)
      this.window_.show()

      _resolve();
    })
  }

  public get token() {
    return this.token_
  }

  public refresh(): void {
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
      })
    });
  }

  private retriveCode_(_code: string): void {
    fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${this.client_.id}:${this.client_.secret}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: `grant_type=authorization_code&code=${_code}&redirect_uri=${encodeURI(this.uri_)}&client_id=${this.client_.id}&client_secret=${this.client_.secret}`
    }).then((_res: Response) => {
      _res.json().then((_data: SpotifyTokenResponse) => {
        this.token_ = _data.access_token;
        this.refreshToken_ = _data.refresh_token
      })
    });
  }

  private classBack_(_event: any): void {
    this.window_.hide()

    this.retriveCode_(_event.url.slice(this.uri_.length + '/?code='.length))
  }
}
*/

