import PropTypes from 'prop-types';
import React from 'react';

function withDrillDown(drillDownContent) {
  return (ChildComponent) => {
    class DrillDownContainer extends React.Component {
      state = {
        open: false,
        drillDownContent,
      };
      setDataToSave = (data) => {
        this.dataToSave = data;
      };
      dataToSave = null;
      handleOpenDrillDown = () => this.setState({ open: true });
      handleClose = () => {
        const { handleDrillDownAction } = this.props;
        this.setState({ open: false });
        handleDrillDownAction(this.dataToSave);
      };
      render() {
        const { handleDrillDownAction } = this.props;
        const content = (
          <ChildComponent
            {...this.props}
            handleOpen={this.handleOpenDrillDown}
            onAction={handleDrillDownAction}
            close={this.handleClose}
            data={this.setDataToSave}
          />
        );
        if (this.state.open) {
          return (
            <span className="drill-down">
              {content}
              {drillDownContent}
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
  };
}

export default withDrillDown;
