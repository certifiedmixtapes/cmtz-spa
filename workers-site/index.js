import { getAssetFromKV, serveSinglePageApp } from "@cloudflare/kv-asset-handler";

addEventListener("fetch", event => {
  event.respondWith(handleEvent(event));
});

let cacheControl = {
  browserTTL: 60 * 60 * 24, // do not set cache control ttl on responses
  edgeTTL: 2 * 60 * 60 * 24, // 2 days
  bypassCache: false, // do not bypass Cloudflare's cache
}


async function handleEvent(event) {
  try {
    return await getAssetFromKV(event, { cacheControl, mapRequestToAsset: serveSinglePageApp });
  } catch (e) {
    let pathname = new URL(event.request.url).pathname;
    return new Response(`"${pathname}" not found`, {
      status: 404,
      statusText: "not found"
    });
  }
}
