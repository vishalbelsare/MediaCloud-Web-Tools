import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import * as d3 from 'd3';
import messages from '../../../resources/messages';
import QueryForm from './QueryForm';
import AppButton from '../../common/AppButton';
import ItemSlider from '../../common/ItemSlider';
import QueryPickerItem from './QueryPickerItem';
import { selectQuery, updateQuery, addCustomQuery, loadUserSearches, saveUserSearch, deleteQuery } from '../../../actions/explorerActions';
import { AddQueryButton } from '../../common/IconButton';
import { getPastTwoWeeksDateRange } from '../../../lib/dateUtil';
import { DEFAULT_COLLECTION_OBJECT_ARRAY } from '../../../lib/explorerUtil';
import { getUserRoles, hasPermissions, PERMISSION_LOGGED_IN } from '../../../lib/auth';

const localMessages = {
  mainTitle: { id: 'explorer.querypicker.mainTitle', defaultMessage: 'Query List' },
  intro: { id: 'explorer.querypicker.intro', defaultMessage: 'Here are all available queries' },
  addQuery: { id: 'explorer.querypicker.addQuery', defaultMessage: 'Add query' },
  querySearch: { id: 'explorer.queryBuilder.advanced', defaultMessage: 'Search' },
  searchHint: { id: 'explorer.queryBuilder.hint', defaultMessage: 'Search' },
};

const formSelector = formValueSelector('queryForm');

const MAX_COLORS = 20;

// TODO: implement this logic from Dashboard
export const autoMagicQueryLabel = query => query.q;

class QueryPicker extends React.Component {
  addAQuery(newQueryObj) {
    const { addAQuery } = this.props;
    addAQuery(newQueryObj);
  }
  focusRequested = field => field.focus();

  updateDemoQueryLabel(query, newValue) {
    // update both label and q for query
    const { updateCurrentQuery } = this.props;
    const updatedQuery = { ...query };
    updatedQuery.label = newValue;
    updatedQuery.q = newValue;
    updateCurrentQuery(updatedQuery, 'label');
  }
  // called by query picker to update things like label or color
  updateQueryProperty(query, propertyName, newValue) {
    const { updateCurrentQuery } = this.props;
    const updatedQuery = { ...query };
    updatedQuery[propertyName] = newValue;
    // now update it in the store
    updateCurrentQuery(updatedQuery, propertyName);
  }

  handleColorChange = (newColorInfo) => {
    // when user changes color we want to change it on all charts right away
    const { selected, updateCurrentQuery } = this.props;
    const updatedQuery = {
      ...selected,
      color: newColorInfo.value,
    };
    updateCurrentQuery(updatedQuery, 'color');
  }

  handleMediaChange = (sourceAndCollections) => {
    // the user has picked new sources and/or collections so we need to save in order to update the list onscreen
    const { selected, updateCurrentQuery } = this.props;
    const updatedQuery = { ...selected };
    const updatedSources = sourceAndCollections.filter(m => m.type === 'source' || m.media_id);
    const updatedCollections = sourceAndCollections.filter(m => m.type === 'collection' || m.tags_id);
    updatedQuery.collections = updatedCollections;
    updatedQuery.sources = updatedSources;
    updateCurrentQuery(updatedQuery);
  }

  isDeletable() {
    const { queries } = this.props;
    const unDeletedQueries = queries.filter(q => !q.deleted);
    return unDeletedQueries.length >= 2; // because we always have an empty query in the query array
  }

  handleDeleteAndSelectQuery(query) {
    const { queries, handleDeleteQuery } = this.props;
    const queryIndex = queries.findIndex(q => q.index !== null && q.index === query.index);
    const replaceSelectionWithWhichQuery = queryIndex === 0 ? 1 : 0; // replace with the query, not the position
    if (this.isDeletable()) {
      handleDeleteQuery(query, queries[replaceSelectionWithWhichQuery]);
    }
  }

  saveChangesToSelectedQuery() {
    const { selected, formQuery, updateCurrentQuery } = this.props;
    const updatedQuery = {
      ...selected,
      ...formQuery,
      label: autoMagicQueryLabel(formQuery),
    };
    updateCurrentQuery(updatedQuery, 'label');
  }

