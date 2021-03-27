import { getAssetFromKV, serveSinglePageApp } from "@cloudflare/kv-asset-handler";

addEventListener("fetch", event => {
  event.respondWith(handleEvent(event));
});



async function handleEvent(event) {
          // HTML NO BROWSER TTL
        /*  if (
            url.pathname.endsWith(".html") ||
            !url.pathname.includes(".")
        ) {
            cacheControl = {
                edgeTTL: 8640000,
                browserTTL: 0,
                mustRevalidate: true,
                public: true
            };
        } else {
            cacheControl = {
                edgeTTL: 8640000,
                browserTTL: 8640000,
                public: true
            };
        }
        const extension = url.pathname.split(".").pop();
        let immutableFiles = ["js", "css", "webp", "png", "jpg", "gif"];
        if (immutableFiles.includes(extension)) {
            cacheControl = {
                edgeTTL: 31536000,
                browserTTL: 31536000,
                public: true,
                immutable: true
            };
        }*/

  try {
    const cacheControl = {
      edgeTTL: 8640000,
      browserTTL: 8640000,
      public: true
    };
    
    const resp = await getAssetFromKV(event, { cacheControl, mapRequestToAsset: serveSinglePageApp });
    resp.headers.set("Content-Encoding", "gzip");
    return resp;
  } catch (e) {
    let pathname = new URL(event.request.url).pathname;
    return new Response(`"${pathname}" not found`, {
      status: 404,
      statusText: "not found"
    });
  }
}
