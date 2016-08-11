import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export default class Selector extends React.Component {

  handleChange = (event, index, value) => {
    const { onSelectionChanged } = this.props;
    if (onSelectionChanged !== undefined) {
      onSelectionChanged(index, value);
    }
  }

  render() {
    const { selectedValue, disabled, options } = this.props;
    let isDisabled = disabled;
    let valueToSelect = selectedValue;
    // if (idToSelect === undefined) idToSelect = options;
    if (isDisabled === undefined) isDisabled = false;
    return (
      <SelectField
        value={valueToSelect}
        disabled={isDisabled}
        autoWidth
        onChange={this.handleChange}
      >
        {options.map(option =>
          <MenuItem key={option.value} value={option.value} primaryText={option.name} />
        )}
      </SelectField>
    );
  }
}

Selector.propTypes = {
  options: React.PropTypes.array.isRequired,
  selectedValue: React.PropTypes.number,
  disabled: React.PropTypes.bool,
  onSelectionChanged: React.PropTypes.function,
};

export default Selector;
