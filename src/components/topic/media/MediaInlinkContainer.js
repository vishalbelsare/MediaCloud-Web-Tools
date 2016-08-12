import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { fetchMediaInlinks, sortMediaInlinks } from '../../../actions/topicActions';
import composeAsyncContainer from '../../common/AsyncContainer';
import messages from '../../../resources/messages';
import StoryTable from '../StoryTable';
import DataCard from '../../common/DataCard';
import DownloadButton from '../../common/DownloadButton';

const STORIES_TO_SHOW = 10;

class MediaInlinksContainer extends React.Component {
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
    const url = `/api/topics/${topicId}/media/${mediaId}/inlinks.csv?timespanId=${filters.timespanId}`;
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
        <h2><FormattedMessage {...messages.inlinks} /></h2>
        <StoryTable stories={inlinkedStories} topicId={topicId} onChangeSort={this.onChangeSort} />
      </DataCard>
    );
  }
}

MediaInlinksContainer.propTypes = {
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
  fetchStatus: state.topics.selected.mediaSource.inlinks.fetchStatus,
  inlinkedStories: state.topics.selected.mediaSource.inlinks.stories,
  sort: state.topics.selected.mediaSource.inlinks.sort,
  filters: state.topics.selected.filters,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (stateProps) => {
    const params = {
      ...stateProps.filters,
      sort: stateProps.sort,
      limit: STORIES_TO_SHOW,
    };
    dispatch(fetchMediaInlinks(ownProps.topicId, ownProps.mediaId, params));
  },
  sortData: (sort) => {
    dispatch(sortMediaInlinks(sort));
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
        MediaInlinksContainer
      )
    )
  );
