import React from 'react';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import Link from 'react-router/lib/Link';
import RaisedButton from 'material-ui/RaisedButton';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import Title from 'react-title-component';
import DataCard from '../../common/DataCard';
import MediaSourceIcon from '../../common/icons/MediaSourceIcon';
import CollectionList from '../../common/CollectionList';
import SourceSentenceCountContainer from './SourceSentenceCountContainer';
import SourceTopWordsContainer from './SourceTopWordsContainer';
import SourceGeographyContainer from './SourceGeographyContainer';
import messages from '../../../resources/messages';
import HealthBadge from '../HealthBadge';
import { isMetaDataTagSet } from '../../../lib/sources';


const localMessages = {
  searchNow: { id: 'source.basicInfo.searchNow', defaultMessage: 'Search on the Dashboard' },
  sourceDetailsTitle: { id: 'source.details.title', defaultMessage: 'Media Source: {name}' },
  sourceDetailsCollectionsTitle: { id: 'source.details.collections.title', defaultMessage: 'Collections' },
  sourceDetailsCollectionsIntro: { id: 'source.details.collections.intro',
    defaultMessage: 'The {name} media source is in {count, plural,\n =0 {no collections}\n =1 {one collection}\n other {# collections}\n}.',
  },

  feedInfo: { id: 'source.basicInfo.feeds',
    defaultMessage: 'Content from {feedCount, plural,\n =0 {no RSS feeds}\n =1 {one RSS feed}\n =100 {over 100 RSS feeds}\n other {# RSS feeds}}.' },
  feedLink: { id: 'source.basicInfo.feedLink', defaultMessage: 'See all feeds' },
  dateInfo: { id: 'source.basicInfo.dates', defaultMessage: 'We have collected sentences between {startDate} and {endDate}.' },
  contentInfo: { id: 'source.basicInfo.content', defaultMessage: 'Averaging {storyCount} stories per day and {sentenceCount} sentences in the last week.' },
  gapInfo: { id: 'source.basicInfo.gaps', defaultMessage: 'We\'d guess there are {gapCount} "gaps" in our coverage (highlighted in <b><span class="health-gap">in red</span></b> on the chart).  Gaps are when we were unable to collect as much content as we expected too, which means we might be missing some content for those dates.' },
  metadataLabel: { id: 'source.basicInfo.metadata', defaultMessage: 'Metadata' },
  metadataDescription: { id: 'source.basicInfo.metadataDescription', defaultMessage: '{label}' },

};

class SourceDetailsContainer extends React.Component {

  searchOnDashboard = () => {
    const { source } = this.props;
    const dashboardUrl = `https://dashboard.mediacloud.org/#query/["*"]/[{"sources":[${source.media_id}]}]/["${source.health.start_date.substring(0, 10)}"]/["${source.health.end_date.substring(0, 10)}"]/[{"uid":3,"name":"${source.name}","color":"55868A"}]`;
    window.open(dashboardUrl, '_blank');
  }

  render() {
    const { source } = this.props;
    const { formatMessage, formatNumber } = this.props.intl;
    const collections = source.media_source_tags.filter(c => c.show_on_media === 1);
    const metadata = source.media_source_tags.filter(c => (isMetaDataTagSet(c.tag_sets_id)));
    const filename = `SentencesOverTime-Source-${source.media_id}`;
    const titleHandler = parentTitle => `${source.name} | ${parentTitle}`;
    const publicMessage = ` • ${formatMessage(messages.public)} `; // for now, every media source is public
    const editMessage = ( // TODO: permissions around this
      <span className="source-edit-link">
        •&nbsp;
        <Link to={`/sources/${source.media_id}/edit`} >
          <FormattedMessage {...messages.edit} />
        </Link>
      </span>
    );
    return (
      <Grid className="details source-details">
        <Title render={titleHandler} />
        <Row>
          <Col lg={8} xs={12}>
            <h1>
              <MediaSourceIcon height={32} />
              <FormattedMessage {...localMessages.sourceDetailsTitle} values={{ name: source.name }} />
              <small className="subtitle">
                ID #{source.media_id}
                {publicMessage}
                {editMessage}
              </small>
            </h1>
            <p>
              <FormattedMessage {...localMessages.feedInfo} values={{ feedCount: source.feedCount }} />
              <Link to={`/sources/${source.media_id}/feeds`} >
                <FormattedMessage {...localMessages.feedLink} />
              </Link>
              &nbsp;
              <FormattedMessage
                {...localMessages.dateInfo}
                values={{
                  startDate: source.health.start_date.substring(0, 10),
                  endDate: source.health.end_date.substring(0, 10),
                }}
              />
              &nbsp;
              <FormattedMessage
                {...localMessages.contentInfo}
                values={{
                  storyCount: formatNumber(source.health.num_stories_w),
                  sentenceCount: formatNumber(source.health.num_sentences_w),
                }}
              />
              &nbsp;
              <FormattedHTMLMessage
                {...localMessages.gapInfo}
                values={{ gapCount: formatNumber(source.health.coverage_gaps) }}
              />
            </p>
            <RaisedButton label={formatMessage(localMessages.searchNow)} primary onClick={this.searchOnDashboard} />
          </Col>
          <Col lg={4} xs={12}>
            <HealthBadge isHealthy={source.health.is_healthy === 1} />
          </Col>
        </Row>
        <DataCard>
          <h2>
            <FormattedMessage {...localMessages.metadataLabel} />
          </h2>
          <ul>{ metadata.map(item =>
            <li>
              <FormattedMessage {...localMessages.metadataDescription} values={{ label: item.description ? item.description : item.label }} />
            </li>
          )}
          </ul>
        </DataCard>
        <Row>
          <Col lg={6} xs={12}>
            <SourceTopWordsContainer source={source} />
          </Col>
          <Col lg={6} xs={12}>
            <SourceSentenceCountContainer sourceId={source.media_id} filename={filename} />
          </Col>
        </Row>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <SourceGeographyContainer source={source} />
          </Col>
        </Row>
        <Row>
          <Col lg={6} md={6} sm={12}>
            <CollectionList
              title={formatMessage(localMessages.sourceDetailsCollectionsTitle)}
              intro={formatMessage(localMessages.sourceDetailsCollectionsIntro, {
                name: source.name,
                count: collections.length,
              })}
              collections={collections}
            />
          </Col>
          <Col lg={6} md={6} sm={12} />
        </Row>
      </Grid>
    );
  }

}

SourceDetailsContainer.propTypes = {
  intl: React.PropTypes.object.isRequired,
  // from context
  params: React.PropTypes.object.isRequired,       // params from router
  sourceId: React.PropTypes.number.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  source: React.PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  sourceId: parseInt(ownProps.params.sourceId, 10),
  fetchStatus: state.sources.selected.details.sourceDetailsReducer.sourceDetails.fetchStatus,
  source: state.sources.selected.details.sourceDetailsReducer.sourceDetails.object,
});

const mapDispatchToProps = () => ({
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      SourceDetailsContainer
    )
  );
