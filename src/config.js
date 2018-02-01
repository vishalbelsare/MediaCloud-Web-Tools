
export const APP_SOURCE_MANAGER = 'sources';
export const APP_TOPIC_MAPPER = 'topics';
export const APP_TOOLS = 'tools';
export const APP_EXPLORER = 'explorer';

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
 * Specify a version number
 */
let version = null;
export function setVersion(newVersion) {
  version = newVersion;
}
export function getVersion() {
  return version;
}
