import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import QueryForm from './QueryForm';
import ItemSlider from '../../common/ItemSlider';
import QueryPickerItem from './QueryPickerItem';
import { selectQuery, updateQuery, addCustomQuery } from '../../../actions/explorerActions';
import { AddButton } from '../../common/IconButton';
import { getPastTwoWeeksDateRange } from '../../../lib/dateUtil';

const localMessages = {
  mainTitle: { id: 'explorer.querypicker.mainTitle', defaultMessage: 'Query List' },
  intro: { id: 'explorer.querypicker.intro', defaultMessage: 'Here are all available queries' },
  add: { id: 'explorer.querypicker.add', defaultMessage: 'Add query' },
  querySearch: { id: 'explorer.queryBuilder.advanced', defaultMessage: 'Search' },
  searchHint: { id: 'explorer.queryBuilder.hint', defaultMessage: 'Search' },
};

const MAX_COLORS = 20;

//
class QueryPicker extends React.Component {

  addAQuery(newQueryObj) {
    const { addAQuery } = this.props;
    addAQuery(newQueryObj);
  }

  updateQuery(obj) {
    const { updateCurrentQuery, selected } = this.props;
    const updateObject = selected;
    const fieldName = obj.target ? obj.target.name : obj.name;
    const fieldValue = obj.target ? obj.target.value : obj.value;
    updateObject[fieldName] = fieldValue;
    updateCurrentQuery(updateObject);
  }

  render() {
    const { selected, queries, sourcesResults, collectionsResults, setSelectedQuery, isEditable, handleSearch } = this.props;
    const { formatMessage } = this.props.intl;
    let content = null;
    let fixedQuerySlides = null;

    // if DEMO_MODE isEditable = true
    if (queries && queries.length > 0 && selected) {
      let mergedQueryWithSandCInfo = queries;
      if (sourcesResults && sourcesResults.length > 0) {
        mergedQueryWithSandCInfo = queries.map((r, idx) => Object.assign({}, r, { sources: sourcesResults[idx] }));
      }
      // TODO, make sure the indexes are ok here b/c query may not have had an id on either sources or coll
      // for new queries, we don't have this information for the default yet...
      if (collectionsResults && collectionsResults.length > 0) {
        mergedQueryWithSandCInfo = queries.map((r, idx) => Object.assign({}, r, { collections: collectionsResults[idx] ? collectionsResults[idx] : r.collections }));
      }

      fixedQuerySlides = mergedQueryWithSandCInfo.map((query, index) => (
        <div key={index} className={selected.index === index ? 'query-picker-item-selected' : ''}>
          <QueryPickerItem
            key={index}
            query={query}
            selected={selected}
            isEditable={query.id === undefined ? true : isEditable} // if custom, true for either mode, else if logged in no
            selectThisQuery={() => setSelectedQuery(query, index)}
            updateQuery={q => this.updateQuery(q)}
          />
        </div>
      ));

      // provide the add Query button, load with default values when Added is clicked
      if (isEditable) {
        const colorPallette = idx => d3.schemeCategory20[idx < MAX_COLORS ? idx : 0];
        const dateObj = getPastTwoWeeksDateRange();
        const newIndex = mergedQueryWithSandCInfo.length; // effectively a +1
        const genDefColor = colorPallette(newIndex);
        const defaultQuery = { index: newIndex, label: 'enter query', q: 'enter here', description: 'new', startDate: dateObj.start, endDate: dateObj.end, collections: [{ tags_id: 8875027, label: 'U.S. Mainstream Media' }], sources: [], color: genDefColor, custom: true };

        const emptyQuerySlide = (
          <div className="add-custom-query" key={fixedQuerySlides.length}>
            <AddButton
              key={fixedQuerySlides.length} // this isn't working
              tooltip={formatMessage(localMessages.add)}
              onClick={() => this.addAQuery(defaultQuery)}
            />
          </div>
        );

        fixedQuerySlides.push(emptyQuerySlide);
      }
      content = (
        <ItemSlider
          title={formatMessage(localMessages.intro)}
          slides={fixedQuerySlides}
          settings={{ height: 60, dots: false, slidesToShow: 4, slidesToScroll: 1, infinite: false, arrows: fixedQuerySlides.length > 4 }}
        />
      );

      // indicate which queryPickerItem is selected -
      const selectedWithSandCLabels = mergedQueryWithSandCInfo.find(q => q.index === selected.index);
      const initialValues = selectedWithSandCLabels ? { ...selectedWithSandCLabels } : {};
      return (
        <div className="query-picker">
          {content}
          <QueryForm
            initialValues={initialValues}
            selected={selectedWithSandCLabels}
            form="queryForm"
            enableReinitialize
            destroyOnUnmount={false}
            buttonLabel={formatMessage(localMessages.querySearch)}
            onSave={handleSearch}
            onChange={event => this.updateQuery(event)}
            isEditable
          />
        </div>
      );
    }
    return ('error - no queries ');
  }
}

QueryPicker.propTypes = {
  queries: React.PropTypes.array,
  sourcesResults: React.PropTypes.array,
  collectionsResults: React.PropTypes.array,
  fetchStatus: React.PropTypes.string.isRequired,
  selected: React.PropTypes.object,
  intl: React.PropTypes.object.isRequired,
  setSelectedQuery: React.PropTypes.func.isRequired,
  isEditable: React.PropTypes.bool.isRequired,
  handleSearch: React.PropTypes.func.isRequired,
  // formData: React.PropTypes.object,
  updateCurrentQuery: React.PropTypes.func.isRequired,
  addAQuery: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  selected: state.explorer.selected,
  queries: state.explorer.queries,
  sourcesResults: state.explorer.sources.results ? state.explorer.sources.results : null,
  collectionsResults: state.explorer.collections.results ? state.explorer.collections.results : null,
  fetchStatus: state.explorer.collections.fetchStatus,
  // formData: formSelector(state, 'q', 'start_date', 'end_date', 'color'),
});


const mapDispatchToProps = (dispatch, ownProps) => ({
  setSelectedQuery: (query, index) => {
    const queryWithIndex = Object.assign({}, query, { index });
    dispatch(selectQuery(queryWithIndex));
  },
  updateCurrentQuery: (query) => {
    if (query) {
      dispatch(updateQuery(query));
    } else {
      dispatch(updateQuery(ownProps.selected)); // this won't e right
    }
  },
  addAQuery: (query) => {
    if (query) {
      dispatch(addCustomQuery(query));
      dispatch(selectQuery(query));
    }
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      QueryPicker
    )
  );

