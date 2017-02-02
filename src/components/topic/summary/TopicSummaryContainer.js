import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import LoadingSpinner from '../../common/LoadingSpinner';
import TopicInfo from './TopicInfo';
import StoriesSummaryContainer from './StoriesSummaryContainer';
import MediaSummaryContainer from './MediaSummaryContainer';
import WordsSummaryContainer from './WordsSummaryContainer';
import SentenceCountSummaryContainer from './SentenceCountSummaryContainer';
import TopicTimespanInfo from './TopicTimespanInfo';
import StoryTotalsSummaryContainer from './StoryTotalsSummaryContainer';
import DownloadMapContainer from './DownloadMapContainer';
import Permissioned from '../../common/Permissioned';
import { PERMISSION_LOGGED_IN } from '../../../lib/auth';

const localMessages = {
  title: { id: 'topic.summary.public.title',
    defaultMessage: 'Topic: {name}',
  },
};

class TopicSummaryContainer extends React.Component {
  filtersAreSet() {
    const { filters, topicId } = this.props;
    return (topicId && filters.snapshotId && filters.timespanId);
  }
  render() {
    const { filters, topicId, topicInfo, timespan, user } = this.props;
    let content = <div />;
    let subContent = <div />;
    let optTitle = null;
    if (!user.isLoggedIn || this.filtersAreSet()) {
      if (!user.isLoggedIn && topicInfo) {
        optTitle = (
          <h1><FormattedMessage {...localMessages.title} values={{ name: topicInfo.name }} /></h1>
        );
      }
      subContent = (
        <Grid>
          <Row>
            <Col lg={6} xs={12}>
              <SentenceCountSummaryContainer topicId={topicId} filters={filters} />
            </Col>
            <Col lg={6} xs={12}>
              <WordsSummaryContainer topicId={topicId} filters={filters} />
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <StoriesSummaryContainer topicId={topicId} filters={filters} />
            </Col>
          </Row>
          <Row>
            <Col lg={6} xs={12}>
              <MediaSummaryContainer topicId={topicId} filters={filters} />
            </Col>
            <Col lg={6} xs={12}>
              <TopicTimespanInfo topicId={topicId} filters={filters} timespan={timespan} />
              <Permissioned onlyRole={PERMISSION_LOGGED_IN}>
                <StoryTotalsSummaryContainer topicId={topicId} filters={filters} />
              </Permissioned>
            </Col>
          </Row>
          <Permissioned onlyRole={PERMISSION_LOGGED_IN}>
            <Row>
              <Col lg={6} xs={12}>
                <TopicInfo topic={topicInfo} />
              </Col>
              <Col lg={6} xs={12}>
                <DownloadMapContainer topicId={topicId} filters={filters} />
              </Col>
            </Row>
          </Permissioned>
        </Grid>
      );
    } else {
      subContent = <LoadingSpinner />;
    }
    content = (
      <div>
        {optTitle}
        {subContent}
      </div>
    );
    return (
      <div>
        <div>
          {content}
        </div>
      </div>
    );
  }
}

TopicSummaryContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  params: React.PropTypes.object,
  // from state
  timespan: React.PropTypes.object,
  filters: React.PropTypes.object.isRequired,
  topicId: React.PropTypes.number,
  topicInfo: React.PropTypes.object,
  user: React.PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  filters: state.topics.selected.filters,
  topicId: state.topics.selected.id,
  topicInfo: state.topics.selected.info,
  timespan: state.topics.selected.timespans.selected,
  user: state.user,
});

export default
  injectIntl(
    connect(mapStateToProps)(
      TopicSummaryContainer
    )
  );
