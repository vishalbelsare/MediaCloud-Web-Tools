import React from 'react';
import { injectIntl } from 'react-intl';

class FocusListItem extends React.Component {

  handleClick = (evt) => {
    evt.preventDefault();
    const { id, onSelected } = this.props;
    onSelected(id);
  }

  render() {
    const { focus, selected } = this.props;
    const selectedClass = (selected === true) ? 'selected' : '';
    const rootClasses = `popup-item focus-item ${selectedClass}`;
    const subtitle = ('focalSet' in focus) ? <small>{focus.focalSet.name}</small> : null;
    return (
      <div className={rootClasses} onClick={this.handleClick}>
        <div className="title">{focus.name}</div>
        {subtitle}
      </div>
    );
  }

}

FocusListItem.propTypes = {
  intl: React.PropTypes.object.isRequired,
  id: React.PropTypes.number.isRequired,
  focus: React.PropTypes.object.isRequired,
  onSelected: React.PropTypes.func.isRequired,
  selected: React.PropTypes.bool,
};

export default injectIntl(FocusListItem);
