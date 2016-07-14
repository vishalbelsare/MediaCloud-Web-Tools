import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import MediaTable from '../MediaTable';
import { fetchTopicInfluentialMedia, sortTopicInfluentialMedia } from '../../../actions/topicActions';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import FlatButton from 'material-ui/FlatButton';
import DownloadButton from '../../common/DownloadButton';
import messages from '../../../resources/messages';
import DataCard from '../../common/DataCard';
import composeAsyncWidget from '../../util/composeAsyncWidget';

const localMessages = {
  title: { id: 'topic.influentialMedia.title', defaultMessage: 'Influential Media' },
};

class InfluentialMediaContainer extends React.Component {
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
  refetchData = () => {
    const { fetchData } = this.props;
    fetchData(this.props);
  }
  nextPage = () => {
    const { fetchData, topicId, filters, sort, continuationId } = this.props;
    fetchData(topicId, filters.snapshotId, filters.timespanId, sort, continuationId);
  }
  downloadCsv = () => {
    const { topicId, filters, sort } = this.props;
    const url = `/api/topics/${topicId}/media.csv?snapshot=${filters.snapshotId}&timespan=${filters.timespanId}&sort=${sort}`;
    window.location = url;
  }
  render() {
    const { media, sort, topicId } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <Grid>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <DataCard>
              <div className="actions">
                <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
              </div>
              <h2><FormattedMessage {...localMessages.title} /></h2>
              <MediaTable media={media} topicId={topicId} onChangeSort={this.onChangeSort} sortedBy={sort} />
              <FlatButton label={formatMessage(messages.nextPage)} primary onClick={this.nextPage} />
            </DataCard>
          </Col>
        </Row>
      </Grid>
    );
  }
}

InfluentialMediaContainer.ROWS_PER_PAGE = 50;

InfluentialMediaContainer.propTypes = {
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
  fetchData: (props) => {
    if ((props.filters.snapshotId !== null) && (props.filters.timespanId !== null)) {
      dispatch(fetchTopicInfluentialMedia(props.topicId, props.filters.snapshotId,
        props.filters.timespanId, props.sort, InfluentialMediaContainer.ROWS_PER_PAGE,
        props.continuationId));
    }
  },
  sortData: (sort) => {
    dispatch(sortTopicInfluentialMedia(sort));
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
      composeAsyncWidget(
        InfluentialMediaContainer
      )
    )
  );
