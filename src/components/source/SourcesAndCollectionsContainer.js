import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { push } from 'react-router-redux';
import composeAsyncContainer from '../common/AsyncContainer';
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
  addOrRemoveToSelectedSources= (mediaId, checked) => {
    const { dispatchSourceSelection, queriedSources } = this.props;
    dispatchSourceSelection(queriedSources, [mediaId], checked);
  };
  addOrRemoveToSelectedCollections = (tagId, checked) => {
    const { dispatchCollectionSelection, queriedCollections } = this.props;
    dispatchCollectionSelection(queriedCollections, [tagId], checked);
  };
  addOrRemoveAllSelected = (values, checked) => {
    const { queriedSources, queriedCollections, dispatchSourceSelection, dispatchCollectionSelection } = this.props;
    this.state.set({ allOrNoneCheck: values });
    // if values == SELECT_ALL_ON_PAGE, UNSELECT_ALL, SELECT_ALL
    dispatchSourceSelection(queriedSources, [], checked);
    dispatchCollectionSelection(queriedCollections, [], checked);
    // dispatch a click to all the checkboxes to checked somehow
  };
  pushToCreateCollectionPage = () => {
    const { queriedSources, queriedCollections, dispatchToCreate } = this.props;
    dispatchToCreate(queriedSources, queriedCollections);
    // dispatch a click to all the checkboxes to checked somehow
  };
  render() {
    const { queriedSources, queriedCollections,
      pristine, submitting } = this.props;
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
            <Col lg={12}>
              <AppButton
                style={{ marginLeft: 200, marginTop: 30 }}
                type="submit"
                label={formatMessage(localMessages.send)}
                disabled={pristine || submitting}
                primary
                onClick={this.pushToCreateCollectionPage}
              />
            </Col>
          </Row>
          <SourcesAndCollectionsList
            queriedSources={queriedSources}
            queriedCollections={queriedCollections}
            addRemoveAll={this.addOrRemoveAllSelected}
            addOrRemoveToSelectedSources={this.addOrRemoveToSelectedSources}
            addOrRemoveToSelectedCollections={this.addOrRemoveToSelectedCollections}
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
  dispatchToCreate: React.PropTypes.func.isRequired,
  dispatchSourceSelection: React.PropTypes.func.isRequired,
  dispatchCollectionSelection: React.PropTypes.func.isRequired,
  dispatchReset: React.PropTypes.func,
  // from form healper
  buttonLabel: React.PropTypes.string,
  initialValues: React.PropTypes.object,
  handleSubmit: React.PropTypes.func,
  pristine: React.PropTypes.bool,
  submitting: React.PropTypes.bool,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.selected.collectionsByMetadata.fetchStatus,
  queriedSources: state.sources.selected.sourcesByMetadata.list,
  queriedCollections: state.sources.selected.collectionsByMetadata.list,
});

const mapDispatchToProps = dispatch => ({
  asyncFetch: () => {
  },
  // I don't know why but the scope won't give me the queriedSources... so I have to pass in
  dispatchSourceSelection: (queried, mediaId, checked) => {
    dispatch(selectAdvancedSearchSource(queried, mediaId, checked));
  },
  dispatchCollectionSelection: (queried, tagId, checked) => {
    dispatch(selectAdvancedSearchCollection(queried, tagId, checked));
  },
  dispatchToCreate: (sources, collections) => {
    // get all ids and push them into url params
    // dispatch push url

    const srcIdArray = sources.map((s) => {
      if (s.selected === true) {
        return s.media_id;
      }
      return null;
    }).filter(i => i !== null);

    const collIdArray = collections.map((s) => {
      if (s.selected === true) {
        return s.tags_id;
      }
      return null;
    }).filter(i => i !== null);

    const params = srcIdArray.join(',');
    const collparams = collIdArray.join(',');
    let url = '/collections/create';
    if (srcIdArray.length > 0) {
      url += `?src=${params}`;
    }
    if (collIdArray.length > 0) {
      url += `&coll=${collparams}`;
    }
    dispatch(push(url));
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
