import React from 'react';

class DataCard extends React.Component {
  isBordered = () => {
    const { border } = this.props;
    return (border !== false);
  }
  render() {
    const { children } = this.props;
    const unbordered = (this.isBordered()) ? '' : 'datacard-unbordered';
    const classes = `datacard ${unbordered}`;
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
  // from params
  border: React.PropTypes.bool,
};

export default DataCard;
