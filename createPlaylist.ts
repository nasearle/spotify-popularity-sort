import { fetchWebApi } from "./fetchWebApi.ts";

export async function createPlaylist(tracksUri: Array<string>, name: string){
  const { id: user_id } = await fetchWebApi('v1/me', 'GET')

  const playlist = await fetchWebApi(
    `v1/users/${user_id}/playlists`, 'POST', {
      "name": `${name} Sorted`,
      "description": `${name} sorted by song popularity`,
      "public": false
  })

  await fetchWebApi(
    `v1/playlists/${playlist.id}/tracks?uris=${tracksUri.join(',')}`,
    'POST'
  );

  return playlist;
}