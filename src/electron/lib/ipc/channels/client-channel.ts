import IpcChannelInterface from "../ipc-channel-interface";
import { IpcMainEvent } from 'electron';
import IpcRequest from "../../../../shared/ipc-request";
import 'dotenv/config'

import SpotifyClient from '../../spotify/spotify-client'
import SpotifyToken from '../../../../shared/spotify-token'

const spotifyClient = new SpotifyClient();

class ClientChannel implements IpcChannelInterface {
  public getName(): string {
    return 'client';
  }

  public async handle(_event: IpcMainEvent, _request: IpcRequest):Promise<void> {
    if (!_request.responseChannel) {
      _request.responseChannel = `${this.getName()}_response`;
    }

    spotifyClient.requestToken().then((_token:SpotifyToken)=>{
      // @ts-ignore
      _event.sender.send(_request.responseChannel, { token: _token.access_token });
    })
  };
}

export default ClientChannel
