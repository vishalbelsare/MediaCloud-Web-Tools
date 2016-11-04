import fetch from 'isomorphic-fetch';
import { createApiPromise } from './apiUtil';

export function sourceList() {
  return fetch('api/sources/list', {
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

export function collectionList() {
  return fetch('api/collections/list', {
    method: 'get',
    credentials: 'include',
  }).then(
    response => response.json()
  );
}

export function collectionSearch(wildcardString) {
  return createApiPromise(`/api/collections/${wildcardString}/search`);
}

export function sourceDetails(mediaId) {
  return fetch(`/api/sources/${mediaId}/details`, {
    method: 'get',
    credentials: 'include',
  }).then(
    response => response.json()
  );
}

export function collectionDetails(mediaId) {
  return fetch(`/api/collections/${mediaId}/details`, {
    method: 'get',
    credentials: 'include',
  }).then(
    response => response.json()
  );
}

export function sourceSentenceCount(mediaId) {
  return fetch(`api/sources/${mediaId}/sentences/count`, {
    method: 'get',
    credentials: 'include',
  }).then(
    response => response.json()
  );
}

export function collectionSentenceCount(mediaId) {
  return fetch(`api/collections/${mediaId}/sentences/count`, {
    method: 'get',
    credentials: 'include',
  }).then(
    response => response.json()
  );
}

export function sourceGeography(mediaId) {
  return fetch(`api/sources/${mediaId}/geography`, {
    method: 'get',
    credentials: 'include',
  }).then(
    response => response.json()
  );
}

export function collectionGeography(mediaId) {
  return fetch(`api/collections/${mediaId}/geography`, {
    method: 'get',
    credentials: 'include',
  }).then(
    response => response.json()
  );
}

export function sourceWordCount(mediaId) {
  return fetch(`/api/sources/${mediaId}/words`, {
    method: 'get',
    credentials: 'include',
  }).then(
    response => response.json()
  );
}

export function collectionWordCount(mediaId) {
  return fetch(`/api/collections/${mediaId}/words`, {
    method: 'get',
    credentials: 'include',
  }).then(
    response => response.json()
  );
}
