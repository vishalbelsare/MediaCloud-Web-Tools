import PropTypes from 'prop-types';
import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { injectIntl } from 'react-intl';

class ConfirmationDialog extends React.Component {

  handleOk = () => {
    const { onOk } = this.props;
    onOk();
  }

  handleCancel = () => {
    const { onCancel } = this.props;
    onCancel();
  }

  render() {
    const { open, title, children, okText } = this.props;
    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={this.handleCancel}
      />,
      <FlatButton
        label={okText}
        primary
        keyboardFocused
        onTouchTap={this.handleOk}
      />,
    ];
    return (
      <div>
        <Dialog
          title={title}
          actions={actions}
          modal={false}
          className="app-dialog"
          open={open}
          onRequestClose={this.handleCancel}
        >
          {children}
        </Dialog>
      </div>
    );
  }
}

ConfirmationDialog.propTypes = {
  // from composition
  intl: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  // from parent
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  okText: PropTypes.string.isRequired,
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default injectIntl(ConfirmationDialog);
