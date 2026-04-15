export type MusicTrack = {
  title: string;
  artist?: string;
  posterUrl?: string;
  /**
   * Direct audio file URL (mp3/m4a/ogg/wav) used for in-app playback.
   * If omitted, the track can still be listed (and opened via `url`).
   */
  audioUrl?: string;
  /**
   * Optional external link (YouTube/Spotify/etc) for the track.
   * If `audioUrl` is missing, the app will show an "Open link" action.
   */
  url?: string;
};

// Edit this list to add your own songs.
// For in-app playback you MUST provide `audioUrl` (direct .mp3/.m4a/.ogg/.wav).
// You can also add a `url` (Spotify/YouTube/SoundCloud/etc) as a source link.
export const musicTracks: MusicTrack[] = [
  {
    title: "Let the World Burn",
    posterUrl: "/m1.jpeg",
    audioUrl: "/m1.mp4",
  },
  {
    title: "Machine Touch",
    artist: "Aurora",
    posterUrl: "/m2.png",
    audioUrl: "/m2.mp4",
  },
];

