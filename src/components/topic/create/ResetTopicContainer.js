import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedHTMLMessage } from 'react-intl';
import { connect } from 'react-redux';
import { resetTopic } from '../../../actions/topicActions';
import { WarningNotice } from '../../common/Notice';
import { getUserRoles, hasPermissions, PERMISSION_TOPIC_ADMIN } from '../../../lib/auth';
import AppButton from '../../common/AppButton';

const localMessages = {
  errorInTopic: { id: 'topic.create.cannotCreateTopic', defaultMessage: 'Topic is in error. Ask an admin to reset it for you.' },
  reset: { id: 'topic.reset', defaultMessage: 'Reset' },
};

const ResetTopicContainer = (props) => {
  const { user, resetErrorTopic } = props;
  const { formatMessage } = props.intl;
  if (!hasPermissions(getUserRoles(user), PERMISSION_TOPIC_ADMIN)) {
    return (
      <WarningNotice><FormattedHTMLMessage {...localMessages.errorInTopic} /></WarningNotice>
    );
  }
  return (
    <AppButton
      style={{ marginTop: 30 }}
      type="submit"
      label={formatMessage(localMessages.reset)}
      onClick={resetErrorTopic}
      primary
    />
  );
};

ResetTopicContainer.propTypes = {
  intl: PropTypes.object.isRequired,
  user: PropTypes.object,
  resetErrorTopic: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.create.userRunningTopicStatus.fetchStatus,
  topicInfo: state.topics.selected.info,
  user: state.user,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  resetErrorTopic: () => {
    dispatch(resetTopic(ownProps.topicInfo));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      ResetTopicContainer
    )
  );
