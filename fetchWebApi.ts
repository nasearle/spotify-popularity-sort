import "jsr:@std/dotenv/load";
import { getTokens } from "./tokens.ts";

export async function fetchWebApi(endpoint: string, method: string, body?: object) {
  const { accessToken } = getTokens();
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method,
    body:JSON.stringify(body)
  });
  return await res.json();
}