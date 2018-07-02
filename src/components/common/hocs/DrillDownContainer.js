import React from 'react';

function withDrillDown(ChildComponent) {
  class DrillDownContainer extends React.Component {
    state = {
      open: false,
      drillDownContent: null,
    };
    handleOpen = drillDownContent => this.setState({ open: true, drillDownContent });
    handleClose = () => {
      this.setState({ open: false });
    };
    render() {
      const content = (
        <ChildComponent
          {...this.props}
          openDrillDown={this.handleOpen}
          closeDrillDown={this.handleClose}
        />
      );
      if (this.state.open && this.state.drillDownContent) {
        return (
          <div className="drill-down-wrapper">
            {content}
            <div className="drill-down">
              {this.state.drillDownContent}
            </div>
          </div>
        );
      }
      return content;
    }
  }
  return DrillDownContainer;
}

export default withDrillDown;
