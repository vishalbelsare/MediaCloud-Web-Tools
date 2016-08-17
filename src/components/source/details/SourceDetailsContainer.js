import React from 'react';
import Title from 'react-title-component';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import FlatButton from 'material-ui/FlatButton';
import LoadingSpinner from '../../common/LoadingSpinner';
import SourceInfo from './SourceInfo';
// import ErrorTryAgain from '../../common/ErrorTryAgain';
import { fetchSourceDetails } from '../../../actions/sourceActions';
import SourceSearchContainer from '../SourceSearchContainer';
import SourceTopWordsContainer from './SourceTopWordsContainer';
import SentenceCountContainer from './SentenceCountContainer';
import SourceGeoContainer from './SourceGeoContainer';
import messages from '../../../resources/messages';
import * as fetchConstants from '../../../lib/fetchConstants.js';


class SourceDetailsContainer extends React.Component {
  componentDidMount() {
    const { params, fetchData } = this.props;
    fetchData(params.sourceId);
  }
  getStyles() {
    const styles = {
      root: {
      },
      row: {
        marginBottom: 15,
      },
      list: {
        listStyleType: 'none',
      },
    };
    return styles;
  }
  gotoDashboard() {
    alert('will go to dashboard');
  }
  render() {
    const { fetchStatus } = this.props;
    let { sourceId } = this.props;
    if (sourceId === null) {
      sourceId = this.props.params.sourceId;
    }
    const { formatMessage } = this.props.intl;
    const title = formatMessage(messages.sourceName);
    const titleHandler = parentTitle => `${title} | ${parentTitle}`;
    const styles = this.getStyles();
    let content = <div />;
    let subContent = <div />;


    switch (fetchStatus) {
      case fetchConstants.FETCH_SUCCEEDED:
        const { source } = this.props;
        const { health } = this.props.source;
        subContent = <SourceInfo sources={source} />;
        let wordCloudDesc = <p>This wordcloud shows you the most commonly used words in {source.name} (based on a sample of sentences). Click a word to load a Dashboard search showing you how {source.name} writes about it.</p>;
        let geoDesc = <p>Here is a heatmap of countries mentioned by {source.name} (based on a sample of sentences). Darker countried are mentioned more. Click a country to load a Dashboard search showing you how the {source.name} covers it.</p>;

        content = (
          <Grid>
            <div>
              <Row>
                <Col lg={8}>
                  <h2>Media Source: {source.name} </h2>
                </Col>
                <Col lg={4}>
                  <h2>#{source.id} </h2>
                </Col>
              </Row>
              <Row>
                <FlatButton label="Search Now" primary onClick={this.gotoDashboard} /><p>Use the Dashboard tool to search within the {source.name}</p>
              </Row>
              <Row>This source is <b> { health.is_healthy === 1 ? <span style={{ color: 'rgba(0, 255, 0, .6)' }}> healthy </span> : <span style={{ color: 'rgba(255, 0, 0, .6)' }}> not healthy </span> }</b>.
              </Row>
              <Row>
                <ul style={styles.list}>
                  <li>Content from { source.feedCount >= 100 ? 'more than 100' : source.feedCount } RSS { source.feedCount > 1 ? 'feeds' : 'feed' } </li>
                  <li>Sentences from { health.start_date.substring(0, 10) } to { health.end_date.substring(0, 10) } </li>
                  <li>Averaging { health.num_stories_w } stories per day and { health.num_sentences_w.substring(0, 10) } sentences in the last week,</li>
                  <li>we'd guess there are { health.coverage_gaps } "gaps" in our coverage (highlighted <b><span style={{ color: 'rgba(255, 0, 0, .6)' }}> in red </span></b> on the chart), compared to the highest weekly levels we've seen</li>
                </ul>
              </Row>
              <Row>
                <Col lg={12}>
                  {subContent}
                </Col>
                <Col lg={6}>
                  <SourceTopWordsContainer sourceId={source.id} sectionDescription={wordCloudDesc} />
                </Col>
                <Col lg={6}>
                  <SentenceCountContainer sourceId={source.id} />
                </Col>
                <Col lg={6}>
                  <SourceGeoContainer sourceId={source.id} sectionDescription={geoDesc} />
                </Col>
              </Row>
            </div>
          </Grid>
        );
        break;
      case fetchConstants.FETCH_FAILED:
        // this causes a render warning to not try to setState while in error - no dispatching either
        break;
      default:
        content = <LoadingSpinner />;
    }
    return (
      <Grid>
        <div><SourceSearchContainer /></div>
        <div style={styles.root}>
          <Title render={titleHandler} />
            {content}
        </div>
      </Grid>
    );
  }
}

SourceDetailsContainer.propTypes = {
  intl: React.PropTypes.object.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  fetchStatus: React.PropTypes.string.isRequired,
 // filters: React.PropTypes.object.isRequired,
  params: React.PropTypes.object.isRequired,       // params from router
  sourceId: React.PropTypes.string,
  source: React.PropTypes.object,
};

SourceDetailsContainer.contextTypes = {
  store: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  // filters: state.sources.selected.filters,
  sourceId: state.sources.selected.id,
  fetchStatus: state.sources.selected.details.sourceDetailsReducer.sourceDetails.fetchStatus,
  source: state.sources.selected.details.sourceDetailsReducer.sourceDetails.object,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: (sourceId) => {
    // dispatch(selectSource(sourceId));
    dispatch(fetchSourceDetails(sourceId));
  },
});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(SourceDetailsContainer));
