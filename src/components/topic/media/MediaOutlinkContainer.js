import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { fetchMediaOutlinks, sortMediaOutlinks } from '../../../actions/topicActions';
import composeAsyncContainer from '../../common/AsyncContainer';
import messages from '../../../resources/messages';
import StoryTable from '../StoryTable';
import DataCard from '../../common/DataCard';
import DownloadButton from '../../common/DownloadButton';

const STORIES_TO_SHOW = 10;

class MediaOutlinksContainer extends React.Component {
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
    const url = `/api/topics/${topicId}/media/${mediaId}/outlinks.csv?timespanId=${filters.timespanId}`;
    window.location = url;
  }
  render() {
    const { outlinkedStories, topicId } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <DataCard>
        <div className="actions">
          <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
        </div>
        <h2><FormattedMessage {...messages.outlinks} /></h2>
        <StoryTable stories={outlinkedStories} topicId={topicId} onChangeSort={this.onChangeSort} />
      </DataCard>
    );
  }
}

MediaOutlinksContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  // from parent
  mediaId: React.PropTypes.number.isRequired,
  topicId: React.PropTypes.number.isRequired,
  // from mergeProps
  asyncFetch: React.PropTypes.func.isRequired,
  // from dispatch
  fetchData: React.PropTypes.func.isRequired,
  sortData: React.PropTypes.func.isRequired,
  // from state
  sort: React.PropTypes.string.isRequired,
  filters: React.PropTypes.object.isRequired,
  fetchStatus: React.PropTypes.string.isRequired,
  outlinkedStories: React.PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.topics.selected.mediaSource.outlinks.fetchStatus,
  outlinkedStories: state.topics.selected.mediaSource.outlinks.stories,
  sort: state.topics.selected.mediaSource.outlinks.sort,
  filters: state.topics.selected.filters,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (stateProps) => {
    dispatch(fetchMediaOutlinks(ownProps.topicId, ownProps.mediaId,
      stateProps.filters.snapshotId, stateProps.filters.timespanId, stateProps.sort,
      STORIES_TO_SHOW)); // fetch the info we need
  },
  sortData: (sort) => {
    dispatch(sortMediaOutlinks(sort));
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
        MediaOutlinksContainer
      )
    )
  );
