import * as fs from 'fs'

const SAVE_PATH: string = './songs.json';

interface song {
  completed: boolean;
  id: string;
}

class song_list {
  public constructor() {
    this.array_song = [];
  }

  public array_song: Array<song>;

  public async init(): Promise<void> {
    this.array_song = await this._read();

    return;
  }

  public test():void {
    this.array_song.push({"completed":true,"id":"876867"});
    return;
  }

  public save(): Promise<void> {
    return this._write();
  }

  private async _read(): Promise<Array<song>> {
    return new Promise((_resolve, _reject) => {
      fs.readFile(SAVE_PATH, 'utf-8', (_err: NodeJS.ErrnoException | null, _data: string): void => {
        if (_err) {
          console.log(`An error has occued while reading\n${_err}`);
          _reject(_err);
        } else {
          console.log(`data: ${_data}`);
          const json: any = JSON.parse(_data);
          console.log(`json: ${json}`);
          _resolve(json.songs);
        }
      });
    })
  }

  private async _write(): Promise<void> {
    return new Promise((_resolve, _reject) => {
      let str = `{"songs":[`;

      for (let _song of this.array_song) {
        str += `{"completed": ${_song.completed}, "id":"${_song.id}"},`
      }

      str = str.slice(0, -1) + ']}';

      fs.writeFile(SAVE_PATH, str, 'utf-8', (_err: NodeJS.ErrnoException | null) => {
        if (_err) {
          console.log(`An error has occued while writing\n${_err}`)
          _reject(_err);
        } else {
          _resolve();
        }
      })
    })
  }
}

export { song, song_list };
