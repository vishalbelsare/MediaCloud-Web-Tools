import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import Link from 'react-router/lib/Link';
import Title from 'react-title-component';
import { fetchSourceFeeds } from '../../../actions/sourceActions';
import composeAsyncContainer from '../../common/AsyncContainer';
import MediaSourceIcon from '../../common/icons/MediaSourceIcon';
import SourceFeedTable from '../SourceFeedTable';
import messages from '../../../resources/messages';
import { DownloadButton } from '../../common/IconButton';

const localMessages = {
  sourceFeedsTitle: { id: 'source.details.feeds.title', defaultMessage: '{name}: Feeds' },
};

class SourceFeedContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { sourceId, fetchData } = this.props;
    if ((nextProps.sourceId !== sourceId)) {
      fetchData(nextProps.sourceId);
    }
  }
  downloadCsv = () => {
    const { sourceId } = this.props;
    const url = `/api/sources/${sourceId}/feeds/feeds.csv`;
    window.location = url;
  }

  render() {
    const { sourceId, sourceName, feeds } = this.props;
    const { formatMessage } = this.props.intl;
    const titleHandler = parentTitle => `${sourceName} | ${parentTitle}`;
    const content = null;
    if (feeds === undefined) {
      return (
        <div>
          { content }
        </div>
      );
    }
    return (
      <Grid className="details source-details">
        <Title render={titleHandler} />
        <Row>
          <Col lg={11} xs={11}>
            <h1>
              <MediaSourceIcon height={32} />
              <Link to={`/sources/${sourceId}/details`} >
                <FormattedMessage {...localMessages.sourceFeedsTitle} values={{ name: sourceName }} />
              </Link>
            </h1>
          </Col>
          <Col lg={1} xs={1}>
            <div className="actions" style={{ marginTop: 40 }} >
              <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
            </div>
          </Col>
        </Row>
        <Row>
          <Col lg={6} xs={12}>
            <SourceFeedTable feeds={feeds} />
          </Col>
        </Row>
      </Grid>
    );
  }

}

SourceFeedContainer.propTypes = {
  intl: React.PropTypes.object.isRequired,
  // from dispatch
  fetchData: React.PropTypes.func.isRequired,
  asyncFetch: React.PropTypes.func.isRequired,
  // from context
  params: React.PropTypes.object.isRequired,       // params from router
  sourceId: React.PropTypes.number.isRequired,
  sourceName: React.PropTypes.string.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  source: React.PropTypes.object,
  feeds: React.PropTypes.array,
  feedcount: React.PropTypes.number,
};

const mapStateToProps = (state, ownProps) => ({
  sourceId: parseInt(ownProps.params.sourceId, 10),
  sourceName: state.sources.selected.details.sourceDetailsReducer.sourceDetails.object.name,
  fetchStatus: state.sources.selected.details.sourceDetailsReducer.feed.fetchStatus,
  feeds: state.sources.selected.details.sourceDetailsReducer.feed.list,
  feedcount: state.sources.selected.details.sourceDetailsReducer.feed.count,
});


const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (sourceId) => {
    dispatch(fetchSourceFeeds(sourceId));
  },
  asyncFetch: () => {
    dispatch(fetchSourceFeeds(ownProps.params.sourceId));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncContainer(
        SourceFeedContainer
      )
    )
  );
