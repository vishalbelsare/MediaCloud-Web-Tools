import { APP_NAME } from '../config';

/**
 * The primary colors for each app
 */
export const BRAND_COLORS = {
  sources: {
    light: '#4b9fcb',
    dark: '#3c97bd',
  },
  topics: {
    light: '#daf3ee',
    dark: '#47c4ac',
  },
};

export function getBrandDarkColor() {
  return BRAND_COLORS[APP_NAME].dark;
}

export function getBrandLightColor() {
  return BRAND_COLORS[APP_NAME].light;
}
