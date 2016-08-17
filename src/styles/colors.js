import { APP_NAME } from '../config';

/**
 * The primary colors for each app
 */
const BRAND_COLORS = {
  sources: {
    light: '#4b9fcb',
    dark: '#3c97bd',
  },
  topics: {
    light: '#daf3ee',
    dark: '#47c4ac',
  },
};

export function getBrandColors() {
  return BRAND_COLORS[APP_NAME];
}

export function getBrandDarkColor() {
  return getBrandColors().dark;
}

export function getBrandLightColor() {
  return getBrandColors().light;
}
