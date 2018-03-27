import React from 'react';
import PropTypes from 'prop-types';

class TabSelector extends React.Component {
  state = {
    selectedViewIndex: 0,
  }

  render() {
    const { onViewSelected, tabLabels } = this.props;
    return (
      <ul className="tab-selector">
        {tabLabels.map((label, idx) =>
          <li
            role="button"
            tabIndex={0}
            onKeyPress={evt => evt.preventDefault()}
            key={idx}
            className={`${this.state.selectedViewIndex === idx ? 'selected' : ''}`}
            onClick={() => {
              this.setState({ selectedViewIndex: idx });
              onViewSelected(idx);
            }}
          >
            {label}
          </li>
        )}
      </ul>
    );
  }
}

TabSelector.propTypes = {
  // from parent
  tabLabels: PropTypes.array,  // an array of strings
  onViewSelected: PropTypes.func, // will get passed the index of the tab selected
};

export default TabSelector;
