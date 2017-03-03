import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import LoadingSpinner from '../common/LoadingSpinner';
import ControlBar from './controlbar/ControlBar';
import { WarningNotice } from '../common/Notice';
import * as fetchConstants from '../../lib/fetchConstants';

const localMessages = {
  warning: { id: 'topic.filter.warning', defaultMessage: 'Please wait for the snapshot generation process to complete.' },
};
class FilteredTopicContainer extends React.Component {

  filtersAreSet() {
    const { filters, topicId } = this.props;
    return (topicId && filters.snapshotId && filters.timespanId);
  }

  snapshotsAreCompletedAndSearchable() {
    const { snapshots } = this.props;
    return ((snapshots && snapshots.length > 1) ||
        (snapshots.length === 1 &&
         (snapshots[0].state === 'completed' && snapshots[0].searchable === 1)));
  }
  render() {
    const { children, topicInfo, location, topicId, fetchStatus } = this.props;
    let subContent = <div />;

    // If the generation process is still ongoing, ask the user to wait a few minutes
    if (this.filtersAreSet() || this.snapshotsAreCompletedAndSearchable()) {
      subContent = children;
    } else if (!this.snapshotsAreCompletedAndSearchable() && fetchStatus === fetchConstants.FETCH_SUCCEEDED) {
      subContent = (
        <WarningNotice>
          <FormattedMessage {...localMessages.warning} />
        </WarningNotice>
      );
    } else {
      // how to distinguish between fetch-ongoing and a generating snapshot?
      subContent = <LoadingSpinner />;
    }
    return (
      <div>
        <ControlBar topicId={topicId} title={topicInfo.name} location={location} />
        {subContent}
      </div>
    );
  }

}

FilteredTopicContainer.propTypes = {
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
  children: React.PropTypes.node,
  location: React.PropTypes.object.isRequired,
  params: React.PropTypes.object.isRequired,
  fetchStatus: React.PropTypes.string,
  // from state
  filters: React.PropTypes.object.isRequired,
  topicId: React.PropTypes.number.isRequired,
  topicInfo: React.PropTypes.object.isRequired,
  snapshots: React.PropTypes.array.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  filters: state.topics.selected.filters,
  topicId: state.topics.selected.id,
  fetchStatus: state.topics.selected.snapshots.fetchStatus,
  topicInfo: state.topics.selected.info,
  params: ownProps.params,
  snapshots: state.topics.selected.snapshots.list,
});

export default
  injectIntl(
    connect(mapStateToProps)(
      FilteredTopicContainer
    )
  );
