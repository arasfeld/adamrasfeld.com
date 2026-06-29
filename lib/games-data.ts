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
 * Curated 100%-completed games for the showcase (2 rows of 4). Order here is the
 * display order on the page — currently sorted by playtime, biggest first. Swap
 * any appid to re-feature: every entry is just a Steam appid.
 */
export const COMPLETIONIST_SHOWCASE: number[] = [
  1245620, // Elden Ring — 111h
  1145350, // Hades II — 98h
  582160, // Assassin's Creed Origins — 87h
  489830, // The Elder Scrolls V: Skyrim Special Edition — 86h
  1145360, // Hades — 85h
  22380, // Fallout: New Vegas — 71h
  356190, // Middle-earth: Shadow of War — 56h
  1546990, // Grand Theft Auto: Vice City – The Definitive Edition — 43h
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
