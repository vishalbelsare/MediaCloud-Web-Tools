import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import DataCard from '../../common/DataCard';
import ItemSlider from '../../common/ItemSlider';
import QueryPickerItem from './QueryPickerItem';
import { selectQuery } from '../../../actions/explorerActions';

const localMessages = {
  mainTitle: { id: 'explorer.featured.mainTitle', defaultMessage: 'Query List' },
  intro: { id: 'explorer.featured.intro', defaultMessage: 'Here are all available queries' },
};

class QueryPicker extends React.Component {
  componentDidMount() {
  }

  render() {
    const { queries, selected, setSelectedQuery, isEditable } = this.props;
    let content = null;
    let fixedQuerySlides = null;
    // if DEMO_MODE isEditable = true
    if (queries && queries.length > 0 && selected) {
      fixedQuerySlides = queries.map((query, index) => (
        <div key={index} className={selected.id === query.id ? 'selected' : ''}>
          <QueryPickerItem query={query} isEditable={isEditable} onTouchTap={setSelectedQuery} />
        </div>
      ));

      content = (
        <ItemSlider slides={fixedQuerySlides} settings={{ dots: false, slidesToShow: 3, slidesToScroll: 1 }} />
      );
    }

    // indicate which queryPickerItem is selected -

    return (
      <div className="featured-collections">
        <DataCard>
          <h2>
            <FormattedMessage {...localMessages.mainTitle} />
          </h2>
          <div>
            {content}
          </div>
        </DataCard>
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
  queries: state.explorer.queries.list,
});


const mapDispatchToProps = (dispatch, state) => ({
  setSelectedQuery: (index) => {
    dispatch(selectQuery(state.explorer.queries[index]));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      QueryPicker
    )
  );

