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

type playlist = {
  id: string;
  name: string;
  owner: string;
  images: image[];
};

export { token, client, image, playlist };
