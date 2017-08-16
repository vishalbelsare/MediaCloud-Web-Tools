import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import DataCard from '../../common/DataCard';
import FeaturedItem from './FeaturedItem';
import { fetchFeaturedCollectionList } from '../../../actions/sourceActions';
import composeAsyncContainer from '../../common/AsyncContainer';

const localMessages = {
  mainTitle: { id: 'collection.featured.mainTitle', defaultMessage: 'Featured Collections' },
  intro: { id: 'collection.featured.intro', defaultMessage: 'We are featuring these collections' },
};

const FeaturedCollectionsContainer = (props) => {
  const { collections } = props;
  const settings = {
    dots: true,
    infinite: true,
    speed: 750,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: 1,
    autoplaySpeed: 4000,
  };
  let content = null;

  if (collections && collections.length > 0) {
    content = (
      <Slider {...settings} style={{ width: 80, height: 100, margin: 10, padding: 20 }}>
        {collections.map(collection =>
          <div key={collection.tags_id}><FeaturedItem collection={collection} /></div>
        )}
      </Slider>
    );
  }

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
};

FeaturedCollectionsContainer.propTypes = {
  collections: PropTypes.array,
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.collections.featured.fetchStatus,
  collections: state.sources.collections.featured.list,
});


const mapDispatchToProps = dispatch => ({
  fetchData: () => {
    dispatch(fetchFeaturedCollectionList());
  },
  asyncFetch: () => {
    dispatch(fetchFeaturedCollectionList());
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncContainer(
        FeaturedCollectionsContainer
      )
    )
  );

