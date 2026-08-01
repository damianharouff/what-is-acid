# What is Acid? (Updated Audio)

A self-contained, static mirror of the classic YTMND site
[whatisacid.ytmnd.com](https://whatisacid.ytmnd.com/) — "What is Acid? (Updated Audio)"
by [hookinmouth](https://ytmnd.com/users/hookinmouth), created July 25, 2005
(YTMND site #103657). A spoof on the SNL "Night at the Roxbury" skit.

**Live mirror:** https://what-is-acid.cekkent.net

## Why this exists

YTMND has a habit of going down — sometimes for months at a time — and its
long-term future is perpetually uncertain. This repo preserves one small piece
of it in a form that needs nothing but a static file host, so the site keeps
working even if YTMND itself doesn't.

## Why a plain "Save Page" doesn't work

YTMND sites aren't static pages. The HTML is just a shell; a loader script
(`ytmnd_loader.js`) fetches the site's metadata from `/info/<id>/json` at
runtime, streams the foreground image and audio into temporary `blob:` URLs,
and syncs them. A browser "save page" captures the shell and a dead blob
reference — no GIF, no audio — and the JSON endpoint it depends on is now
behind a bot challenge.

This mirror (in [`public/`](public/)) fixes that:

- The original foreground GIF and MP3 were recovered from YTMND's content CDN,
  located via a 2018 Wayback Machine snapshot of the site's JSON metadata.
- A small dependency-free [`player.js`](public/assets/player.js) replaces the
  server-driven loader, reproducing the original behavior: tiled animated GIF
  and looping audio started in sync, a click-to-play screen when the browser
  blocks autoplay, the corner-triangle info bar, and the hidden restart button
  (bottom left) that re-syncs the GIF and audio using the same blob-URL swap
  trick the original used to rewind animated GIFs.
- All remote assets (score logos, restart button, favicon) are vendored, so
  the page loads with zero requests to ytmnd.com.

The original browser-saved files are kept unmodified in
`YTMND - What is Acid_ (Updated Audio)_files/` for reference.

## Running it

It's fully static — serve `public/` with anything:

```sh
cd public && python3 -m http.server 8080
```

The live mirror is deployed to Cloudflare Pages:

```sh
wrangler pages deploy public --project-name what-is-acid --branch main
```

## Credits

All creative content belongs to its original creators: the site was made by
YTMND user **hookinmouth**; the audio and imagery derive from the SNL /
"A Night at the Roxbury" sketch and Haddaway's "What Is Love". This repo
exists purely for preservation. If you own any of this content and object to
it being mirrored, open an issue.
