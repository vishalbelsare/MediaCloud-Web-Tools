import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import LoadingSpinner from '../common/LoadingSpinner';
import ControlBar from './controlbar/ControlBar';
// import { WarningNotice } from '../common/Notice';

const localMessages = {
  warning: { id: 'topic.filter.warning', defaultMessage: 'Please wait for the snapshot generation process to complete.' },
};
class FilteredTopicContainer extends React.Component {

  filtersAreSet() {
    const { filters, topicId } = this.props;
    return (topicId && filters.snapshotId && filters.timespanId);
  }

  render() {
    const { children, topicInfo, location, topicId, snapshots } = this.props;
    let subContent = <div />;

    // If the generation process is still ongoing, ask the user to wait a few minutes
    if (snapshots && snapshots.length < 2) {
      if (snapshots.length === 0 ||
        (snapshots.length === 1 && snapshots[0].state !== 'completed' && snapshots[0].searchable !== 1)) {
        subContent = (
          // <WarningNotice>
          <FormattedMessage {...localMessages.warning} />
          // </WarningNotice>
        );
      }
    } else if (this.filtersAreSet()) {
      subContent = children;
    } else {
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
  // from state
  filters: React.PropTypes.object.isRequired,
  topicId: React.PropTypes.number.isRequired,
  topicInfo: React.PropTypes.object.isRequired,
  snapshots: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  filters: state.topics.selected.filters,
  topicId: state.topics.selected.id,
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
