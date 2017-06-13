import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import QueryForm from './QueryForm';
import ItemSlider from '../../common/ItemSlider';
import QueryPickerItem from './QueryPickerItem';
import { selectQuery } from '../../../actions/explorerActions';
import { AddButton } from '../../common/IconButton';

const localMessages = {
  mainTitle: { id: 'explorer.querypicker.mainTitle', defaultMessage: 'Query List' },
  intro: { id: 'explorer.querypicker.intro', defaultMessage: 'Here are all available queries' },
  add: { id: 'explorer.querypicker.add', defaultMessage: 'Add query' },
  querySearch: { id: 'explorer.queryBuilder.advanced', defaultMessage: 'Search For' },
  searchHint: { id: 'explorer.queryBuilder.hint', defaultMessage: 'Search for ' },
};

const formSelector = formValueSelector('queryForm');

class QueryPicker extends React.Component {

  constructor(props) {
    super(props);
    const queryList = (props.queries) ? props.queries : null;
    this.state = { queryList };
  }

  componentDidMount() {
  }

  addACustomQuery(newQueryObj) {
    const { setSelectedQuery } = this.props;
    const queryList = this.state.queryList;
    // only create a new empty one if there are no empty q's .... ?
    queryList.push(newQueryObj);
    setSelectedQuery(newQueryObj);
  }

  updateQueryFromEditablePicker(q, currentQueryObj, index) {
    const queryList = this.state.queryList;
    // get data from form, update queryList
    const editedFieldName = 'q';
    const editedFieldVal = q.target.value;

    queryList[index][editedFieldName] = editedFieldVal;
  }


  updateQueryList(event, currentQueryObj) {
    const queryList = this.state.queryList;
    // get data from form, update queryList
    const editedFieldName = event.target.name;
    const editedFieldVal = event.target.value;

    const editedObj = queryList.filter(q => q.id === currentQueryObj.id)[0];

    editedObj[editedFieldName] = editedFieldVal;
    return editedObj;
  }

  // TODO, how to read in updated fields from form
  // updateQueryFieldsWithForm(editedField, queryObj, index) {
  // change the queryList, not the state.queries until Search is hit...

  render() {
    const { selected, formData, setSelectedQuery, isEditable, handleSearch } = this.props;
    const { formatMessage } = this.props.intl;
    let content = null;
    let fixedQuerySlides = null;
    // if DEMO_MODE isEditable = true
    const queryList = this.state.queryList;
    if (queryList && queryList.length > 0 && selected) {
      fixedQuerySlides = queryList.map((query, index) => (
        <div key={index} className={selected.id === query.id ? 'query-picker-item-selected' : ''}>
          <QueryPickerItem
            query={query.id === selected.id ? formData : query}
            selected={selected}
            isEditable={isEditable}
            selectThisQuery={() => setSelectedQuery(query, index)}
            updateQuery={q => this.updateQueryFromEditablePicker(q, query, index)}
          />
        </div>
      ));
      const customEmptyQuery = { id: queryList.length, label: 'enter query', q: '{}', description: 'empty query', imagePath: '.', start_date: '2016-02-02', end_date: '2017-02-02', custom: true };

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
          onChange={event => this.updateQueryList(event, selected)}
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
};

const mapStateToProps = state => ({
  selected: state.explorer.selected,
  formData: formSelector(state, 'q', 'start_date', 'end_date', 'color'),
});


const mapDispatchToProps = dispatch => ({
  setSelectedQuery: (query) => {
    // grab form data, stick it in queryList, select Next?
    dispatch(selectQuery(query));
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

