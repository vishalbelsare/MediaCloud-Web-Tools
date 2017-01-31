import React from 'react';
import Title from 'react-title-component';
import { injectIntl, FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import DataCard from '../../common/DataCard';
import CollectionTopWordsContainer from './CollectionTopWordsContainer';

const localMessages = {
  mainTitle: { id: 'collection.featured.mainTitle', defaultMessage: 'Featured Collections' },
  intro: { id: 'collection.featured.intro', defaultMessage: 'We are featuring these collections' },
};

const FeaturedCollectionsContainer = (props) => {
  const { collections } = props;
  const { formatMessage } = props.intl;
  const titleHandler = parentTitle => `${formatMessage(localMessages.mainTitle)} | ${parentTitle}`;
  const validCollections = collections.filter(c => c.label.indexOf('U.S.') > -1);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  let content = null;

  if (validCollections && validCollections.length > 0) {
    content = (
      <Slider {...settings} style={{ width: 80, height: 100, margin: 10, padding: 10 }}>
        {validCollections.map((slide, idx) =>
          <div key={idx}><h3>{slide.label}</h3>
            <p>{slide.description}</p>
            <CollectionTopWordsContainer collectionId={slide.tags_id} />
          </div>
        )}
      </Slider>
    );
  }

  return (
    <DataCard>
      <Title render={titleHandler} />
      <h2>
        <FormattedMessage {...localMessages.mainTitle} />
      </h2>
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

export default injectIntl(FeaturedCollectionsContainer);
