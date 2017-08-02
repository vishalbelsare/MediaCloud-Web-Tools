import React from 'react';
import { injectIntl } from 'react-intl';
import { DeleteButton, EditButton } from '../../../common/IconButton';

const localMessages = {
  focusDelete: { id: 'focusDefinition.delete', defaultMessage: 'Delete this Subtopic' },
};

class FocusDefinition extends React.Component {

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
    return (
      <div className="focus-definition">
        <div className="controls">
          <EditButton linkTo={`/topics/${topicId}/snapshot/foci/${focusDefinition.focus_definitions_id}/edit`} />
          <DeleteButton onClick={this.handleDelete} tooltip={formatMessage(localMessages.focusDelete)} />
        </div>
        <p>
          <b>{focusDefinition.name}</b>
        </p>
        <p>
          {focusDefinition.description}
        </p>
      </div>
    );
  }

}

FocusDefinition.propTypes = {
  // from composition chain
  intl: React.PropTypes.object.isRequired,
  // from parent
  topicId: React.PropTypes.number.isRequired,
  focusDefinition: React.PropTypes.object.isRequired,
  onDelete: React.PropTypes.func,
};

export default
  injectIntl(
    FocusDefinition
  );
