import React from 'react';

const DataCard = (props) => {
  const { children, border, disabled, className } = props;
  const unborderedClass = (border === false) ? 'unbordered' : '';
  const disabledClass = (disabled === true) ? 'disabled' : '';
  const rootClasses = `${unborderedClass} ${disabledClass}`;
  const classes = `datacard ${rootClasses} ${className}`;
  return (
    <div className={classes}>
      {children}
    </div>
  );
};

DataCard.propTypes = {
  // from parent
  children: React.PropTypes.node.isRequired,
  border: React.PropTypes.bool,
  disabled: React.PropTypes.bool,
  className: React.PropTypes.string,
};

export default DataCard;
