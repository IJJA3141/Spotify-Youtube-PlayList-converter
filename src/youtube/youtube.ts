import { client } from './../types'

const youtubeClient: client = { id: process.env.YOUTUBE_CLIENT_ID as string, secret: process.env.YOUTUBE_CLIENT_SECRET as string }
