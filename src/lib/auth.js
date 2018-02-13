import Cookies from 'universal-cookie';

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

const COOKIE_USERNAME = 'mc_username';
const COOKIE_DOMAIN = document.appConfig.cookieDomain;

const cookiesContext = new Cookies();

export function saveCookies(username) {
  // note: this is actually your email address, since username is email in our system
  cookiesContext.set(COOKIE_USERNAME, username, { domain: COOKIE_DOMAIN });
}

export function deleteCookies() {
  cookiesContext.remove(COOKIE_USERNAME, { domain: COOKIE_DOMAIN });
}

export function logout() {
  deleteCookies();
  window.location = '/api/user/logout';
}

export function hasCookies() {
  const hasUsernameCookie = (cookiesContext.get(COOKIE_USERNAME) !== undefined);
  return hasUsernameCookie;
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
