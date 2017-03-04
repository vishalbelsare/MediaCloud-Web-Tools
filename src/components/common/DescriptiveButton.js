import React from 'react';

/**
 *
 */
const DescriptiveButton = (props) => {
  const { imageUrl, label, description, onClick } = props;
  return (
    <div className="descriptive-button" onTouchTap={() => onClick()}>
      <img src={imageUrl} alt={label} width={50} height={50} />
      <b>{label}</b>
      <p>{description}</p>
    </div>
  );
};

DescriptiveButton.propTypes = {
  // from parent
  imageUrl: React.PropTypes.string,
  label: React.PropTypes.string.isRequired,
  description: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func.isRequired,
};

export default DescriptiveButton;
