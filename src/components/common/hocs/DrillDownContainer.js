import PropTypes from 'prop-types';
import React from 'react';

function withDrillDown(ChildComponent) {
  class DrillDownContainer extends React.Component {
    state = {
      open: false,
      drillDownContent: null,
    };
    setDataToSave = (data) => {
      this.dataToSave = data;
    };
    dataToSave = null;
    handleOpenDrillDown = drillDownContent => this.setState({ open: true, drillDownContent });
    handleClose = () => {
      const { handleDrillDownAction } = this.props;
      this.setState({ open: false });
      handleDrillDownAction(this.dataToSave);
    };
    render() {
      const content = (
        <ChildComponent
          {...this.props}
          handleOpen={this.handleOpenDrillDown}
          handleClose={this.handleClose}
          data={this.setDataToSave}
        />
      );
      if (this.state.open && this.state.drillDownContent) {
        return (
          <span className="drill-down">
            {content}
            {this.state.drillDownContent}
          </span>
        );
      }
      return content;
    }
  }
  DrillDownContainer.propTypes = {
    handleDrillDownAction: PropTypes.func.isRequired,
  };

  return DrillDownContainer;
}

export default withDrillDown;
