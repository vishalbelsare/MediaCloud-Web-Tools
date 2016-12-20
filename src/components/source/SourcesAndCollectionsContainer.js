import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { push } from 'react-router-redux';
import SourcesAndCollectionsList from './SourcesAndCollectionsList';
import AppButton from '../common/AppButton';
import { selectAdvancedSearchSource, selectAdvancedSearchCollection } from '../../actions/sourceActions';

const localMessages = {
  title: { id: 'sources.collections.all.title', defaultMessage: 'Sources And Collections' },
  send: { id: 'sources.collections.all.title', defaultMessage: 'Add Selected Items To Collection' },
  intro: { id: 'sources.collections.all.intro',
    defaultMessage: 'This is a list of all of our curated collections of media sources.  Collections are our primary way of organizing media sources; almost every media source in our system is a member of one or more of these curated collections.  Some collections are manually curated, and others are generated using quantitative metrics.  Some are historical, while others are actively maintained and updated.' },
};

const ADD_ALL_THIS_PAGE = 1;
const REMOVE_ALL = 0;
const ADD_ALL_PAGES = 2;

// TODO when paging is implemented, we'll have to set these booleans...
const FIRST_PAGE = true;

class SourcesAndCollectionsContainer extends React.Component {
  componentDidMount = () => {
    this.setState({ allOrNoneCheck: false });
  }
  addOrRemoveToSelectedSources= (mediaId, checked) => {
    const { dispatchSourceSelection } = this.props;
    dispatchSourceSelection([mediaId], checked);
  };
  addOrRemoveToSelectedCollections = (tagId, checked) => {
    const { dispatchCollectionSelection } = this.props;
    dispatchCollectionSelection([tagId], checked);
  };
  evalStateAndPage = () => {
    if (this.state &&
      (this.state.allOrNoneCheck === ADD_ALL_PAGES ||
      (this.state.allOrNoneCheck === ADD_ALL_THIS_PAGE && FIRST_PAGE))) {
      return true;
    }
    return false;
  };
  addOrRemoveAllSelected = (values) => {
    const { dispatchSourceSelection, dispatchCollectionSelection } = this.props;
    this.setState({ allOrNoneCheck: values });
    // if values == ADD_ALL_THIS_PAGE, REMOVE_ALL, ADD_ALL_PAGES

    // values ADD_ALL_THIS_PAGE or ADD_ALL_PAGES will select appropriate
    dispatchSourceSelection([], values);
    dispatchCollectionSelection([], values);
    // dispatch a click to all the checkboxes to checked somehow
  };
  pushToCreateCollectionPage = () => {
    const { searchString, queriedSources, queriedCollections, dispatchToCreate, dispatchToCreateWithSearch } = this.props;
    if (this.state && this.state.allOrNoneCheck === ADD_ALL_PAGES) {
      dispatchToCreateWithSearch(searchString);
    } else {
      dispatchToCreate(queriedSources, queriedCollections);
    }
  };
  render() {
    const { queriedSources, queriedCollections,
      pristine, submitting } = this.props;
    const { formatMessage } = this.props.intl;
    const content = null;

    if (queriedSources === undefined || queriedSources.length === 0 ||
      queriedCollections === undefined || queriedCollections.length === 0) {
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
            <Col lg={6} />
            <Col lg={6}>
              <AppButton
                style={{ marginTop: 30 }}
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
            ADD_ALL_THIS_PAGE={ADD_ALL_THIS_PAGE}
            REMOVE_ALL={REMOVE_ALL}
            ADD_ALL_PAGES={ADD_ALL_PAGES}
            allOrNoneCheck={this.evalStateAndPage()}
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
  searchString: React.PropTypes.string,
  // from dispatch
  dispatchToCreate: React.PropTypes.func.isRequired,
  dispatchSourceSelection: React.PropTypes.func.isRequired,
  dispatchCollectionSelection: React.PropTypes.func.isRequired,
  dispatchToCreateWithSearch: React.PropTypes.func.isRequired,
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
  // depending on checked value, all or page or a selected set or no items are to be selected
  dispatchSourceSelection: (mediaId, checked) => {
    dispatch(selectAdvancedSearchSource({ ids: mediaId.length > 0 ? mediaId : [], checked }));
  },
  dispatchCollectionSelection: (tagId, checked) => {
    dispatch(selectAdvancedSearchCollection({ ids: tagId.length > 0 ? tagId : [], checked }));
  },
  dispatchToCreateWithSearch: (searchStr) => {
    const url = `/collections/create?search=${searchStr}`;
    dispatch(push(url));
  },
  dispatchToCreate: (sources, collections) => {
    // get all ids and push them into url params
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
      if (collIdArray.length > 0) {
        url += `&coll=${collparams}`;
      }
    }
    if (srcIdArray.length === 0 && collIdArray.length > 0) {
      url += `?coll=${collparams}`;
    }
    dispatch(push(url));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      SourcesAndCollectionsContainer
    )
  );
