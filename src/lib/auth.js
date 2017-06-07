import cookie from 'react-cookie';
import { createPostingApiPromise, acceptParams } from './apiUtil';

// persmisisons used WITHIN a topic
export const PERMISSION_TOPIC_NONE = 'none';
export const PERMISSION_TOPIC_READ = 'read';
export const PERMISSION_TOPIC_WRITE = 'write';
export const PERMISSION_TOPIC_ADMIN = 'admin';

// Roles a user can have
export const PERMISSION_LOGGED_IN = 'user';
// can do anything
export const PERMISSION_ADMIN = 'admin';
// can add and remove tags from media
export const PERMISSION_MEDIA_EDIT = 'media-edit';
// can add and remove tags from stories
export const PERMISSION_STORY_EDIT = 'story-edit';

const COOKIE_USERNAME = 'mediameter_user_username';

export function promiseToLoginWithPassword(email, password) {
  const params = { email, password };
  return createPostingApiPromise('/api/login', params);
}

export function changePassword(params) {
  const acceptedParams = acceptParams(params, ['old_password', 'new_password']);
  return createPostingApiPromise('/api/user/change_password', acceptedParams);
}

export function recoverPassword(email) {
  return createPostingApiPromise('/api/user/recover_password', email);
}

export function signupUser(params) {
  const acceptedParams = acceptParams(params, ['email', 'password', 'fullName', 'notes', 'subscribeToNewsletter']);
  return createPostingApiPromise('/api/user/signup', acceptedParams);
}

export function resendActionationEmail(email) {
  return createPostingApiPromise('/api/user/activation/resend', email);
}

export function saveCookies(email) {
  cookie.save(COOKIE_USERNAME, email);
}

export function deleteCookies() {
  cookie.remove(COOKIE_USERNAME);
}

export function hasCookies() {
  return (cookie.load(COOKIE_USERNAME) !== undefined);
}

/**
 * Returns the list of the user's roles, or null if they are not logged in
 */
export function getUserRoles(user) {
  if (('profile' in user) && ('auth_roles' in user.profile)) {
    // need to check this carefully because if they aren't logged in these sub-objects won't exist
    return user.profile.auth_roles;
  }
  return null;
}

export function hasPermissions(userRoles, targetRole) {
  let allowed = false;
  if (userRoles && userRoles.includes(PERMISSION_ADMIN)) {
    allowed = true; // because admins are allowed to do anything
  } else {
    switch (targetRole) {
      case PERMISSION_LOGGED_IN:
        allowed = userRoles !== null;
        break;
      case PERMISSION_ADMIN:
        allowed = userRoles && userRoles.includes(PERMISSION_ADMIN);
        break;
      case PERMISSION_MEDIA_EDIT:
        allowed = userRoles && userRoles.includes(PERMISSION_MEDIA_EDIT);
        break;
      case PERMISSION_STORY_EDIT:
        allowed = userRoles && userRoles.includes(PERMISSION_STORY_EDIT);
        break;
      default:
        allowed = false;
    }
  }
  return allowed;
}
