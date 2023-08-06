type token = string;

type client = {
  id: string;
  secret: string;
};

type image = {
  url: string;
  height: number;
  width: number;
};

type track = {
  artist: string;
  name:string;
  images: image[];
}

type playlist = {
  id: string;
  name: string;
  owner: string;
  images: image[];
  tracks: track[];
};

export { token, client, image, playlist, track };
