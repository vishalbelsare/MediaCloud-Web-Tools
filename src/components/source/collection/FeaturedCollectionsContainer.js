import React from 'react';
import Title from 'react-title-component';
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
  const { formatMessage } = props.intl;
  const titleHandler = parentTitle => `${formatMessage(localMessages.mainTitle)} | ${parentTitle}`;
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  let content = null;

  if (collections && collections.length > 0) {
    content = (
      <Slider {...settings} style={{ width: 80, height: 100, margin: 10, padding: 20 }}>
        {collections.map((slide, idx) =>
          <div key={idx}><FeaturedItem key={idx} collection={slide} /></div>
        )}
      </Slider>
    );
  }

  return (
    <DataCard>
      <Title render={titleHandler} />
      <h1>
        <FormattedMessage {...localMessages.mainTitle} />
      </h1>
      <div className="featured-collections">
        {content}
      </div>
    </DataCard>
  );
};

FeaturedCollectionsContainer.propTypes = {
  collections: React.PropTypes.array,
  intl: React.PropTypes.object.isRequired,
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

