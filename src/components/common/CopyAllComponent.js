import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import messages from '../../resources/messages';
import { AddButton } from './IconButton';

const localMessages = {
  title: { id: 'title', defaultMessage: 'Copy To All Queries' },
};

class CopyAllComponent extends React.Component {
  state = {
    open: false,
  };
  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    const { onOk } = this.props;
    this.setState({ open: false });
    onOk();
  };
  handleCancel = () => {
    this.setState({ open: false });
  };
  render() {
    const { title, msg } = this.props;
    const { formatMessage } = this.props.intl;
    const dialogActions = [
      <FlatButton
        label={formatMessage(messages.cancel)}
        primary
        onClick={this.handleCancel}
      />,
      <FlatButton
        label={formatMessage(messages.ok)}
        primary
        onClick={this.handleClose}
      />,
    ];
    let content = null;
    if (msg) {
      content = (
        <div>
          {msg}
        </div>
      );
    }

    const dialogTitle = title ? formatMessage(localMessages.title) : '';
    return (
      <span className="copy-all">
        <AddButton onClick={this.handleOpen} />
        <Dialog
          title={dialogTitle}
          actions={dialogActions}
          modal={false}
          className="app-dialog"
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          {content}
        </Dialog>
      </span>
    );
  }
}

CopyAllComponent.propTypes = {
  // from composition
  intl: PropTypes.object.isRequired,
  // from parent
  title: PropTypes.string.isRequired,
  msg: PropTypes.string.isRequired,
  onOk: PropTypes.func.isRequired,
};

export default injectIntl(CopyAllComponent);
