import { createApiPromise } from '../apiUtil';

export function storyDetails(storyId) {
  return createApiPromise(`/api/stories/${storyId}`);
}

export function storyEntities(storyId) {
  return createApiPromise(`/api/stories/${storyId}/entities`);
}

export function storyNytThemes(storyId) {
  return createApiPromise(`/api/stories/${storyId}/nyt-themes`);
}
