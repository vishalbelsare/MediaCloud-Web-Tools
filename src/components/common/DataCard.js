import React from 'react';

class DataCard extends React.Component {
  render() {
    const { children, border, disabled } = this.props;
    const unborderedClass = (border === false) ? 'unbordered' : '' ;
    const disabledClass = (disabled === true) ? 'disabled' : '';
    const rootClasses = `${unborderedClass} ${disabledClass}`;
    const classes = `datacard ${rootClasses}`;
    return (
      <div className={classes}>
        {children}
      </div>
    );
  }
}

DataCard.propTypes = {
  // from parent
  children: React.PropTypes.node.isRequired,
  border: React.PropTypes.bool,
  disabled: React.PropTypes.bool,
};

export default DataCard;
