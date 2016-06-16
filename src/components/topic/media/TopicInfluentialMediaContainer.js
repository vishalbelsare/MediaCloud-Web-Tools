import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import ErrorTryAgain from '../../util/ErrorTryAgain';
import LoadingSpinner from '../../util/LoadingSpinner';
import TopicInfluentialMedia from './TopicInfluentialMedia';
import { fetchTopicInfluentialMedia, sortTopicInfluentialMedia } from '../../../actions/topicActions';
import * as fetchConstants from '../../../lib/fetchConstants.js';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import messages from '../../../resources/messages';

const localMessages = {
  title: { id: 'topic.influentialMedia.title', defaultMessage: 'Influential Media' },
};

class TopicInfluentialMediaContainer extends React.Component {
  componentDidMount() {
    const { fetchStatus } = this.props;
    if (fetchStatus !== fetchConstants.FETCH_FAILED) {
      this.refetchData();
    }
  }
  componentWillReceiveProps(nextProps) {
    if ((nextProps.filters !== this.props.filters) ||
        (nextProps.sort !== this.props.sort)) {
      const { topicId, fetchData } = this.props;
      fetchData(topicId, nextProps.filters.snapshotId, nextProps.filters.timespanId, nextProps.sort);
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
      floatRight: {
        float: 'right',
      },
    };
    return styles;
  }
  refetchData = () => {
    const { fetchData, topicId, filters, sort } = this.props;
    fetchData(topicId, filters.snapshotId, filters.timespanId, sort);
  }
  nextPage = () => {
    const { fetchData, topicId, filters, sort, continuationId } = this.props;
    fetchData(topicId, filters.snapshotId, filters.timespanId, sort, continuationId);
  }
  downloadCsv = () => {
    const { topicId, filters, sort } = this.props;
    const url = `/api/topics/${topicId}/top-media.csv?snapshot=${filters.snapshotId}&timespan=${filters.timespanId}&sort=${sort}`;
    console.log(url);
  }
  render() {
    const { fetchStatus, fetchData, media, sort } = this.props;
    const { formatMessage } = this.props.intl;
    let content = fetchStatus;
    const styles = this.getStyles();
    switch (fetchStatus) {
      case fetchConstants.FETCH_SUCCEEDED:
        content = (
          <div>
            <div style={styles.floatRight}>
              <IconButton iconClassName="material-icons" tooltip={formatMessage(messages.download)}
                onClick={this.downloadCsv}
              >get_app
              </IconButton>
            </div>
            <TopicInfluentialMedia media={media} onChangeSort={this.onChangeSort} sortedBy={sort} />
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
            <Col lg={12}>
              <div style={styles.contentWrapper}>
                <h2><FormattedMessage {...localMessages.title} /></h2>
                {content}
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

TopicInfluentialMediaContainer.ROWS_PER_PAGE = 20;

TopicInfluentialMediaContainer.propTypes = {
  fetchStatus: React.PropTypes.string.isRequired,
  sort: React.PropTypes.string.isRequired,
  media: React.PropTypes.array.isRequired,
  params: React.PropTypes.object.isRequired,       // params from router
  topicId: React.PropTypes.number.isRequired,
  topicInfo: React.PropTypes.object.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  sortData: React.PropTypes.func.isRequired,
  intl: React.PropTypes.object.isRequired,
  filters: React.PropTypes.object.isRequired,
  continuationId: React.PropTypes.number,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.topics.selected.media.fetchStatus,
  sort: state.topics.selected.media.sort,
  media: state.topics.selected.media.media,
  continuationId: state.topics.selected.media.continuation_id,
  filters: state.topics.selected.filters,
  topicId: state.topics.selected.id,
  topicInfo: state.topics.selected.info,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: (topicId, snapshotId, timespanId, sort, continuationId) => {
    if ((snapshotId !== null) && (timespanId !== null)) {
      dispatch(fetchTopicInfluentialMedia(topicId, snapshotId, timespanId, sort,
        TopicInfluentialMediaContainer.ROWS_PER_PAGE, continuationId));
    }
  },
  sortData: (sort) => {
    dispatch(sortTopicInfluentialMedia(sort));
  },
});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(TopicInfluentialMediaContainer));
