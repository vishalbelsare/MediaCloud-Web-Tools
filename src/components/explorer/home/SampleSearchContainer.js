import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import ItemSlider from '../../common/ItemSlider';
import DataCard from '../../common/DataCard';
import SearchForm from './SearchForm';
import SampleSearchItem from './SampleSearchItem';
import { fetchSampleSearches } from '../../../actions/explorerActions';

const localMessages = {
  intro: { id: 'explorer.featured.intro', defaultMessage: 'Try one of our sample searches' },
};

class SampleSearchContainer extends React.Component {
  componentDidMount() {
    const { fetchData } = this.props;
    fetchData();
  }

  render() {
    const { samples, user, onSearch } = this.props;
    const { formatMessage } = this.props.intl;
    let searchContent = null;
    let content = null;
    let fixedSearchSlides = null;
    const initialValues = { keyword: 'Search for' };

    searchContent = <SearchForm initialValues={initialValues} onSearch={onSearch} />;
    if (samples && samples.length > 0) {
      fixedSearchSlides = samples.map((search, index) => (<div key={index}><SampleSearchItem search={search} user={user} /></div>));

      content = (
        <ItemSlider
          title={formatMessage(localMessages.intro)}
          slides={fixedSearchSlides}
          settings={{ height: 60, dots: false, slidesToShow: 3, slidesToScroll: 1, infinite: false, arrows: fixedSearchSlides.length > 3 }}
        />
      );
    }

    return (
      <div>
        <div>
          {searchContent}
        </div>
        <DataCard className="sample-searches">
          <div>
            {content}
          </div>
        </DataCard>
      </div>
    );
  }
}

SampleSearchContainer.propTypes = {
  samples: React.PropTypes.array,
  intl: React.PropTypes.object.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  user: React.PropTypes.object.isRequired,
  onSearch: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  samples: state.explorer.samples.list,
  user: state.user,
});


const mapDispatchToProps = dispatch => ({
  fetchData: () => {
    dispatch(fetchSampleSearches());
  },
  onSearch: () => {
    window.location = 'go';
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      SampleSearchContainer
    )
  );

