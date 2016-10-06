import React from 'react';
import { injectIntl } from 'react-intl';
import { DeleteButton } from '../../../common/IconButton';

const localMessages = {
  focusDelete: { id: 'focusDefinition.delete', defaultMessage: 'Delete this Focus' },
};

class FocusDefinition extends React.Component {

  handleOnDeleteClick = (event) => {
    const { focusDefinition, onDeleteClick } = this.props;
    event.preventDefault();
    if ((onDeleteClick !== undefined) && (onDeleteClick !== null)) {
      onDeleteClick(focusDefinition);
    }
  }

  render() {
    const { focusDefinition } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <div className="focus-definition">
        <div className="controls">
          <DeleteButton onClick={this.handleOnDeleteClick} tooltip={formatMessage(localMessages.focusDelete)} />
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
  focusDefinition: React.PropTypes.object.isRequired,
  onDeleteClick: React.PropTypes.func,
};

export default
  injectIntl(
    FocusDefinition
  );
