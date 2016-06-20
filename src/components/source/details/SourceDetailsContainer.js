import React from 'react';
import Title from 'react-title-component';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import LoadingSpinner from '../../util/LoadingSpinner';
import SourceInfo from './SourceInfo';
// import ErrorTryAgain from '../../util/ErrorTryAgain';
import { fetchSourceDetails } from '../../../actions/sourceActions';
import SourceTopWordsContainer from './SourceTopWordsContainer';
import SentenceCountContainer from './SentenceCountContainer';
// import { Link } from 'react-router';
// import SourceSentenceCountContainer from './sourceSentenceCountContainer';

import messages from '../../../resources/messages';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
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
  render() {
    const { fetchData, fetchStatus } = this.props;
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
        const { sources } = this.props;
        const { health } = this.props.sources;
        content = <SourceInfo sources={sources} />;
        subContent = (
            <Grid>
              <h3>Source Id: {sources.media_id} </h3>
              <Row>This source is <b> <span style={{ color: 'rgba(255, 0, 0, .6)' }}> { health.is_healthy ? ' healthy' : ' not healthy' } </span> </b>.
              </Row>
              <Row>
                <ul style={styles.list}>
                  <li>Content from feedcount RSS `?`</li>
                  <li>Sentences from { health.start_date.substring(0, 10) } to { health.end_date.substring(0, 10) } </li>
                  <li>Averaging { health.num_stories_w } stories per day and { health.num_sentences_w.substring(0, 10) } sentences in the last week,</li>
                  <li>we'd guess there are { health.coverage_gaps } "gaps" in our coverage (highlighted <b><span style={{ color: 'rgba(255, 0, 0, .6)' }}> in red </span></b> on the chart), compared to the highest weekly levels we've seen</li>
                </ul>
              </Row>
              <Row>
                <Col lg={12}>
                  <h2>{title}</h2>
                  {content}
                </Col>
                <Col lg={6}>
                  <SourceTopWordsContainer sourceId={sourceId} />
                </Col>
                <Col lg={6}>
                  <SentenceCountContainer sourceId={sourceId} />
                </Col>

              </Row>
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
      <div style={styles.root}>
        <Title render={titleHandler} />
          {subContent}
      </div>
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
  sourceInfo: React.PropTypes.object,
  sources: React.PropTypes.array,
};

SourceDetailsContainer.contextTypes = {
  store: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  // filters: state.sources.selected.filters,
  sourceId: state.sources.selected.id,
  sourceInfo: state.sources.selected.info,
  fetchStatus: state.sources.selected.details.sourceDetails.fetchStatus,
  sources: state.sources.selected.details.sourceDetails.list,
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
