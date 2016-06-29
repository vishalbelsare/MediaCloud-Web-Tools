import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncWidget from '../../util/composeAsyncWidget';
import TopicTopMedia from './TopicTopMedia';
import { fetchTopicTopMedia, sortTopicTopMedia } from '../../../actions/topicActions';
import Paper from 'material-ui/Paper';

const localMessages = {
  title: { id: 'topic.summary.topMedia.title', defaultMessage: 'Top Media' },
};

class TopicTopMediaContainer extends React.Component {
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
  getStyles() {
    const styles = {
      contentWrapper: {
        padding: 10,
      },
    };
    return styles;
  }
  refetchData = () => {
    const { topicId, filters, fetchData, sort } = this.props;
    fetchData(topicId, filters.snapshotId, filters.timespanId, sort);
  }
  render() {
    const { media, sort, topicId } = this.props;
    const styles = this.getStyles();
    return (
      <div style={styles.root}>
        <Paper>
          <div style={styles.contentWrapper}>
            <h2><FormattedMessage {...localMessages.title} /></h2>
            <TopicTopMedia media={media} topicId={topicId} onChangeSort={this.onChangeSort} sortedBy={sort} />
          </div>
        </Paper>
      </div>
    );
  }
}

TopicTopMediaContainer.propTypes = {
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

const mapDispatchToProps = (dispatch, ownProps) => ({
  asyncFetch: () => {
    dispatch(fetchTopicTopMedia(ownProps.topicId, ownProps.filters.snapshotId, ownProps.filters.timespanId));
  },
  fetchData: (props) => {
    dispatch(fetchTopicTopMedia(props.topicId, props.filters.snapshotId, props.filters.timespanId, props.sort));
  },
  sortData: (sort) => {
    dispatch(sortTopicTopMedia(sort));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncWidget(
        TopicTopMediaContainer
      )
    )
  );
