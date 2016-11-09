import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import Title from 'react-title-component';
import RaisedButton from 'material-ui/RaisedButton';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { select, fetchCollectionDetails } from '../../../actions/sourceActions';
import composeAsyncContainer from '../../common/AsyncContainer';
import CollectionBasicInfo from './CollectionBasicInfo';
import SourceList from './SourceList';
import CollectionSentenceCountContainer from './CollectionSentenceCountContainer';
import CollectionTopWordsContainer from './CollectionTopWordsContainer';
import CollectionGeographyContainer from './CollectionGeographyContainer';
import CollectionSourceRepresentation from './CollectionSourceRepresentation';
import messages from '../../../resources/messages';

const localMessages = {
  searchNow: { id: 'collection.basicInfo.searchNow', defaultMessage: 'Search Now' },
  collectionDetailsTitle: { id: 'collection.details.title', defaultMessage: 'Collection: {name}' },
};

const CollectionDetailsContainer = (props) => {
  const { collectionId, collection, handleDashboardClick, handleWordCloudClick, handleCountryClick } = props;
  const { formatMessage } = props.intl;
  const filename = `SentencesOverTime-Collection-${collectionId}`;
  const titleHandler = parentTitle => `${collection.label} | ${parentTitle}`;
  const publicMessage = (collection.show_on_media === 1) ? `• ${formatMessage(messages.public)}` : '';
  return (
    <Grid className="details collection-details">
      <Title render={titleHandler} />
      <Row>
        <Col lg={8}>
          <h1>
            <FormattedMessage {...localMessages.collectionDetailsTitle} values={{ name: collection.label }} />
            <small className="subtitle">#{collection.id} {publicMessage}</small>
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
          <CollectionBasicInfo collection={collection} />
        </Col>
        <Col lg={6} xs={12}>
          <CollectionTopWordsContainer collectionId={collection.tags_id} onWordClick={handleWordCloudClick} />
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} xs={12}>
          <CollectionSentenceCountContainer collectionId={collection.tags_id} filename={filename} />
        </Col>
      </Row>
      <Row>
        <Col lg={6} xs={12}>
          <CollectionGeographyContainer collectionId={collection.tags_id} onCountryClick={handleCountryClick} />
        </Col>
        <Col lg={6} xs={12}>
          <CollectionSourceRepresentation collectionId={collection.tags_id} />
        </Col>
      </Row>
      <Row>
        <Col lg={6} xs={12}>
          <SourceList collectionId={collection.tags_id} sources={collection.media} />
        </Col>
      </Row>
    </Grid>
  );
};

CollectionDetailsContainer.propTypes = {
  intl: React.PropTypes.object.isRequired,
  // from context
  params: React.PropTypes.object.isRequired,       // params from router
  collectionId: React.PropTypes.number.isRequired,
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
  handleDashboardClick: React.PropTypes.func.isRequired,
  handleWordCloudClick: React.PropTypes.func.isRequired,
  handleCountryClick: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  collection: React.PropTypes.object,
};

CollectionDetailsContainer.contextTypes = {
  store: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  // filters: state.sources.selected.filters,
  collectionId: parseInt(ownProps.params.collectionId, 10),
  fetchStatus: state.sources.selected.details.collectionDetailsReducer.collectionDetails.fetchStatus,
  collection: state.sources.selected.details.collectionDetailsReducer.collectionDetails.object,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  asyncFetch: () => {
    dispatch(select(ownProps.params.collectionId));
    dispatch(fetchCollectionDetails(ownProps.params.collectionId));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    handleCountryClick: (country) => {
      console.log(country);
      // const { collection } = stateProps;
      // window.location = `https://dashboard.mediacloud.org/#query/["tags_id_story_sentences="]/[{"sources":[${ownProps.params.collectionId}]}]/["${collection.health.start_date.substring(0, 10)}"]/["${collection.health.end_date.substring(0, 10)}"]/[{"uid":3,"name":"${collection.name}","color":"55868A"}]`;
    },
    handleDashboardClick: () => {
      const { collection } = stateProps;
      window.location = `https://dashboard.mediacloud.org/#query/["*"]/[{"sets":[${collection.tags_id}]}]/[]/[]/[{"uid":1,"name":"${collection.label}","color":"55868A"}]`;
    },
    handleWordCloudClick: (word) => {
      const { collection } = stateProps;
      const searchStr = `${word.stem}*`;
      window.location = `https://dashboard.mediacloud.org/#query/["${searchStr}"]/[{"sources":[${collection.tags_id}]}]/[]/[]/[{"uid":1,"name":"${searchStr}","color":"55868A"}]`;
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeAsyncContainer(
        CollectionDetailsContainer
      )
    )
  );
