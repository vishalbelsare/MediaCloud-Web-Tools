import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import Title from 'react-title-component';
import RaisedButton from 'material-ui/RaisedButton';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { select, fetchCollectionDetails } from '../../../actions/sourceActions';
import composeAsyncContainer from '../../common/AsyncContainer';
import SourceList from './SourceList';
import CollectionSentenceCountContainer from './CollectionSentenceCountContainer';
import CollectionTopWordsContainer from './CollectionTopWordsContainer';
import CollectionGeographyContainer from './CollectionGeographyContainer';
import CollectionSourceRepresentation from './CollectionSourceRepresentation';
import messages from '../../../resources/messages';

const localMessages = {
  searchNow: { id: 'collection.details.searchNow', defaultMessage: 'Search on the Dashboard' },
  collectionDetailsTitle: { id: 'collection.details.title', defaultMessage: 'Collection: {name}' },
  noHealth: { id: 'collection.details.noHealth', defaultMessage: 'Sorry, we can\'t show collection-level health yet.' },
};

class CollectionDetailsContainer extends React.Component {

  componentWillReceiveProps(nextProps) {
    const { collectionId, fetchData } = this.props;
    if ((nextProps.collectionId !== collectionId)) {
      fetchData(nextProps.collectionId);
    }
  }

  searchOnDashboard = () => {
    const { collection } = this.props;
    const dashboardUrl = `https://dashboard.mediacloud.org/#query/["*"]/[{"sets":[${collection.tags_id}]}]/[]/[]/[{"uid":1,"name":"${collection.label}","color":"55868A"}]`;
    window.open(dashboardUrl, '_blank');
  }

  render() {
    const { collection } = this.props;
    const { formatMessage } = this.props.intl;
    const filename = `SentencesOverTime-Collection-${collection.tags_id}`;
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
            <p>{collection.description}</p>
            <RaisedButton label={formatMessage(localMessages.searchNow)} primary onClick={this.searchOnDashboard} />
          </Col>
          <Col lg={4} />
        </Row>
        <Row>
          <Col lg={6} xs={12}>
            <CollectionTopWordsContainer collectionId={collection.tags_id} />
          </Col>
          <Col lg={6} xs={12}>
            <CollectionSentenceCountContainer collectionId={collection.tags_id} filename={filename} />
          </Col>
        </Row>
        <Row>
          <Col lg={12} md={12} xs={12}>
            <CollectionGeographyContainer collectionId={collection.tags_id} />
          </Col>
        </Row>
        <Row>
          <Col lg={6} xs={12}>
            <SourceList collectionId={collection.tags_id} sources={collection.media} />
          </Col>
          <Col lg={6} xs={12}>
            <CollectionSourceRepresentation collectionId={collection.tags_id} />
          </Col>
        </Row>
      </Grid>
    );
  }

}

CollectionDetailsContainer.propTypes = {
  intl: React.PropTypes.object.isRequired,
  // from context
  params: React.PropTypes.object.isRequired,       // params from router
  collectionId: React.PropTypes.number.isRequired,
  // from dispatch
  fetchData: React.PropTypes.func.isRequired,
  // from merge
  asyncFetch: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  collection: React.PropTypes.object,
};

CollectionDetailsContainer.contextTypes = {
  store: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  collectionId: parseInt(ownProps.params.collectionId, 10),
  fetchStatus: state.sources.selected.details.collectionDetailsReducer.collectionDetails.fetchStatus,
  collection: state.sources.selected.details.collectionDetailsReducer.collectionDetails.object,
});

const mapDispatchToProps = dispatch => ({
  fetchData: (collectionId) => {
    dispatch(select(collectionId));
    dispatch(fetchCollectionDetails(collectionId));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(ownProps.params.collectionId);
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
