import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import Title from 'react-title-component';
import { select, fetchSourceDetails } from '../../../actions/sourceActions';
import composeAsyncContainer from '../../common/AsyncContainer';
import MediaSourceIcon from '../../common/icons/MediaSourceIcon';
import SourceBasicInfo from './SourceBasicInfo';
import CollectionList from './CollectionList';
import SourceSentenceCountContainer from './SourceSentenceCountContainer';
import SourceTopWordsContainer from './SourceTopWordsContainer';
import SourceGeographyContainer from './SourceGeographyContainer';
import messages from '../../../resources/messages';

const localMessages = {
  searchNow: { id: 'source.basicInfo.searchNow', defaultMessage: 'Search Now' },
  sourceDetailsTitle: { id: 'source.details.title', defaultMessage: 'Media Source: {name}' },
  sourceDetailsCollectionsTitle: { id: 'source.details.collections.title', defaultMessage: 'Collections' },
  sourceDetailsCollectionsIntro: { id: 'source.details.collections.intro',
    defaultMessage: 'The {name} media source is in {count, plural,\n =0 {no collections}\n =1 {one collection}\n other {# collections}\n}.',
  },
  sourceDetailsTopWordsInfo: { id: 'source.details.words.info',
    defaultMessage: 'This wordcloud shows you the most commonly used words in {name} (based on a sample of sentences). Click a word to load a Dashboard search showing you how the {name} writes about it.' },
  sourceDetailsMapInfo: { id: 'source.details.map.info',
    defaultMessage: 'Here is a heatmap of countries mentioned by {name} (based on a sample of sentences). Darker countried are mentioned more. Click a country to load a Dashboard search showing you how the {name} covers it.' },
};

const SourceDetailsContainer = (props) => {
  const { source, sourceId, handleDashboardClick, handleWordCloudClick, handleCountryClick } = props;
  const { formatMessage } = props.intl;
  const collections = source.media_source_tags.filter(c => c.show_on_media === 1);
  const filename = `SentencesOverTime-Source-${sourceId}`;
  const titleHandler = parentTitle => `${source.name} | ${parentTitle}`;
  const publicMessage = `• ${formatMessage(messages.public)}`; // for now, every media source is public
  return (
    <Grid className="details source-details">
      <Title render={titleHandler} />
      <Row>
        <Col lg={8}>
          <h1>
            <MediaSourceIcon />
            <FormattedMessage {...localMessages.sourceDetailsTitle} values={{ name: source.name }} />
            <small className="subtitle">#{sourceId} {publicMessage}</small>
          </h1>
        </Col>
        <Col lg={4}>
          <RaisedButton
            style={{ float: 'right', marginTop: 40 }}
            label={formatMessage(localMessages.searchNow)}
            primary
            onClick={handleDashboardClick}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={6} xs={12}>
          <SourceBasicInfo source={source} />
        </Col>
        <Col lg={6} xs={12}>
          <CollectionList
            title={formatMessage(localMessages.sourceDetailsCollectionsTitle)}
            intro={formatMessage(localMessages.sourceDetailsCollectionsIntro, {
              name: source.name,
              count: collections.length,
            })}
            collections={collections}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <SourceSentenceCountContainer sourceId={sourceId} filename={filename} />
        </Col>
      </Row>
      <Row>
        <Col lg={6} md={6} sm={12}>
          <SourceTopWordsContainer
            sourceId={sourceId}
            intro={formatMessage(localMessages.sourceDetailsTopWordsInfo, { name: source.name })}
            onWordClick={handleWordCloudClick}
          />
        </Col>
        <Col lg={6} md={6} sm={12}>
          <SourceGeographyContainer
            sourceId={sourceId}
            intro={formatMessage(localMessages.sourceDetailsMapInfo, { name: source.name })}
            onCountryClick={handleCountryClick}
          />
        </Col>
      </Row>
    </Grid>
  );
};

SourceDetailsContainer.propTypes = {
  intl: React.PropTypes.object.isRequired,
  // from context
  params: React.PropTypes.object.isRequired,       // params from router
  sourceId: React.PropTypes.number.isRequired,
  asyncFetch: React.PropTypes.func.isRequired,
  handleDashboardClick: React.PropTypes.func.isRequired,
  handleWordCloudClick: React.PropTypes.func.isRequired,
  handleCountryClick: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  source: React.PropTypes.object,
};

SourceDetailsContainer.contextTypes = {
  store: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  // filters: state.sources.selected.filters,
  sourceId: parseInt(ownProps.params.sourceId, 10),
  fetchStatus: state.sources.selected.details.sourceDetailsReducer.sourceDetails.fetchStatus,
  source: state.sources.selected.details.sourceDetailsReducer.sourceDetails.object,
});


const mapDispatchToProps = (dispatch, ownProps) => ({
  asyncFetch: () => {
    dispatch(select(ownProps.params.sourceId));
    dispatch(fetchSourceDetails(ownProps.params.sourceId));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    handleCountryClick: () => {
      // console.log(country);
    },
    handleDashboardClick: () => {
      const { source } = stateProps;
      window.location = `https://dashboard.mediacloud.org/#query/["*"]/[{"sources":[${ownProps.params.sourceId}]}]/["${source.health.start_date.substring(0, 10)}"]/["#{source.health.end_date.substring(0, 10)}"]/[{"uid":3,"name":"${source.name}","color":"55868A"}]`;
    },
    handleWordCloudClick: (word) => {
      const { source } = stateProps;
      const searchStr = `${word.stem}*`;
      window.location = `https://dashboard.mediacloud.org/#query/["${searchStr}"]/[{"sources":[${ownProps.params.sourceId}]}]/["${source.health.start_date.substring(0, 10)}"]/["#{source.health.end_date.substring(0, 10)}"]/[{"uid":3,"name":"${source.name}","color":"55868A"}]`;
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeAsyncContainer(
        SourceDetailsContainer
      )
    )
  );
