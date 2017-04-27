import React from 'react';

/**
 *
 */
const DescriptiveButton = (props) => {
  const { imageUrl, label, svgIcon, description, onClick } = props;
  let visualContent = null;
  if (imageUrl) {
    visualContent = (<img src={imageUrl} alt={label} width={50} height={50} />);
  } else if (svgIcon) {
    visualContent = svgIcon;
  }
  return (
    <div className="descriptive-button" onTouchTap={onClick}>
      <div className="image">
        {visualContent}
      </div>
      <b>{label}</b>
      <p>{description}</p>
    </div>
  );
};

DescriptiveButton.propTypes = {
  // from parent
  imageUrl: React.PropTypes.string,
  svgIcon: React.PropTypes.node,
  label: React.PropTypes.string.isRequired,
  description: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func.isRequired,
};

export default DescriptiveButton;
