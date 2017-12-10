import PropTypes from 'prop-types';
import React from 'react';

class QueryViewSelector extends React.Component {
  state = {
    selectedViewIndex: 0,
  }

  render() {
    const { onViewSelected } = this.props;
    const menuOptions = [
      { label: 'ATTENTION', index: 0 },
      { label: 'LANGUAGE', index: 1 },
      { label: 'PEOPLE', index: 2 },
      { label: 'REACH', index: 3 },
    ];
    return (
      <ul className="query-view-selector">
        {menuOptions.map(q =>
          <li
            role="button"
            tabIndex={0}
            onKeyPress={evt => evt.preventDefault()}
            key={q.index}
            className={`${this.state.selectedViewIndex === q.index ? 'selected' : ''}`}
            onClick={() => {
              this.setState({ selectedViewIndex: q.index });
              onViewSelected(q.index);
            }}
          >
            {q.label}
          </li>
        )}
      </ul>
    );
  }
}

QueryViewSelector.propTypes = {
  // from parent
  options: PropTypes.array,
  onViewSelected: PropTypes.func,
};

export default QueryViewSelector;
