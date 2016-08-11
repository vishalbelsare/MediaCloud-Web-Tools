import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

const FocalTechniqueDescription = (props) => {
  const { selected, disabled, nameMsg, descriptionMsg, image, onClick } = props;
  const disabledClass = (disabled === true) ? 'disabled' : '';
  const selectedClass = (selected === true) ? 'selected' : '';
  const rootClasses = `focal-technique-description ${disabledClass} ${selectedClass}`;
  const clickHandler = (disabled === true) ? null : onClick;
  return (
    <div className={rootClasses}>
      <img src={image} width={136} height={136} onClick={clickHandler} />
      <p><b><FormattedMessage {...nameMsg} /></b></p>
      <p><FormattedMessage {...descriptionMsg} /></p>
    </div>
  );
};

FocalTechniqueDescription.propTypes = {
  id: React.PropTypes.string.isRequired,
  image: React.PropTypes.string.isRequired,
  nameMsg: React.PropTypes.object.isRequired,
  descriptionMsg: React.PropTypes.object.isRequired,
  selected: React.PropTypes.bool,
  disabled: React.PropTypes.bool,
  onClick: React.PropTypes.func,
  intl: React.PropTypes.object.isRequired,
};

export default
  injectIntl(
    FocalTechniqueDescription
  );
