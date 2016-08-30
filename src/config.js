
/**
 * Specify which app this should run; either 'topics' or 'sources'.
 */
let appName = null;
export function setAppName(newAppName) {
  appName = newAppName;
}
export function getAppName() {
  return appName;
}

/**
 * Specify which app this should run; either 'dev' or 'prod'.
 */
export const APP_MODE = 'dev';

/**
 * Specify a version number
 */
export const VERSION = '0.5.2';
