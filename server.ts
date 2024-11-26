import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";
import { getPlaylist } from "./getPlaylist.ts";
import { sortTracks } from "./sortTracks.ts";
import { createPlaylist } from "./createPlaylist.ts";

const router = new Router();
router
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
  });

const app = new Application();

// router middleware
app.use(router.routes());
app.use(router.allowedMethods());

// static home middleware
app.use(async (context, next) => {
  try {
    await context.send({
      root: `${Deno.cwd()}/static`,
      index: "index.html",
    });
  } catch {
    await next();
  }
});

await app.listen({ port: 8080 });