  handleSelectedQueryChange(nextSelectedQuery, nextSelectedIndex) {
    const { handleQuerySelected } = this.props;
    // first update the one we are unmounting
    this.saveChangesToSelectedQuery();
    // now mark the new one we want to display (careful! unDeleted has different index)
    handleQuerySelected(nextSelectedQuery, nextSelectedQuery.index ? nextSelectedQuery.index : nextSelectedIndex);
  }

  saveAndSearch = () => {
    // wrap the save handler here because we need to save the changes to the selected query the user
    // might have made on the form, and then search
    const { onSearch } = this.props;
    this.saveChangesToSelectedQuery();
    onSearch();
  }

  render() {
    const { selected, queries, user, collectionsResults, sourcesResults, isEditable } = this.props;
    const { formatMessage } = this.props.intl;
    let queryPickerContent; // editable if demo mode
    let queryFormContent; // hidden if demo mode
    let fixedQuerySlides;
    let canSelectMedia = false;
    const userLoggedIn = hasPermissions(getUserRoles(user), PERMISSION_LOGGED_IN);

    const unDeletedQueries = queries.filter(q => !q.deleted);
    if (unDeletedQueries && unDeletedQueries.length > 0 && selected &&
      collectionsResults && collectionsResults.length > 0 &&
      sourcesResults && sourcesResults.length >= 0) {
      fixedQuerySlides = unDeletedQueries.map((query, index) => (
        <div key={index}>
          <QueryPickerItem
            user={user}
            key={index}
            query={query}
            isSelected={selected.index === query.index}
            isLabelEditable={isEditable} // if custom, true for either mode, else if logged in no
            isDeletable={() => this.isDeletable()}
            displayLabel={false}
            onQuerySelected={() => this.handleSelectedQueryChange(query, index)}
            updateQueryProperty={(propertyName, newValue) => this.updateQueryProperty(query, propertyName, newValue)}
            updateDemoQueryLabel={newValue => this.updateDemoQueryLabel(query, newValue)}
            onSearch={this.saveAndSearch}
            handleDeleteQuery={() => this.handleDeleteAndSelectQuery(query)}
            // loadDialog={loadQueryEditDialog}
          />
        </div>
      ));
      canSelectMedia = userLoggedIn;
      // provide the add Query button, load with default values when Added is clicked
      if (userLoggedIn || isEditable) {
        const colorPallette = idx => d3.schemeCategory10[idx < MAX_COLORS ? idx : 0];
        const dateObj = getPastTwoWeeksDateRange();
        const newIndex = queries.length; // NOTE: all queries, including 'deleted' ones
        const genDefColor = colorPallette(newIndex);
        const newQueryLabel = `Query ${String.fromCharCode('A'.charCodeAt(0) + newIndex)}`;
        const defaultQueryField = userLoggedIn ? '*' : '';
        const defaultQuery = { index: newIndex, label: newQueryLabel, q: defaultQueryField, description: 'new', startDate: dateObj.start, endDate: dateObj.end, collections: DEFAULT_COLLECTION_OBJECT_ARRAY, sources: [], color: genDefColor, custom: true };

        const emptyQuerySlide = (
          <div key={fixedQuerySlides.length}>
            <div className="query-picker-item">
              <div className="add-query-item">
                <AddQueryButton
                  key={fixedQuerySlides.length} // this isn't working
                  tooltip={formatMessage(localMessages.addQuery)}
                  onClick={() => this.addAQuery(defaultQuery)}
                />
                <a href="" onTouchTap={() => this.addAQuery(defaultQuery)}><FormattedMessage {...localMessages.addQuery} /></a>
              </div>
            </div>
          </div>
        );

        fixedQuerySlides.push(emptyQuerySlide);
      }
      let demoSearchButtonContent; // in demo mode we need a search button outside the form (cause we can't see the form)
      if (!userLoggedIn) {
        demoSearchButtonContent = (
          <Grid>
            <Row>
              <Col lg={10} />
              <Col lg={1}>
                <AppButton
                  style={{ marginTop: 30 }}
                  type="submit"
                  label={formatMessage(messages.search)}
                  primary
                  onTouchTap={this.saveAndSearch}
                />
              </Col>
            </Row>
          </Grid>
        );
      }
      queryPickerContent = (
        <div className="query-picker-wrapper">
          <div className="query-picker">
            <Grid>
              <ItemSlider
                title={formatMessage(localMessages.intro)}
                slides={fixedQuerySlides}
                settings={{ height: 60, dots: false, slidesToShow: 4, slidesToScroll: 1, infinite: false, arrows: fixedQuerySlides.length > 4 }}
              />
            </Grid>
          </div>
          {demoSearchButtonContent}
        </div>
      );
      if (userLoggedIn) {  // if logged in show full form
        queryFormContent = (
          <QueryForm
            initialValues={selected}
            selected={selected}
            form="queryForm"
            enableReinitialize
            destroyOnUnmount={false}
            buttonLabel={formatMessage(localMessages.querySearch)}
            onSave={this.saveAndSearch}
            onColorChange={this.handleColorChange}
            onMediaChange={this.handleMediaChange}
            handleLoadSearch={loadUserSearches}
            handleSaveSearch={q => saveUserSearch(q)}
            isEditable={canSelectMedia}
            focusRequested={this.focusRequested}
          />
        );
      }
      // indicate which queryPickerItem is selected -
      // const selectedWithSandCLabels = queries.find(q => q.index === selected.index);
      return (
        <div>
          {queryPickerContent}
          {queryFormContent}
        </div>
      );
    }
    return ('error - no queries ');
  }
}

