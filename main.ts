import "jsr:@std/dotenv/load";

const playlistId = '37i9dQZEVXbnGjZ4Qqja99';

const token = Deno.env.get("TOKEN");
async function fetchWebApi(endpoint: string, method: string, body: string) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    body:JSON.stringify(body)
  });
  return await res.json();
}

async function getPlaylist(playlistId: string){
  return (await fetchWebApi(
    `v1/playlists/${playlistId}`, 'GET'
  ));
}

function sortByPopularity(tracks: Array<object>) {
  return tracks.sort((a, b) => b.popularity - a.popularity);
}

const playlist = await getPlaylist(playlistId);
const tracks = playlist.tracks?.items.map(({track}) => {
    return {uri: track.uri, popularity: track.popularity}
  });

const sortedUris = sortByPopularity(tracks);

const tracksUri = sortedUris.map(({uri}) => uri)

async function createPlaylist(tracksUri: Array<string>){
  const { id: user_id } = await fetchWebApi('v1/me', 'GET')

  const playlist = await fetchWebApi(
    `v1/users/${user_id}/playlists`, 'POST', {
      "name": "Sorted Release Radar",
      "description": "Release Radar sorted by song popularity",
      "public": false
  })

  await fetchWebApi(
    `v1/playlists/${playlist.id}/tracks?uris=${tracksUri.join(',')}`,
    'POST'
  );

  return playlist;
}

const createdPlaylist = await createPlaylist(tracksUri);
console.log(createdPlaylist.name, createdPlaylist.id);