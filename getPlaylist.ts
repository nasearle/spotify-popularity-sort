import { fetchWebApi } from "./fetchWebApi.ts";

export async function getPlaylist(playlistId: string){
  return (await fetchWebApi(
    `v1/playlists/${playlistId}`, 'GET'
  ));
}
