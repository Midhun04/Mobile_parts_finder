/** IDs used by home screen sections (popular brands / recent models). */
export const POPULAR_BRAND_IDS = [1, 4, 2, 7, 6, 5];
/** Upper bound for `?limit=` on /brands/popular; extra slots go to the largest brands. */
export const MAX_POPULAR_BRANDS = 24;
export const RECENT_MODEL_IDS = [46, 45, 24, 41, 14];

export const BRAND_ALIASES: Record<string, readonly string[]> = {
  xiaomi: ['Redmi', 'Poco'],
  redmi: ['Xiaomi', 'Poco'],
  poco: ['Xiaomi', 'Redmi'],
};
