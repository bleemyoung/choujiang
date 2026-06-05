import { useHashLocation as wouterUseHashLocation } from "wouter/use-hash-location";

/**
 * Wraps wouter's useHashLocation to strip query parameters from the path.
 *
 * wouter v3's useHashLocation returns the full hash including query string
 * (e.g. "/admin?controlled=1"), but route matching uses exact-path regex
 * that doesn't match when a query string is present.
 *
 * This wrapper strips "?..." from the path so routes match correctly,
 * while preserving the hash in the URL for AdminPage's controlled-mode detection.
 */
function patchedHashLocation(opts?: any): ReturnType<typeof wouterUseHashLocation> {
  const [loc, nav] = wouterUseHashLocation(opts as any);
  const pathOnly = typeof loc === "string" ? loc.split("?")[0] : loc;
  return [pathOnly, nav];
}

// Copy the hrefs helper from wouter's original hook (used by <Link> etc.)
patchedHashLocation.hrefs = (wouterUseHashLocation as any).hrefs;

export const useHashLocation = patchedHashLocation as typeof wouterUseHashLocation;
