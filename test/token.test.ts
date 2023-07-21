import { SpotifyClient } from '../src/spotify/spotify-types';
import Token from '../src/spotify/token'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(__dirname, '../appdata/.env') })

describe('Token', () => {
  // Helper function to mock the token fetching
  const mockTokenFetching = (accessToken: string, expiresIn: number) => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({
        access_token: accessToken,
        refresh_token: 'mock_refresh_token',
        expires_in: expiresIn,
      }),
    });
  };

  it('should fetch the token if not available', async () => {
    const client: SpotifyClient = {
      id: process.env.SPOTIFY_CLIENT_ID as string,
      secret: process.env.SPOTIFY_CLIENT_SECRET as string
    }
    const token = new Token(client);

    const accessToken = 'mock_access_token';
    const expiresIn = 3600; // 1 hour in seconds

    // Mock token fetching
    mockTokenFetching(accessToken, expiresIn);

    const result = await token.get();
    expect(result).toBe(accessToken);
  });

  it('should use the existing token if not expired', async () => {
    const client: SpotifyClient = {
      id: process.env.SPOTIFY_CLIENT_ID as string,
      secret: process.env.SPOTIFY_CLIENT_SECRET as string
    }

    const token = new Token(client);

    const accessToken = 'mock_access_token';
    const expiresIn = 3600; // 1 hour in seconds

    // Set the token directly
    (token as any).token_ = accessToken;
    (token as any).expired_ = Date.now() + expiresIn * 1000 - 100; // Less than 1 second from expiration

    const result = await token.get();
    expect(result).toBe(accessToken);
  });

  it('should refresh the token when expired', async () => {
    const client: SpotifyClient = {
      id: process.env.SPOTIFY_CLIENT_ID as string,
      secret: process.env.SPOTIFY_CLIENT_SECRET as string
    }

    const token = new Token(client);

    const accessToken = 'mock_access_token';
    const expiresIn = 3600; // 1 hour in seconds

    // Set the token directly
    (token as any).token_ = accessToken;
    (token as any).expired_ = Date.now() - 100; // Expired

    // Mock token fetching during refresh
    mockTokenFetching('refreshed_token', expiresIn);

    const result = await token.get();
    expect(result).toBe('refreshed_token');
  });
});
