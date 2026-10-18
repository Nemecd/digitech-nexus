// Turns a pasted video link into an embeddable player URL.
// Supports YouTube (watch, youtu.be, shorts, live, embed) and Vimeo.
// Returns null for anything else, and the page falls back to a plain link.

function youtube(id: string): string | null {
  if (!/^[\w-]{6,}$/.test(id)) return null;
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`;
}

export function getEmbedUrl(rawUrl: string): string | null {
  let url: URL;
  try {
    url = new URL(rawUrl.trim());
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "");

  if (host === "youtu.be") {
    const id = url.pathname.slice(1).split("/")[0];
    return id ? youtube(id) : null;
  }

  if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
    if (url.pathname === "/watch") {
      const id = url.searchParams.get("v");
      return id ? youtube(id) : null;
    }
    const match = url.pathname.match(/^\/(embed|shorts|live)\/([\w-]{6,})/);
    return match ? youtube(match[2]) : null;
  }

  if (host === "vimeo.com") {
    // Unlisted Vimeo links look like vimeo.com/123456789/abcdef1234 and need the hash to play
    const match = url.pathname.match(/^\/(\d+)(?:\/([a-f0-9]+))?/);
    if (!match) return null;
    const hash = match[2] || url.searchParams.get("h");
    return `https://player.vimeo.com/video/${match[1]}${hash ? `?h=${hash}` : ""}`;
  }

  if (host === "player.vimeo.com") {
    return url.toString();
  }

  return null;
}
