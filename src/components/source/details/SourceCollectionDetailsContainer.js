import React from 'react';
import Title from 'react-title-component';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import LoadingSpinner from '../../util/LoadingSpinner';
import CollectionInfo from './CollectionInfo';
// import ErrorTryAgain from '../../util/ErrorTryAgain';
import { fetchSourceCollectionDetails } from '../../../actions/sourceActions';
// import SourceTopWordsContainer from './SourceCollectionTopWordsContainer';
// import SentenceCountContainer from './SourceCollectionSentenceCountContainer';

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
    const { fetchData, fetchStatus } = this.props;
    let { collectionId } = this.props;
    if (collectionId === null) {
      collectionId = this.props.params.sourceId;
    }
    const { formatMessage } = this.props.intl;
    const title = formatMessage(messages.collectionName);
    const titleHandler = parentTitle => `${title} | ${parentTitle}`;
    const styles = this.getStyles();
    let content = <div />;
    switch (fetchStatus) {
      case fetchConstants.FETCH_SUCCEEDED:
        const { collection } = this.props;
        content = (
          <Grid>
          <h3>Collection Id: {collectionId}</h3>
          <Row>This collection is <b> <span style={{ color: 'rgba(255, 0, 0, .6)' }}> { health.is_healthy ? ' healthy' : ' not healthy' } </span> </b>.
              </Row>
            <Row>
            <Col lg={12}>
              <h2>{title}</h2>
              <CollectionInfo source={collection.media} />;
            </Col>
            </Row>
          </Grid>
          );
        break;
      case fetchConstants.FETCH_FAILED:
        // content = <ErrorTryAgain onTryAgain={fetchData(sourceId)} />;
        break;
      default:
        content = <LoadingSpinner />;
        break;
    }
    return (
      <div style={styles.root}>
        <Title render={titleHandler} />  
         { content }
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
  collectionId: React.PropTypes.number,
  sourceInfo: React.PropTypes.object,
  sources: React.PropTypes.array,
};

SourceCollectionDetailsContainer.contextTypes = {
  store: React.PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  // filters: state.sources.selected.filters,
  fetchStatus: state.sources.selected.details.collectionDetailsReducer.collectionDetails.fetchStatus,
  collectionId: state.sources.selected.id,
  sourceInfo: state.sources.selected.info,
  collection: state.sources.selected.details.collectionDetailsReducer.collectionDetails.object,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: (sourceId) => {
    // dispatch(selectSource(sourceId));
    dispatch(fetchSourceCollectionDetails(sourceId));
  },
});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(SourceCollectionDetailsContainer));
