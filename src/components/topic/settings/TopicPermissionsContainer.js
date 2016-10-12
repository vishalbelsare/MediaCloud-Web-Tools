import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import PermissionForm from './PermissionForm';
import { fetchPermissionsList, updatePermission } from '../../../actions/topicActions';
import composeAsyncContainer from '../../common/AsyncContainer';
import { PERMISSION_NONE } from '../../../lib/auth';

const localMessages = {
  title: { id: 'topic.permissions.title', defaultMessage: 'Permissions' },
  intro: { id: 'topic.permissions.intro', defaultMessage: 'You can control who is allowed to see, and who is allowed to edit, this Topic. Enter another user\'s email in the field below, set whether they can read or edit the topic, and then click add. Read permission allows the given user to view all data within the topic. Write permission grants read permission and also allows the user to perform all operations on the topic -- including spidering, snapshotting, and merging — other editing permissions. Admin permission grants write permission and also allows all the user to edit the permissions for the topic.' },
  existingTitle: { id: 'topic.permissions.existing.title', defaultMessage: 'Current Permissions' },
  existingIntro: { id: 'topic.permissions.existing.intro', defaultMessage: 'Here is a list of the current users and what they are allowed to do.' },
  addTitle: { id: 'topic.permissions.add', defaultMessage: 'Add Someone to this Topic' },
};

const TopicPermissionsContainer = (props) => {
  const { handleUpdatePermission, permissions, handleDelete } = props;
  return (
    <div className="topic-acl">
      <Row>
        <Col lg={12} md={12} sm={12}>
          <h2><FormattedMessage {...localMessages.title} /></h2>
          <p><FormattedMessage {...localMessages.intro} /></p>
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <h3><FormattedMessage {...localMessages.addTitle} /></h3>
        </Col>
      </Row>
      <PermissionForm form="newPermissionForm" initialValues={{ email: null, permission: null }} onSave={handleUpdatePermission} />
      <Row>
        <Col lg={12} md={12} sm={12}>
          <h3><FormattedMessage {...localMessages.existingTitle} /></h3>
          <p><FormattedMessage {...localMessages.existingIntro} /></p>
        </Col>
      </Row>
      { permissions.map((p, index) =>
        <PermissionForm
          form={`updatePermissionForm${index}`}
          key={p.email}
          initialValues={p}
          onSave={handleUpdatePermission}
          showDeleteButton
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

TopicPermissionsContainer.propTypes = {
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
  // from parent
  topicId: React.PropTypes.number,
  // from dispatch
  handleUpdatePermission: React.PropTypes.func.isRequired,
  asyncFetch: React.PropTypes.func.isRequired,
  handleDelete: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  permissions: React.PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.permissions.fetchStatus,
  permissions: state.topics.selected.permissions.list,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleUpdatePermission: (values) => {
    // save and then update the list of existing permissions
    dispatch(updatePermission(ownProps.topicId, values.email, values.permission))
      .then(() => dispatch(fetchPermissionsList(ownProps.topicId)));
  },
  handleDelete: (email) => {
    dispatch(updatePermission(ownProps.topicId, email, PERMISSION_NONE))
      .then(() => dispatch(fetchPermissionsList(ownProps.topicId)));
  },
  asyncFetch: () => {
    dispatch(fetchPermissionsList(ownProps.topicId));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncContainer(
        TopicPermissionsContainer
      )
    )
  );
