import React from 'react';
import { connect } from 'react-redux';
import { PERMISSION_READ, PERMISSION_WRITE, PERMISSION_ADMIN } from '../../lib/auth';

/**
 * Use this to restrict who is allowed to see what.
 **/
const Permissioned = (props) => {
  const { children, onlyTopic, userTopicPermission } = props;
  let allowed = false;
  if (![PERMISSION_READ, PERMISSION_WRITE, PERMISSION_ADMIN].includes(onlyTopic)) {
    const error = { message: `Invalid topic permission (${onlyTopic})` };
    throw error;
  }
  switch (onlyTopic) {
    case PERMISSION_READ:
      allowed = [PERMISSION_READ, PERMISSION_WRITE, PERMISSION_ADMIN].includes(userTopicPermission);
      break;
    case PERMISSION_WRITE:
      allowed = [PERMISSION_WRITE, PERMISSION_ADMIN].includes(userTopicPermission);
      break;
    case PERMISSION_ADMIN:
      allowed = (PERMISSION_ADMIN === userTopicPermission);
      break;
    default:
      allowed = false;
  }
  let content = null;
  if (allowed) {
    content = children;
  }
  const cssClasses = `permissioned topic-${onlyTopic}`;
  return (
    <span className={cssClasses}>
      {content}
    </span>
  );
};

Permissioned.propTypes = {
  // from parent
  children: React.PropTypes.node.isRequired,
  onlyTopic: React.PropTypes.string.isRequired,
  // from state
  userTopicPermission: React.PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  userTopicPermission: state.topics.selected.info.user_permission,
});

export default
  connect(mapStateToProps)(
    Permissioned
  );
