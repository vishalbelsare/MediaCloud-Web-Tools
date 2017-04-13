import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import LoadingSpinner from '../common/LoadingSpinner';
import TopicFilterControlBar from './controlbar/TopicFilterControlBar';

class FilteredTopicContainer extends React.Component {

  snapshotIsSet() {
    const { filters, topicId } = this.props;
    return (topicId && filters.snapshotId);
  }

  render() {
    const { children, location, topicId, filters } = this.props;
    let subContent = null;
    // If the generation process is still ongoing, ask the user to wait a few minutes
    if (this.snapshotIsSet()) {
      subContent = (
        <div>
          <TopicFilterControlBar topicId={topicId} location={location} filters={filters} />
          {children}
        </div>
      );
    } else {
      // how to distinguish between fetch-ongoing and a generating snapshot?
      subContent = <LoadingSpinner />;
    }
    return (subContent);
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
