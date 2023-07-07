import 'dotenv'

interface client{
  id:string;
  secret:string;
}

const CLIENT:client = {
  id:process.env.SPOTIFY_CLIENT_ID as string,
  secret: process.env.SPOTIFY_CLIENT_SECRET as string
}

export default CLIENT
