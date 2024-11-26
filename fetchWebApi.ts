import "jsr:@std/dotenv/load";

const token = Deno.env.get("TOKEN");
export async function fetchWebApi(endpoint: string, method: string, body?: object) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    body:JSON.stringify(body)
  });
  return await res.json();
}