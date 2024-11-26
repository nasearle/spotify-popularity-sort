export function sortTracks(tracks: Array<object>) {
  return tracks.sort((a, b) => b.popularity - a.popularity);
}