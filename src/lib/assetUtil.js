
// const CDN_HOSTNAME = 'https://d2h2bu87t9cnlp.cloudfront.net';

/**
 * Pass in an absolute path to an asset, and this will return that, or a CDN hosted version of
 * it (in production mode).  `assetPath` should be something like "/static/img/logo.png".
 */
export function assetUrl(assetPath) {
  /*
  if (process.env.NODE_ENV === 'production') {
    return CDN_HOSTNAME + assetPath;
  }
  */
  return assetPath;
}

export const TEMP = 'temp';
