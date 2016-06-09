import React from 'react';
import Title from 'react-title-component';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import LoadingSpinner from '../../util/LoadingSpinner';
import SourceInfo from './SourceInfo';
// import ErrorTryAgain from '../../util/ErrorTryAgain';
import { selectSource, fetchSourceCollectionDetails } from '../../../actions/sourceActions';
// import SourceTopWordsContainer from './SourceTopWordsContainer';
// import SentenceCountContainer from './SentenceCountContainer';
// import SourceSentenceCountContainer from './sourceSentenceCountContainer';
import messages from '../../../resources/messages';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import * as fetchConstants from '../../../lib/fetchConstants.js';

class SourceCollectionDetailsContainer extends React.Component {
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
    };
    return styles;
  }
  render() {
    const { sourceId, sources, fetchData, fetchStatus } = this.props;
    const { formatMessage } = this.props.intl;
    const title = formatMessage(messages.sourceName);
    const titleHandler = parentTitle => `${title} | ${parentTitle}`;
    const styles = this.getStyles();
    let content = <div />;
    switch (fetchStatus) {
      case fetchConstants.FETCH_SUCCEEDED:
        content = <SourceInfo source={sources} />;
        break;
      case fetchConstants.FETCH_FAILED:
        // content = <ErrorTryAgain onTryAgain={fetchData(sourceId)} />;
        break;
      default:
        content = <LoadingSpinner />;
    }
    return (
      <div style={styles.root}>
        <Title render={titleHandler} />
        <Grid>
          <Row>
            <Col lg={12}>
              <h2>{title}</h2>
              {content}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
SourceCollectionDetailsContainer.propTypes = {
  intl: React.PropTypes.object.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  fetchStatus: React.PropTypes.string.isRequired,
  // filters: React.PropTypes.object.isRequired,
  params: React.PropTypes.object.isRequired,
  sourceId: React.PropTypes.number,
  sourceInfo: React.PropTypes.object,
  sources: React.PropTypes.object,
};

const mapStateToProps = (state) => ({
  // filters: state.sources.selected.filters,
  fetchStatus: state.sources.selected.details.collectionDetails.fetchStatus,
  sourceId: state.sources.selected.id,
  sourceInfo: state.sources.selected.info,
  sources: state.sources.selected.details.collectionDetails.list,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: (sourceId) => {
    dispatch(selectSource(sourceId));
    dispatch(fetchSourceCollectionDetails(sourceId));
  },
});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(SourceCollectionDetailsContainer));
