import React from 'react';
import { injectIntl } from 'react-intl';
import { Col } from 'react-flexbox-grid/lib';
import DeleteButton from '../../../common/DeleteButton';

const localMessages = {
  focalSetDelete: { id: 'focalSets.delete', defaultMessage: 'Delete this focal set' },
};

// handles focal sets or focal set definitions
class FocalSetSummary extends React.Component {

  handleOnClick = (event) => {
    const { focalSet, onClick } = this.props;
    event.preventDefault();
    if ((onClick !== undefined) && (onClick !== null)) {
      onClick(focalSet);
    }
  }

  handleOnDeleteClick = (event) => {
    const { focalSet, onDeleteClick } = this.props;
    event.preventDefault();
    if ((onDeleteClick !== undefined) && (onDeleteClick !== null)) {
      onDeleteClick(focalSet);
    }
  }

  render() {
    const { focalSet, selected, onDeleteClick } = this.props;
    const { formatMessage } = this.props.intl;
    const selectedClass = (selected === true) ? 'selected' : '';
    const rootClasses = `focal-set-summary ${selectedClass}`;
    let deleteControl = null;
    if (onDeleteClick !== undefined) {
      deleteControl = (
        <DeleteButton onClick={this.handleOnDeleteClick} tooltip={formatMessage(localMessages.focalSetDelete)} />
      );
    }
    return (
      <Col lg={3} md={3} sm={12}>
        <div onClick={this.handleOnClick} className={rootClasses}>
          <div className="controls">
            {deleteControl}
          </div>
          <p>
            <b>{focalSet.name}</b>
          </p>
          <p>
            <i>{focalSet.focal_technique}</i>
          </p>
          <p>
            {focalSet.description}
          </p>
        </div>
      </Col>
    );
  }

}

FocalSetSummary.propTypes = {
  focalSet: React.PropTypes.object.isRequired,
  selected: React.PropTypes.bool,
  onClick: React.PropTypes.func,
  intl: React.PropTypes.object.isRequired,
  onDeleteClick: React.PropTypes.func,
  editable: React.PropTypes.bool,
};

export default
  injectIntl(
    FocalSetSummary
  );
