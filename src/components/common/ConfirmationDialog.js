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
  intl: React.PropTypes.object.isRequired,
  children: React.PropTypes.node.isRequired,
  // from parent
  open: React.PropTypes.bool.isRequired,
  title: React.PropTypes.string.isRequired,
  okText: React.PropTypes.string.isRequired,
  onOk: React.PropTypes.func.isRequired,
  onCancel: React.PropTypes.func.isRequired,
};

export default injectIntl(ConfirmationDialog);
