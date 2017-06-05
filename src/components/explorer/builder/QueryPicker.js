import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
// import DataCard from '../../common/DataCard';
import ItemSlider from '../../common/ItemSlider';
import QueryPickerItem from './QueryPickerItem';
import { selectQuery } from '../../../actions/explorerActions';

const localMessages = {
  mainTitle: { id: 'explorer.featured.mainTitle', defaultMessage: 'Query List' },
  intro: { id: 'explorer.featured.intro', defaultMessage: 'Here are all available queries' },
};

class QueryPicker extends React.Component {

  constructor(props) {
    super(props);
    const queryList = (props.queries) ? props.queries : null;
    this.state = { queryList };
  }

  componentDidMount() {
  }

  addACustomQuery(newQueryObj) {
    const queryList = this.state.queryList;
    queryList.push(newQueryObj);
  }

  render() {
    const { selected, setSelectedQuery, isEditable } = this.props;
    const { formatMessage } = this.props.intl;
    let content = null;
    let fixedQuerySlides = null;
    let customQuerySlide = null;
    // if DEMO_MODE isEditable = true
    const queryList = this.state.queryList;
    if (queryList && queryList.length > 0 && selected) {
      fixedQuerySlides = queryList.map((query, index) => (
        <div key={index} className={selected.id === query.id ? 'selected' : ''}>
          <QueryPickerItem query={query} isEditable={isEditable} selectThisQuery={() => setSelectedQuery(index)} />
        </div>
      ));
      const customEmptyQuery = { id: queryList.length, label: 'empty query', queryParams: '{}', imagePath: '.' };
      customQuerySlide = (
        <div key={queryList.length} className={selected.id === queryList.length ? 'selected' : ''}>
          <QueryPickerItem query={customEmptyQuery} isEditable={isEditable} selectThisQuery={() => this.addACustomQuery(queryList.length)} />
        </div>
      );

      fixedQuerySlides.push(customQuerySlide);

      content = (
        <ItemSlider title={formatMessage(localMessages.intro)} slides={fixedQuerySlides} settings={{ height: 60, dots: false, slidesToShow: 3, slidesToScroll: 1 }} />
      );
    }

    // indicate which queryPickerItem is selected -

    return (
      <div className="query-picker">
        {content}
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
};

const mapStateToProps = state => ({
  selected: state.explorer.selected,
});


const mapDispatchToProps = dispatch => ({
  setSelectedQuery: (index) => {
    dispatch(selectQuery(index));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      QueryPicker
    )
  );

