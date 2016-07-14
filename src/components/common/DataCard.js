import React from 'react';

class DataCard extends React.Component {
  render() {
    const { children } = this.props;
    return (
      <div className="datacard">
        {children}
      </div>
    );
  }
}

DataCard.propTypes = {
  // from parent
  children: React.PropTypes.node.isRequired,
};

export default DataCard;
