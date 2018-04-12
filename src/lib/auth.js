
// persmisisons used WITHIN a topic
export const PERMISSION_TOPIC_NONE = 'none';
export const PERMISSION_TOPIC_READ = 'read';
export const PERMISSION_TOPIC_WRITE = 'write';
export const PERMISSION_TOPIC_ADMIN = 'admin';

// Roles a user can have
export const PERMISSION_LOGGED_IN = 'user';
export const PERMISSION_NOT_LOGGED_IN = 'anonymous';
// can do anything
export const PERMISSION_ADMIN = 'admin';
// can add and remove tags from media
export const PERMISSION_MEDIA_EDIT = 'media-edit';
// can add and remove tags from stories
export const PERMISSION_STORY_EDIT = 'story-edit';

export function logout() {
  window.location = '/api/user/logout';
}

const NO_ROLES = null;

/**
 * Returns the list of the user's roles, or NO_ROLES if they are not logged in
 */
export function getUserRoles(user) {
  if (('profile' in user) && ('auth_roles' in user.profile)) {
    // need to check this carefully because if they aren't logged in these sub-objects won't exist
    return user.profile.auth_roles;
  }
  return NO_ROLES;
}

export function hasPermissions(userRoles, targetRole) {
  let allowed = false;
  if (userRoles && userRoles.includes(PERMISSION_ADMIN)) {
    allowed = true; // because admins are allowed to do anything
  } else {
    switch (targetRole) {
      case PERMISSION_NOT_LOGGED_IN:
        allowed = userRoles === NO_ROLES;
        break;
      case PERMISSION_LOGGED_IN:
        allowed = userRoles !== NO_ROLES;
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
