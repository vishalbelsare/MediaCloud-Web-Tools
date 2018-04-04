import PropTypes from 'prop-types';
import React from 'react';
import { Grid } from 'react-flexbox-grid/lib';
import { push } from 'react-router-redux';
import { injectIntl, FormattedHTMLMessage } from 'react-intl';
import { connect } from 'react-redux';
import { filteredLinkTo } from '../../util/location';
import { resetTopic, updateFeedback } from '../../../actions/topicActions';
import { WarningNotice } from '../../common/Notice';
import { getUserRoles, hasPermissions, PERMISSION_TOPIC_ADMIN } from '../../../lib/auth';
import AppButton from '../../common/AppButton';

const localMessages = {
  errorInTopicNonAdmin: { id: 'topic.create.cannotCreateTopic', defaultMessage: 'Topic is in error. Ask an admin to reset it for you.' },
  errorTooBig: { id: 'topic.error.tooBig', defaultMessage: 'Your topic is too big' },
  errorInTopic: { id: 'topic.create.cannotCreateTopic', defaultMessage: 'Sorry, but you\'ve exceed the size limit for topics you can create. That limit is {maxStories} stories total (seed stories in out database already + stories we discover while spidering). You need to make your topic smaller by editing the dates, query, or collections and sources.' },
  reset: { id: 'topic.reset', defaultMessage: 'Reset and Edit this Topic' },
  resettingInitiated: { id: 'topic.resetInitiated', defaultMessage: 'Initiated Reset...' },
  errorResetting: { id: 'topic.errorResetting', defaultMessage: 'Sorry, resetting failed.' },
};

const ResetTopicContainer = (props) => {
  const { user, topicInfo, filters, resetErrorTopic } = props;
  const { formatMessage } = props.intl;
  if (!hasPermissions(getUserRoles(user), PERMISSION_TOPIC_ADMIN)) {
    return (
      <WarningNotice><FormattedHTMLMessage {...localMessages.errorInTopicNonAdmin} /></WarningNotice>
    );
  }
  return (
    <div>
      <WarningNotice><FormattedHTMLMessage {...localMessages.errorTooBig} /></WarningNotice>
      <Grid>
        <h1><FormattedHTMLMessage {...localMessages.errorTooBig} /></h1>
        <p><FormattedHTMLMessage {...localMessages.errorInTopic} values={{ maxStories: topicInfo.max_stories }} /></p>
        <AppButton
          style={{ marginTop: 30 }}
          type="submit"
          label={formatMessage(localMessages.reset)}
          onClick={() => resetErrorTopic(topicInfo.topics_id, filters)}
          primary
        />
      </Grid>
    </div>
  );
};

ResetTopicContainer.propTypes = {
  intl: PropTypes.object.isRequired,
  user: PropTypes.object,
  topicInfo: PropTypes.object,
  resetErrorTopic: PropTypes.func.isRequired,
  filters: PropTypes.object,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.create.userRunningTopicStatus.fetchStatus,
  topicInfo: state.topics.selected.info,
  user: state.user,
  filters: state.topics.selected.filters,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  resetErrorTopic: (topicId, filters) => {
    dispatch(resetTopic(topicId))
      .then((r) => {
        if (r.topics_id) {
          const topicEditUpdateUrl = filteredLinkTo(`/topics/${r.topics_id}/editUpdate`, filters);
          return dispatch(push(topicEditUpdateUrl));
        }
        return dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.errorResetting) }));
      });
    return dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.resettingInitiated) }));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      ResetTopicContainer
    )
  );
