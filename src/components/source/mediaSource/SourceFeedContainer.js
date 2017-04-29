import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import Link from 'react-router/lib/Link';
import { push } from 'react-router-redux';
import Title from 'react-title-component';
import { fetchSourceFeeds, scrapeSourceFeeds, fetchSourceDetails } from '../../../actions/sourceActions';
import composeAsyncContainer from '../../common/AsyncContainer';
import MediaSourceIcon from '../../common/icons/MediaSourceIcon';
import SourceFeedTable from '../SourceFeedTable';
import messages from '../../../resources/messages';
import { DownloadButton, AddButton } from '../../common/IconButton';
import AppButton from '../../common/AppButton';
import Permissioned from '../../common/Permissioned';
import { PERMISSION_MEDIA_EDIT } from '../../../lib/auth';
import { updateFeedback } from '../../../actions/appActions';
import { SOURCE_SCRAPE_STATE_QUEUED, SOURCE_SCRAPE_STATE_RUNNING } from '../../../reducers/sources/sources/selected/sourceDetails';

const localMessages = {
  sourceFeedsTitle: { id: 'source.details.feeds.title', defaultMessage: '{name}: Feeds' },
  scrapeFeeds: { id: 'source.details.feeds.scrape', defaultMessage: 'Scrape for New Feeds' },
  scraping: { id: 'source.deatils.feeds.scraping', defaultMessage: 'We\'ve started to scrape this source' },
  scrapeFailed: { id: 'source.deatils.feeds.failed', defaultMessage: 'Sorry, for some reason we couldn\'t start the scraping job' },
  add: { id: 'source.deatils.feeds.add', defaultMessage: 'Add A Feed' },
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
    const { sourceId, sourceName, feeds, scrapeFeeds, pushToUrl } = this.props;
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
              <Link to={`/sources/${sourceId}`} >
                <FormattedMessage {...localMessages.sourceFeedsTitle} values={{ name: sourceName }} />
              </Link>
            </h1>
            <Permissioned onlyRole={PERMISSION_MEDIA_EDIT}>
              <AppButton
                className="source-scrape-feeds-button"
                label={formatMessage(localMessages.scrapeFeeds)}
                primary
                onClick={scrapeFeeds}
              />
            </Permissioned>
          </Col>
          <Col lg={1} xs={1}>
            <div className="actions" style={{ marginTop: 40 }} >
              <AddButton
                tooltip={formatMessage(localMessages.add)}
                onClick={() => { pushToUrl(`/sources/${sourceId}/feeds/create`); }}
              />
              <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
            </div>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
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
  scrapeFeeds: React.PropTypes.func.isRequired,
  pushToUrl: React.PropTypes.func.isRequired,
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
  sourceName: state.sources.sources.selected.sourceDetails.name,
  fetchStatus: state.sources.sources.selected.feed.feeds.fetchStatus,
  feeds: state.sources.sources.selected.feed.feeds.list,
  feedcount: state.sources.sources.selected.feed.feeds.count,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (sourceId) => {
    dispatch(fetchSourceFeeds(sourceId));
  },
  pushToUrl: url => dispatch(push(url)),
  asyncFetch: () => {
    dispatch(fetchSourceFeeds(ownProps.params.sourceId));
  },
  scrapeFeeds: () => {
    dispatch(scrapeSourceFeeds(ownProps.params.sourceId))
      .then((results) => {
        if ((results.job_state.state === SOURCE_SCRAPE_STATE_QUEUED) ||
          (results.job_state.state === SOURCE_SCRAPE_STATE_RUNNING)) {
          dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.scraping) }));
          // update the source so the user sees the new scrape status
          dispatch(fetchSourceDetails(ownProps.params.sourceId))
            .then(() => dispatch(push(`/sources/${ownProps.params.sourceId}`)));
        } else {
          dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.scrapeFailed) }));
        }
      });
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
