/**
 * Curated Steam content — the parts that aren't cheaply derivable from a single
 * live API call. Edit this file to re-curate the showcase or bump the headline
 * completionist totals.
 *
 * Finding an appid: open the game's Steam store page; the number in the URL is
 * the appid (e.g. store.steampowered.com/app/1245620 → Elden Ring). The page
 * degrades gracefully — any appid whose achievements can't be fetched (wrong id,
 * private stats, no achievements) is simply skipped.
 */

/**
 * App IDs mirrored from Adam's Steam "Completionist Showcase". Order here is the
 * display order on the page.
 */
export const COMPLETIONIST_SHOWCASE: number[] = [
  1245620, // Elden Ring
  22380, // Fallout: New Vegas
  356190, // Middle-earth: Shadow of War
  1145350, // Hades II
  // TODO(adam): verify/add the remaining showcase appids:
  //   - Grand Theft Auto: Vice City – The Definitive Edition
  //   - <the sixth featured game whose capsule art hadn't loaded in the screenshot>
];

/**
 * Headline completionist totals as shown on the Steam profile. These would
 * require iterating the entire ~287-game library to compute live, so they're
 * curated here and updated by hand when they change.
 */
export const STEAM_TOTALS = {
  perfectGames: 43,
  achievementsInPerfectGames: 1706,
};
