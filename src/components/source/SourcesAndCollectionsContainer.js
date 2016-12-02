import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import composeAsyncContainer from '../common/AsyncContainer';
import CollectionIcon from '../common/icons/CollectionIcon';
import SourcesAndCollectionsList from './SourcesAndCollectionsList';
import AppButton from '../common/AppButton';
import { selectAdvancedSearchSource, selectAdvancedSearchCollection } from '../../actions/sourceActions';


const localMessages = {
  title: { id: 'sources.collections.all.title', defaultMessage: 'Sources And Collections' },
  send: { id: 'sources.collections.all.title', defaultMessage: 'Add To Set' },
  intro: { id: 'sources.collections.all.intro',
    defaultMessage: 'This is a list of all of our curated collections of media sources.  Collections are our primary way of organizing media sources; almost every media source in our system is a member of one or more of these curated collections.  Some collections are manually curated, and others are generated using quantitative metrics.  Some are historical, while others are actively maintained and updated.' },
};

class SourcesAndCollectionsContainer extends React.Component {
  addToSelectedSources= (mediaId) => {
    const { dispatchSourceSelection, queriedSources } = this.props;
    dispatchSourceSelection(queriedSources, mediaId);
  };
  addToSelectedCollections = (tagId) => {
    const { dispatchCollectionSelection, queriedCollections } = this.props;
    dispatchCollectionSelection(queriedCollections, tagId);
  };
  render() {
    const { queriedSources, queriedCollections,
      pristine, submitting, addToCreateSet, addOrRemoveAllSelected } = this.props;
    const { formatMessage } = this.props.intl;
    const content = null;
    if (queriedSources === undefined || queriedCollections === undefined) {
      return (
        <div>
          { content }
        </div>
      );
    }
    return (
      <div className="all-collections">
        <Grid>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <h2>
                <CollectionIcon height={32} />
                <FormattedMessage {...localMessages.title} />
              </h2>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <AppButton
                style={{ marginTop: 30 }}
                type="submit"
                label={formatMessage(localMessages.send)}
                disabled={pristine || submitting}
                primary
                onClick={addToCreateSet}
              />
            </Col>
          </Row>
          <SourcesAndCollectionsList
            queriedSources={queriedSources}
            queriedCollections={queriedCollections}
            addRemoveAll={addOrRemoveAllSelected}
            addToSelectedSources={this.addToSelectedSources}
            addToSelectedCollections={this.addToSelectedCollections}
          />
        </Grid>
      </div>
    );
  }
}

SourcesAndCollectionsContainer.propTypes = {
  // from state
  queriedCollections: React.PropTypes.array,
  queriedSources: React.PropTypes.array,
  fetchStatus: React.PropTypes.string.isRequired,
  // from context
  intl: React.PropTypes.object.isRequired,
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
  addToCreateSet: React.PropTypes.func.isRequired,
  addOrRemoveAllSelected: React.PropTypes.func.isRequired,
  dispatchSourceSelection: React.PropTypes.func.isRequired,
  dispatchCollectionSelection: React.PropTypes.func.isRequired,
  // from form healper
  buttonLabel: React.PropTypes.string,
  initialValues: React.PropTypes.object,
  handleSubmit: React.PropTypes.func,
  pristine: React.PropTypes.bool,
  submitting: React.PropTypes.bool,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.selected.collectionsByMetadata.fetchStatus,
  queriedCollections: state.sources.selected.collectionsByMetadata.results,
  queriedSources: state.sources.selected.sourcesByMetadata.results,
});

const mapDispatchToProps = dispatch => ({
  asyncFetch: () => {
  },
  // I don't know why but the scope won't give me the queriedSources... so I have to pass in
  dispatchSourceSelection: (queried, mediaId) => {
    dispatch(selectAdvancedSearchSource(queried, mediaId));
  },
  dispatchCollectionSelection: (queried, tagId) => {
    dispatch(selectAdvancedSearchCollection(queried, tagId));
  },
  addOrRemoveAllSelected: (mediaId, tagId) => {
    const { queriedSources, queriedCollections } = this.props;
    dispatch(selectAdvancedSearchSource(queriedSources, mediaId));
    dispatch(selectAdvancedSearchCollection(queriedCollections, tagId));
    // dispatch a click to all the checkboxes to checked somehow
  },
  addToCreateSet: () => {
    // get all ids and push them into url params
    // dispatch push url
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncContainer(
        SourcesAndCollectionsContainer
      )
    )
  );
