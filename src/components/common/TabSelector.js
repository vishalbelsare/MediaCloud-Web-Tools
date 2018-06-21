import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

class TabSelector extends React.Component {
  state = {
    selectedViewIndex: 0,
  }

  render() {
    const { onViewSelected, tabLabels } = this.props;
    if (tabLabels.length === 1) {
      // if only one query don't show option to switch between them
      return null;
    }
    return (
      <Tabs
        onChange={(idx) => {
          this.setState({ selectedViewIndex: idx });
          onViewSelected(idx);
        }}
        scrollable
        scrollButtons="on"
      >
        {tabLabels.filter(label => label !== undefined).map(label =>
          <Tab
            label={label.label}
            style={{ color: label.color }}
          />
        )}
      </Tabs>
    );
  }
}

TabSelector.propTypes = {
  // from parent
  tabLabels: PropTypes.array,  // an array of strings
  onViewSelected: PropTypes.func, // will get passed the index of the tab selected
};

export default TabSelector;
