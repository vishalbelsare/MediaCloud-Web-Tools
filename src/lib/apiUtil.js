import fetch from 'isomorphic-fetch';

/**
 * Helper to stich together any defined params into a string suitable for url arg submission
 */
function generateParamStr(params) {
  const cleanedParams = {};
  Object.keys(params).forEach((key) => {
    if ({}.hasOwnProperty.call(params, key)) {
      const value = params[key];
      if ((value !== null) && (value !== undefined)) {
        cleanedParams[key] = value;
      }
    }
  });
  const paramStr = Object.keys(cleanedParams).map((key) => `${key}=${encodeURIComponent(cleanedParams[key])}`).join('&');
  return paramStr;
}

/**
 * Helper to create a promise that calls the API on the server. Pass in the endpoint url, with params
 * encoded on it already, and this will return a promise to call it with the appropriate headers and
 * such.  It also parses the json response for you.
 */
export function createApiPromise(url, params, httpMethod = 'get') {
  let fullUrl = url;
  if (params !== undefined) {
    fullUrl = `${url}?${generateParamStr(params)}`;
  }
  return fetch(fullUrl, {
    method: httpMethod,
    credentials: 'include',
  }).then(
    response => response.json()
  );
}

/**
 * Helper to create a promise that calls the API on the server with some POST'd data. Pass in the endpoint url,
 * and a data object to encode and POST, and this will return a promise to call it with the appropriate headers
 * and such.  It also parses the json response for you.
 */
export function createPostingApiPromise(url, params) {
  const formData = new FormData();
  if (params !== undefined) {
    Object.keys(params).forEach((key) => {
      if ({}.hasOwnProperty.call(params, key)) {
        formData.append(key, params[key]);
      }
    });
  }
  return fetch(url, {
    method: 'post',
    credentials: 'include',
    body: formData,
  }).then(
    response => response.json()
  );
}

/**
 * Filter the params for a list of acceptableKeys
 */
export function acceptParams(params, acceptableKeys) {
  if ((params === undefined) || (params === null)) {
    return '';
  }
  const accepted = {};
  for (const key of Object.keys(params)) {
    if (acceptableKeys.includes(key)) {
      accepted[key] = params[key];
    }
  }
  return accepted;
}
