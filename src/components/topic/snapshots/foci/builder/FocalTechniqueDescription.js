import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

const localMessages = {
  comingSoon: { id: 'focus.technique.comingsoon', defaultMessage: 'Coming soon! ' },
};

const FocalTechniqueDescription = (props) => {
  const { selected, disabled, nameMsg, descriptionMsg, image, icon, onClick, comingSoon } = props;
  const { formatMessage } = props.intl;
  const disabledClass = (disabled === true) ? 'disabled' : '';
  const selectedClass = (selected === true) ? 'selected' : '';
  const rootClasses = `focal-technique-description ${disabledClass} ${selectedClass}`;
  const clickHandler = (disabled === true) ? null : onClick;
  const comingSoonContent = (comingSoon === true) ? <span style={{ color: '#FFD700' }}><FormattedMessage {...localMessages.comingSoon} /></span> : null;
  let visualContent = null;
  if (image) {
    visualContent = <img alt={formatMessage(nameMsg)} tabIndex={0} src={image} width={136} height={136} role="button" onKeyPress={clickHandler} onClick={clickHandler} />;
  } else if (icon) {
    visualContent = <div className="focal-technique-icon" tabIndex={0} role="button" onKeyPress={clickHandler} onClick={clickHandler}>{icon()}</div>;
  }
  return (
    <div className={rootClasses}>
      {visualContent}
      <p><b><FormattedMessage {...nameMsg} /></b></p>
      <p>
        {comingSoonContent}
        <FormattedMessage {...descriptionMsg} />
      </p>
    </div>
  );
};

FocalTechniqueDescription.propTypes = {
  // from parent
  id: React.PropTypes.string.isRequired,
  image: React.PropTypes.string,
  icon: React.PropTypes.func,
  nameMsg: React.PropTypes.object.isRequired,
  descriptionMsg: React.PropTypes.object.isRequired,
  selected: React.PropTypes.bool,
  disabled: React.PropTypes.bool,
  comingSoon: React.PropTypes.bool,
  onClick: React.PropTypes.func,
  intl: React.PropTypes.object.isRequired,
};

export default
  injectIntl(
    FocalTechniqueDescription
  );
