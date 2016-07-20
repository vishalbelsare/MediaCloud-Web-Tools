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
  previousPage = () => {
    const { fetchPagedData, links } = this.props;
    fetchPagedData(this.props, links.previous);
  }
  nextPage = () => {
    const { fetchPagedData, links } = this.props;
    fetchPagedData(this.props, links.next);
  }
  downloadCsv = () => {
    const { topicId, filters, sort } = this.props;
    const url = `/api/topics/${topicId}/media.csv?snapshotId=${filters.snapshotId}&timespanId=${filters.timespanId}&sort=${sort}`;
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
              <FlatButton label={formatMessage(messages.previousPage)} primary onClick={this.previousPage} />
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
  topicId: React.PropTypes.number.isRequired,
  topicInfo: React.PropTypes.object.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  fetchPagedData: React.PropTypes.func.isRequired,
  sortData: React.PropTypes.func.isRequired,
  intl: React.PropTypes.object.isRequired,
  filters: React.PropTypes.object.isRequired,
  links: React.PropTypes.object,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.topics.selected.media.fetchStatus,
  sort: state.topics.selected.media.sort,
  media: state.topics.selected.media.media,
  links: state.topics.selected.media.links,
  filters: state.topics.selected.filters,
  topicId: state.topics.selected.id,
  topicInfo: state.topics.selected.info,
});

const mapDispatchToProps = (dispatch) => ({
  fetchPagedData: (props, linkId) => {
    if ((props.filters.snapshotId !== null) && (props.filters.timespanId !== null)) {
      dispatch(fetchTopicInfluentialMedia(props.topicId, props.filters.snapshotId,
        props.filters.timespanId, props.sort, InfluentialMediaContainer.ROWS_PER_PAGE,
        linkId));
    }
  },
  fetchData: (props) => {
    if ((props.filters.snapshotId !== null) && (props.filters.timespanId !== null)) {
      dispatch(fetchTopicInfluentialMedia(props.topicId, props.filters.snapshotId,
        props.filters.timespanId, props.sort, InfluentialMediaContainer.ROWS_PER_PAGE,
        props.links.current));
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
