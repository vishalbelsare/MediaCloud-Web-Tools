import fetch from 'isomorphic-fetch';

export function sourceList() {
  return fetch('api/sources/source/list', {
    method: 'get',
    credentials: 'include',
  }).then(
    response => response.json()
  );
}

export function sourceSearch(wildcardString) {
  return fetch(`api/sources/${wildcardString}/search`, {
    method: 'get',
    credentials: 'include',
  }).then(
    response => response.json()
  );
}

export function sourceCollectionList() {
  return fetch('api/sources/collection/list', {
    method: 'get',
    credentials: 'include',
  }).then(
    response => response.json()
  );
}

export function sourceDetails(mediaId) {
  return fetch(`/api/sources/media-source/${mediaId}/details`, {
    method: 'get',
    credentials: 'include',
  }).then(
    response => response.json()
  );
}

export function sourceCollectionDetails(mediaId) {
  return fetch(`/api/sources/collection/${mediaId}/details`, {
    method: 'get',
    credentials: 'include',
  }).then(
    response => response.json()
  );
}

export function sourceSentenceCount(mediaId) {
  return fetch(`api/sources/media-source/${mediaId}/sentences/count`, {
    method: 'get',
    credentials: 'include',
  }).then(
    response => response.json()
  );
}

export function sourceCollectionSentenceCount(mediaId) {
  return fetch(`api/sources/collection/${mediaId}/sentences/count`, {
    method: 'get',
    credentials: 'include',
  }).then(
    response => response.json()
  );
}

export function sourceGeography(mediaId) {
  return fetch(`api/sources/media-source/${mediaId}/geography`, {
    method: 'get',
    credentials: 'include',
  }).then(
    response => response.json()
  );
}

export function sourceCollectionGeography(mediaId) {
  return fetch(`api/sources/media-tag/${mediaId}/geography`, {
    method: 'get',
    credentials: 'include',
  }).then(
    response => response.json()
  );
}

export function sourceWordCount(mediaId) {
  return fetch(`/api/sources/media-source/${mediaId}/words`, {
    method: 'get',
    credentials: 'include',
  }).then(
    response => response.json()
  );
}

export function sourceCollectionWordCount(mediaId) {
  return fetch(`/api/sources/media-tag/${mediaId}/words`, {
    method: 'get',
    credentials: 'include',
  }).then(
    response => response.json()
  );
}