QueryPicker.propTypes = {
  user: React.PropTypes.object.isRequired,
  queries: React.PropTypes.array,
  sourcesResults: React.PropTypes.array,
  collectionsResults: React.PropTypes.array,
  fetchStatus: React.PropTypes.string.isRequired,
  selected: React.PropTypes.object,
  intl: React.PropTypes.object.isRequired,
  handleQuerySelected: React.PropTypes.func.isRequired,
  isEditable: React.PropTypes.bool.isRequired,
  isDeletable: React.PropTypes.func,
  onSearch: React.PropTypes.func.isRequired,
  updateCurrentQuery: React.PropTypes.func.isRequired,
  handleDeleteAndSelectQuery: React.PropTypes.func,
  handleDeleteQuery: React.PropTypes.func.isRequired,
  loadUserSearches: React.PropTypes.func,
  saveUserSearch: React.PropTypes.func.isRequired,
  addAQuery: React.PropTypes.func.isRequired,
  formQuery: React.PropTypes.object,
};

const mapStateToProps = state => ({
  selected: state.explorer.selected,
  queries: state.explorer.queries.queries ? state.explorer.queries.queries : null,
  sourcesResults: state.explorer.queries.sources.results ? state.explorer.queries.sources.results : null,
  collectionsResults: state.explorer.queries.collections.results ? state.explorer.queries.collections.results : null,
  fetchStatus: state.explorer.queries.collections.fetchStatus,
  user: state.user,
  formQuery: formSelector(state, 'q', 'color', 'media', 'startDate', 'endDate'),
});


const mapDispatchToProps = dispatch => ({
  handleQuerySelected: (query, index) => {
    const queryWithIndex = Object.assign({}, query, { index }); // if this doesn't exist...
    dispatch(selectQuery(queryWithIndex));
  },
  updateCurrentQuery: (query, fieldName) => {
    if (query) {
      dispatch(updateQuery({ query, fieldName }));
    }
  },
  addAQuery: (query) => {
    if (query) {
      dispatch(addCustomQuery(query));
      dispatch(selectQuery(query));
    }
  },
  loadUserSearch: (query) => {
    if (query) { // TODO - pop up a dialog and fetch the data
      dispatch(loadUserSearches());
    }
  },
  saveUserSearch: (query) => {
    if (query) { // TODO - save as JSON, and save full URL
      dispatch(saveUserSearch({ label: query.label, query_string: query.q }));
    }
  },
  handleDeleteQuery: (query, replacementSelectionQuery) => {
    if (query) {
      dispatch(deleteQuery(query)); // will change queries, but not URL, this is the problem
      dispatch(selectQuery(replacementSelectionQuery));
    }
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      QueryPicker
    )
  );

