import React from 'react';
import { injectIntl } from 'react-intl';
import Slider from 'react-slick';
import PreviousIcon from 'material-ui/svg-icons/image/navigate-before';
import NextIcon from 'material-ui/svg-icons/image/navigate-next';

const ItemSlider = (props) => {
  const { slides, settings } = props;
  const settingsExt = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    ...settings,
  };

  // use this if you have a prepped set of JSX tags to send over
  const nextButton = <NextIcon />;
  const previousButton = <PreviousIcon />;
  return (
    <Slider
      {...settingsExt}
      nextArrow={nextButton}
      prevArrow={previousButton}
      style={{
        width: 80,
        height: 100,
        margin: 10,
        padding: 10,
      }}
    >
      { slides }
    </Slider>
  );
};

ItemSlider.propTypes = {
  // from parent
  title: React.PropTypes.string.isRequired,
  intro: React.PropTypes.string,
  slides: React.PropTypes.array.isRequired,
  helpButton: React.PropTypes.node,
  settings: React.PropTypes.object,
  // from dispatch
  handleClick: React.PropTypes.func,
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
};

export default
  injectIntl(
    ItemSlider
  );
