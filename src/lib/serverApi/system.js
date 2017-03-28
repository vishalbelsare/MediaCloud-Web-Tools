import { createApiPromise } from '../apiUtil';

export function systemStats() {
  return createApiPromise('/api/system-stats');
}

export const TEMP = 'TEMP'; // placeholder to remove stupid lint error
