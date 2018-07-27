import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import Dialog from 'material-ui/Dialog';
import { DeleteButton, EditButton } from '../../../common/IconButton';
import AppButton from '../../../common/AppButton';
import messages from '../../../../resources/messages';

const localMessages = {
  focusDelete: { id: 'focusDefinition.delete', defaultMessage: 'Delete this Subtopic' },
  deleteConfirmTitle: { id: 'focusDefinition.delete.confirm.title', defaultMessage: 'Are You Sure?' },
  deleteConfirmDescription: { id: 'focusDefinition.delete.confirm.description', defaultMessage: 'Click "delete" to actually delete this subtopic from the next snapshot.  You can\'t undo this.  Clicking delete means that your next snapshot will NOT include this subtopic.  Your current snapshot (which you are looking at now) will continue to have it.  After doing this you need to generate a new snapshot.' },
};

class FocusDefinition extends React.Component {
  state = {
    deleteConfirmationOpen: false,
  };

  handleDeleteCancel = () => {
    this.setState({ deleteConfirmationOpen: false });
  };

  showDeleteDialog = () => {
    this.setState({ deleteConfirmationOpen: true });
  }

  handleDelete = (event) => {
    const { focusDefinition, onDelete } = this.props;
    event.preventDefault();
    if ((onDelete !== undefined) && (onDelete !== null)) {
      onDelete(focusDefinition);
    }
  }

  render() {
    const { focusDefinition, topicId } = this.props;
    const { formatMessage } = this.props.intl;
    const dialogActions = [
      <AppButton
        label={formatMessage(messages.cancel)}
        primary
        onTouchTap={this.handleDeleteCancel}
      />,
      <AppButton
        label={formatMessage(messages.delete)}
        primary
        onTouchTap={this.handleDelete}
      />,
    ];
    return (
      <div className="focus-definition" data-focus-definitions-id={focusDefinition.focus_definitions_id}>
        <h3>
          {focusDefinition.name}
          <div className="controls">
            <EditButton linkTo={`/topics/${topicId}/snapshot/foci/${focusDefinition.focus_definitions_id}/edit`} />
            <DeleteButton onClick={this.showDeleteDialog} tooltip={formatMessage(localMessages.focusDelete)} />
          </div>
        </h3>
        <p>
          {focusDefinition.description}
        </p>
        <p>
          <FormattedMessage {...messages.query} />: <code>{focusDefinition.query}</code>
        </p>
        <Dialog
          title={formatMessage(localMessages.deleteConfirmTitle)}
          actions={dialogActions}
          modal
          open={this.state.deleteConfirmationOpen}
          onRequestClose={this.handleDeleteCancel}
          className="app-dialog"
        >
          <p><FormattedMessage {...localMessages.deleteConfirmDescription} /></p>
        </Dialog>
      </div>
    );
  }
}

FocusDefinition.propTypes = {
  // from composition chain
  intl: PropTypes.object.isRequired,
  // from parent
  topicId: PropTypes.number.isRequired,
  focusDefinition: PropTypes.object.isRequired,
  onDelete: PropTypes.func,
};

export default
injectIntl(
  FocusDefinition
);
