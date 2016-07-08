import React from 'react';
import Title from 'react-title-component';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import LoadingSpinner from '../../util/LoadingSpinner';
import CollectionInfo from './CollectionInfo';
// import ErrorTryAgain from '../../util/ErrorTryAgain';
import SourceSearchContainer from '../SourceSearchContainer';

import { fetchSourceCollectionDetails } from '../../../actions/sourceActions';
import SourceCollectionTopWordsContainer from './SourceCollectionTopWordsContainer';
import SourceCollectionSentenceCountContainer from './SourceCollectionSentenceCountContainer';
import SourceCollectionGeoContainer from './SourceCollectionGeoContainer';

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
    const { fetchStatus } = this.props;
    let { collectionId } = this.props;
    if (collectionId === null) {
      collectionId = this.props.params.sourceId;
    }
    const { formatMessage } = this.props.intl;
    const title = formatMessage(messages.collectionName);
    const titleHandler = parentTitle => `${title} | ${parentTitle}`;

    const styles = this.getStyles();
    let content = <div />;
    let subContent = <div />;

    switch (fetchStatus) {
      case fetchConstants.FETCH_SUCCEEDED:
        const { collection } = this.props;
        subContent = <CollectionInfo source={collection} />;
        let wordCloudDesc = <p>This wordcloud shows you the most commonly used words in the Collection - {collection.label} (based on a sample of sentences). Click a word to load a Dashboard search showing you how {collection.label} writes about it.</p>;
        let geoDesc = <p>Here is a heatmap of countries mentioned by {collection.label} (based on a sample of sentences). Darker countried are mentioned more. Click a country to load a Dashboard search showing you how the {collection.label} covers it.</p>;

        content = (
            <Grid style={styles.root}>
              <Row>
                <button ref="">Search Now</button><p>Use the Dashboard tool to search within the {collection.label}</p>
              </Row>
              <h2>{title}: { collection.label } </h2>
              <p style={styles.description}>{collection.description}</p>
              <p style={styles.description}>This { collection.label } collection is part of a larger set entitled {collection.tag_set_label }, which is a {collection.tag_set_description}</p>
              <Row> no health info for collections yet, sorry!
              </Row>
              <Row>
                <Col lg={6}>
                  {subContent}
                </Col>
                <Col lg={6}>
                  <Row >
                    <SourceCollectionTopWordsContainer sourceId={collection.id} sectionDescription= { wordCloudDesc } />
                  </Row>
                  <Row>
                    <SourceCollectionSentenceCountContainer sourceId={collection.id} />
                  </Row>
                   <Row>
                    <SourceCollectionGeoContainer sourceId={collection.id} sectionDescription= { geoDesc } />
                  </Row>
                </Col>

              </Row>
            </Grid>
        );

        break;
      case fetchConstants.FETCH_FAILED:
        // content = <ErrorTryAgain onTryAgain={fetchData(collectionId)} />;
        break;
      default:
        content = <LoadingSpinner />;
        break;
    }
    return (
      <Grid><div><SourceSearchContainer /></div>
      <div style={styles.root}>
        <Title render={titleHandler} />
         { content }
      </div>
      </Grid>
    );
  }
}
SourceCollectionDetailsContainer.propTypes = {
  intl: React.PropTypes.object.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  fetchStatus: React.PropTypes.string.isRequired,
  params: React.PropTypes.object.isRequired,
  collectionId: React.PropTypes.number,
  sourceInfo: React.PropTypes.object,
  collection: React.PropTypes.object,
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
