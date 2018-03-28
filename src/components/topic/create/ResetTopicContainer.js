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
  errorInTopic: { id: 'topic.create.cannotCreateTopic', defaultMessage: 'Topic is in error. Click the Reset button to reset and follow the prompts to correct and update your topic.' },
  reset: { id: 'topic.reset', defaultMessage: 'Reset' },
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
      <WarningNotice><FormattedHTMLMessage {...localMessages.errorInTopic} /></WarningNotice>
      <Grid>
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
  resetErrorTopic: (topicId, filters) => (
    dispatch(resetTopic(topicId))
      .then((r) => {
        if (r.topics_id) {
          const topicEditUpdateUrl = filteredLinkTo(`/topics/${r.topics_id}/editUpdate`, filters);
          dispatch(push(topicEditUpdateUrl));
        } else {
          dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.errorResetting) }));
        }
      })
  ),
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      ResetTopicContainer
    )
  );
