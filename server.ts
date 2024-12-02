import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";
import { Handlebars } from 'https://deno.land/x/handlebars/mod.ts';
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { Buffer } from "node:buffer";
import { getPlaylist } from "./getPlaylist.ts";
import { sortTracks } from "./sortTracks.ts";
import { createPlaylist } from "./createPlaylist.ts";
import { setTokens, getTokens } from "./tokens.ts";
import { fetchWebApi } from "./fetchWebApi.ts";

const port = 8080;
const client_id = Deno.env.get("CLIENT_ID");
const client_secret = Deno.env.get("CLIENT_SECRET");
const redirect_uri = "http://localhost:8080/callback";

const generateRandomString = (length: number) => {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

const handle = new Handlebars();

const router = new Router();
router
  .get("/", async (context) => {
    const { accessToken } = getTokens();
    if (accessToken) {
      const profile = await fetchWebApi(
        'v1/me', 'GET'
      );
      console.log(profile);

      const playlists = await fetchWebApi(
        'v1/me/playlists', 'GET'
      );
      const items = playlists.items.filter(n => n);
      console.log(items);
      
      context.response.body = await handle.renderView("index", { profile, items });
    } else {
      context.response.body = await handle.renderView("login");
    }
  })
  .get("/playlist/:id", async (context) => {
    const playlist = await getPlaylist(context.params.id);
    const sortedTracks = sortTracks(playlist.tracks?.items.map(({track}) => track));
    const uris = sortedTracks.map(({uri}) => uri)
    console.log(uris);
    const createdPlaylist = await createPlaylist(uris, playlist.name);
    console.log(createdPlaylist.name, createdPlaylist.id);
    context.response.body = {
      name: createdPlaylist.name,
      id: createdPlaylist.id
    };
  })
  .get("/login", (context) => {
    const state = generateRandomString(16);
    const scope = "user-read-private user-read-email playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public user-library-modify user-library-read";
    const authUrl = new URL("https://accounts.spotify.com/authorize")
    const params = {
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }

    authUrl.search = new URLSearchParams(params).toString();
    context.response.redirect(authUrl.toString());
  }).get("/callback", async (context) => {
    const code = context.request.url.searchParams.get('code') || null;
    const state = context.request.url.searchParams.get('state') || null;
  
    if (state === null) {
      const errorString = new URLSearchParams({
        error: 'state_mismatch'
      }).toString();
      context.response.redirect('/#' + errorString);
    } else if (code === null) {
      const errorString = new URLSearchParams({
        error: 'code_mismatch'
      }).toString();
      context.response.redirect('/#' + errorString);
    } else {
      try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
          },    
          body: new URLSearchParams({
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
          })
        });

        if (!response.ok) {
          throw new Error();
        }

        const json = await response.json();
        const access_token = json.access_token,
              refresh_token = json.refresh_token;

        setTokens(access_token, refresh_token);

        context.response.redirect('/#');
      } catch {
        const errParam = new URLSearchParams({
          error: 'invalid_token'
        }).toString();
        context.response.redirect('/#?' + errParam);
      }
    }
  }).get("/refresh_token", async (context) => {
    const refreshToken = context.request.url.searchParams.get('refresh_token') || null;

    console.log('refresh_token');    

    if (refreshToken) {
      try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
          },    
          body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken
          })
        });
  
        if (!response.ok) {
          throw new Error();
        }
        
        const json = await response.json();
        const access_token = json.access_token,
              refresh_token = json.refresh_token;
  
        setTokens(access_token, refresh_token);

        context.response.body = {
          'access_token': access_token,
          'refresh_token': refresh_token
        };
      } catch(error) {
        console.log(error);
      }
    }
  });

const app = new Application();

// router middleware
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Listening on ${port}`);
await app.listen({ port: port });
