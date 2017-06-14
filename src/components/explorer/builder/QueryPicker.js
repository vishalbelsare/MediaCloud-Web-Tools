import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import QueryForm from './QueryForm';
import ItemSlider from '../../common/ItemSlider';
import QueryPickerItem from './QueryPickerItem';
import { selectQuery, updateQuery } from '../../../actions/explorerActions';
import { AddButton } from '../../common/IconButton';

const localMessages = {
  mainTitle: { id: 'explorer.querypicker.mainTitle', defaultMessage: 'Query List' },
  intro: { id: 'explorer.querypicker.intro', defaultMessage: 'Here are all available queries' },
  add: { id: 'explorer.querypicker.add', defaultMessage: 'Add query' },
  querySearch: { id: 'explorer.queryBuilder.advanced', defaultMessage: 'Search For' },
  searchHint: { id: 'explorer.queryBuilder.hint', defaultMessage: 'Search for ' },
};

//
class QueryPicker extends React.Component {

  addACustomQuery(newQueryObj) {
    const { setSelectedQuery } = this.props;
    setSelectedQuery(newQueryObj);
  }

  updateQueryFromEditablePicker(event) {
    const { updateCurrentQuery } = this.props;
    const updateObject = {};
    updateObject[event.target.name] = event.target.value;
    // name or color has changed,
    updateCurrentQuery(updateObject);
  }


  updateQuery(event) {
    const { updateCurrentQuery } = this.props;
    // const editedFieldName = event.target.name;
    const updateObject = {};
    updateObject[event.target.name] = event.target.value;
    updateCurrentQuery(updateObject);
  }

  render() {
    const { selected, queries, setSelectedQuery, isEditable, handleSearch } = this.props;
    const { formatMessage } = this.props.intl;
    let content = null;
    let fixedQuerySlides = null;
    // if DEMO_MODE isEditable = true
    if (queries && queries.length > 0 && selected) {
      fixedQuerySlides = queries.map((query, index) => (
        <div key={index} className={selected.id === query.id ? 'query-picker-item-selected' : ''}>
          <QueryPickerItem
            query={query}
            selected={selected}
            isEditable={isEditable}
            selectThisQuery={() => setSelectedQuery(query, index)}
            updateQuery={q => this.updateQueryFromEditablePicker(q)}
          />
        </div>
      ));
      const customEmptyQuery = { id: queries.length, label: 'enter query', q: '{}', description: 'empty query', imagePath: '.', start_date: '2016-02-02', end_date: '2017-02-02', custom: true };

      const addEmptyQuerySlide = (
        <AddButton
          tooltip={formatMessage(localMessages.add)}
          onClick={() => this.addACustomQuery(customEmptyQuery)}
        />
      );

      fixedQuerySlides.push(addEmptyQuerySlide);

      content = (
        <ItemSlider title={formatMessage(localMessages.intro)} slides={fixedQuerySlides} settings={{ height: 60, dots: false, slidesToShow: 4, slidesToScroll: 1, infinite: false }} />
      );
    }

    // indicate which queryPickerItem is selected -

    return (
      <div className="query-picker">
        {content}
        <QueryForm
          initialValues={selected}
          buttonLabel={formatMessage(localMessages.querySearch)}
          onSave={handleSearch}
          onChange={event => this.updateQuery(event)}
          isEditable
        />
      </div>
    );
  }
}

QueryPicker.propTypes = {
  queries: React.PropTypes.array,
  selected: React.PropTypes.object,
  intl: React.PropTypes.object.isRequired,
  setSelectedQuery: React.PropTypes.func.isRequired,
  isEditable: React.PropTypes.bool.isRequired,
  handleSearch: React.PropTypes.func.isRequired,
  formData: React.PropTypes.object,
  updateCurrentQuery: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  selected: state.explorer.selected,
  // formData: formSelector(state, 'q', 'start_date', 'end_date', 'color'),
});


const mapDispatchToProps = (dispatch, state) => ({
  setSelectedQuery: (query) => {
    // if anything changed? but I think this is taken cre of
    // dispatch(updateQuery(state.selected));
    dispatch(selectQuery(query));
  },
  updateCurrentQuery: (query) => {
    // const infoToQuery = queries;
    if (query) {
      dispatch(updateQuery(query));
    } else {
      dispatch(updateQuery(state.selected));
    }
  },
});

const reduxFormConfig = {
  form: 'queryForm',
  destroyOnUnmount: true,  // so the wizard works
};

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      reduxForm(reduxFormConfig)(
        QueryPicker
      )
    )
  );

