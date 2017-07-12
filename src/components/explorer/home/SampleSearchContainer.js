import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import ItemSlider from '../../common/ItemSlider';
import DataCard from '../../common/DataCard';
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
    const { samples, user } = this.props;
    const { formatMessage } = this.props.intl;
    let content = null;
    let fixedSearchSlides = null;
    // const initialValues = { keyword: 'Search for' };

    if (samples && samples.length > 0) {
      fixedSearchSlides = samples.map((search, index) =>
        (<div key={index}><SampleSearchItem search={search} user={user} /></div>)
      );

      content = (
        <ItemSlider
          title={formatMessage(localMessages.intro)}
          slides={fixedSearchSlides}
          settings={{ height: 60, dots: false, slidesToShow: 3, slidesToScroll: 1, infinite: false, arrows: fixedSearchSlides.length > 3 }}
        />
      );
    }

    return (
      <DataCard className="sample-searches">
        {content}
      </DataCard>
    );
  }
}

SampleSearchContainer.propTypes = {
  samples: React.PropTypes.array,
  intl: React.PropTypes.object.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  user: React.PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  samples: state.explorer.samples.list,
  user: state.user,
});


const mapDispatchToProps = dispatch => ({
  fetchData: () => {
    dispatch(fetchSampleSearches());
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      SampleSearchContainer
    )
  );

