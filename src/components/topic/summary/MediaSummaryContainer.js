import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import MediaTable from '../MediaTable';
import { fetchTopicTopMedia, sortTopicTopMedia } from '../../../actions/topicActions';
import DataCard from '../../common/DataCard';
import ExploreButton from './ExploreButton';
import messages from '../../../resources/messages';

const localMessages = {
  title: { id: 'topic.summary.topMedia.title', defaultMessage: 'Top Media' },
};

const NUM_TO_SHOW = 10;

class MediaSummaryContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    if ((nextProps.filters !== this.props.filters) ||
        (nextProps.sort !== this.props.sort)) {
      const { fetchData } = this.props;
      fetchData(nextProps);
    }
  }
  onChangeSort = (newSort) => {
    const { sortData } = this.props;
    sortData(newSort);
  }
  refetchData = () => {
    const { topicId, filters, fetchData, sort } = this.props;
    fetchData(topicId, filters.snapshotId, filters.timespanId, sort);
  }
  render() {
    const { media, sort, topicId } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <DataCard>
        <div className="actions">
          <ExploreButton tooltip={formatMessage(messages.explore)} to={`/topics/${topicId}/media`} />
        </div>
        <h2><FormattedMessage {...localMessages.title} /></h2>
        <MediaTable media={media} onChangeSort={this.onChangeSort} sortedBy={sort} topicId={topicId} />
      </DataCard>
    );
  }
}

MediaSummaryContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  // from parent
  topicId: React.PropTypes.number.isRequired,
  filters: React.PropTypes.object.isRequired,
  // from dispatch
  fetchData: React.PropTypes.func.isRequired,
  sortData: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  sort: React.PropTypes.string.isRequired,
  media: React.PropTypes.array,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.topics.selected.summary.topMedia.fetchStatus,
  sort: state.topics.selected.summary.topMedia.sort,
  media: state.topics.selected.summary.topMedia.media,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: (props) => {
    const params = {
      ...props.filters,
      sort: props.sort,
      limit: NUM_TO_SHOW,
    };
    dispatch(fetchTopicTopMedia(props.topicId, params));
  },
  sortData: (sort) => {
    dispatch(sortTopicTopMedia(sort));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(ownProps);
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeAsyncContainer(
        MediaSummaryContainer
      )
    )
  );
