import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { fetchMediaStories, sortMediaStories } from '../../../actions/topicActions';
import composeAsyncContainer from '../../common/AsyncContainer';
import messages from '../../../resources/messages';
import StoryTable from '../StoryTable';
import DataCard from '../../common/DataCard';
import DownloadButton from '../../common/DownloadButton';

const STORIES_TO_SHOW = 10;

class MediaStoriesContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { fetchData } = this.props;
    if ((nextProps.filters !== this.props.filters) || (nextProps.sort !== this.props.sort)) {
      fetchData(nextProps);
    }
  }
  onChangeSort = (newSort) => {
    const { sortData } = this.props;
    sortData(newSort);
  }
  downloadCsv = (event) => {
    const { mediaId, topicId, filters } = this.props;
    event.preventDefault();
    const url = `/api/topics/${topicId}/media/${mediaId}/stories.csv?timespanId=${filters.timespanId}`;
    window.location = url;
  }
  render() {
    const { inlinkedStories, topicId } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <DataCard>
        <div className="actions">
          <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
        </div>
        <h2><FormattedMessage {...messages.storyPlural} /></h2>
        <StoryTable stories={inlinkedStories} topicId={topicId} onChangeSort={this.onChangeSort} />
      </DataCard>
    );
  }
}

MediaStoriesContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  // from parent
  mediaId: React.PropTypes.number.isRequired,
  topicId: React.PropTypes.number.isRequired,
  // from mergeProps
  asyncFetch: React.PropTypes.func.isRequired,
  // from fetchData
  fetchData: React.PropTypes.func.isRequired,
  sortData: React.PropTypes.func.isRequired,
  // from state
  sort: React.PropTypes.string.isRequired,
  filters: React.PropTypes.object.isRequired,
  fetchStatus: React.PropTypes.string.isRequired,
  inlinkedStories: React.PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.topics.selected.mediaSource.stories.fetchStatus,
  inlinkedStories: state.topics.selected.mediaSource.stories.stories,
  sort: state.topics.selected.mediaSource.stories.sort,
  filters: state.topics.selected.filters,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (stateProps) => {
    dispatch(fetchMediaStories(ownProps.topicId, ownProps.mediaId,
      stateProps.filters.snapshotId, stateProps.filters.timespanId, stateProps.sort,
      STORIES_TO_SHOW)); // fetch the info we need
  },
  sortData: (sort) => {
    dispatch(sortMediaStories(sort));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(stateProps);
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeAsyncContainer(
        MediaStoriesContainer
      )
    )
  );
