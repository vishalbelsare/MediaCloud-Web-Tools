import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import ErrorTryAgain from '../../util/ErrorTryAgain';
import LoadingSpinner from '../../util/LoadingSpinner';
import InfluentialStories from './InfluentialStories';
import { fetchTopicInfluentialStories, sortTopicInfluentialStories } from '../../../actions/topicActions';
import * as fetchConstants from '../../../lib/fetchConstants.js';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import FlatButton from 'material-ui/FlatButton';
import messages from '../../../resources/messages';
import DownloadButton from '../../util/DownloadButton';

const localMessages = {
  title: { id: 'topic.influentialStories.title', defaultMessage: 'Influential Stories' },
};

class InfluentialStoriesContainer extends React.Component {
  componentDidMount() {
    const { fetchStatus } = this.props;
    if (fetchStatus !== fetchConstants.FETCH_FAILED) {
      this.refetchData();
    }
  }
  componentWillReceiveProps(nextProps) {
    if ((nextProps.filters !== this.props.filters) ||
        (nextProps.sort !== this.props.sort)) {
      const { fetchData } = this.props;
      const { topicId } = this.props.params;
      if ((nextProps.filters.snapshotId !== null) && (nextProps.filters.timespanId !== null)) {
        fetchData(topicId, nextProps.filters.snapshotId, nextProps.filters.timespanId, nextProps.sort);
      }
    }
  }
  onChangeSort = (newSort) => {
    const { sortData } = this.props;
    sortData(newSort);
  }
  getStyles() {
    const styles = {
      contentWrapper: {
      },
      iconStyles: {
        marginRight: 24,
      },
      actionButtons: {
        float: 'right',
      },
    };
    return styles;
  }
  refetchData = () => {
    const { fetchData, filters, sort } = this.props;
    const { topicId } = this.props.params;
    fetchData(topicId, filters.snapshotId, filters.timespanId, sort);
  }
  nextPage = () => {
    const { fetchData, filters, sort, continuationId } = this.props;
    const { topicId } = this.props.params;
    fetchData(topicId, filters.snapshotId, filters.timespanId, sort, continuationId);
  }
  downloadCsv = () => {
    const { filters, sort } = this.props;
    const { topicId } = this.props.params;
    const url = `/api/topics/${topicId}/stories.csv?snapshot=${filters.snapshotId}&timespan=${filters.timespanId}&sort=${sort}`;
    window.location = url;
  }
  render() {
    const { fetchStatus, fetchData, stories, sort } = this.props;
    const { topicId } = this.props.params;
    const { formatMessage } = this.props.intl;
    let content = fetchStatus;
    const styles = this.getStyles();
    let headerContent = null;
    switch (fetchStatus) {
      case fetchConstants.FETCH_SUCCEEDED:
        headerContent = <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />;
        content = (
          <div>
            <InfluentialStories topicId={topicId} stories={stories} onChangeSort={this.onChangeSort} sortedBy={sort} />
            <FlatButton label={formatMessage(messages.nextPage)} primary onClick={this.nextPage} />
          </div>
        );
        break;
      case fetchConstants.FETCH_FAILED:
        content = <ErrorTryAgain onTryAgain={fetchData} />;
        break;
      default:
        content = <LoadingSpinner />;
    }
    return (
      <div style={styles.root}>
        <Grid>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <div style={styles.actionButtons}>
                {headerContent}
              </div>
              <h2><FormattedMessage {...localMessages.title} /></h2>
              {content}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

InfluentialStoriesContainer.ROWS_PER_PAGE = 100;

InfluentialStoriesContainer.propTypes = {
  // from context
  params: React.PropTypes.object.isRequired,       // params from router
  intl: React.PropTypes.object.isRequired,
  // from parent
  // from dispatch
  fetchData: React.PropTypes.func.isRequired,
  sortData: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  sort: React.PropTypes.string.isRequired,
  stories: React.PropTypes.array.isRequired,
  topicInfo: React.PropTypes.object.isRequired,
  filters: React.PropTypes.object.isRequired,
  continuationId: React.PropTypes.number,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.topics.selected.stories.fetchStatus,
  sort: state.topics.selected.stories.sort,
  stories: state.topics.selected.stories.stories,
  continuationId: state.topics.selected.stories.continuation_id,
  filters: state.topics.selected.filters,
  topicInfo: state.topics.selected.info,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: (topicId, snapshotId, timespanId, sort, continuationId) => {
    if ((snapshotId !== null) && (timespanId !== null)) {
      dispatch(fetchTopicInfluentialStories(topicId, snapshotId, timespanId, sort,
        InfluentialStoriesContainer.ROWS_PER_PAGE, continuationId));
    }
  },
  sortData: (sort) => {
    dispatch(sortTopicInfluentialStories(sort));
  },
});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(InfluentialStoriesContainer));
