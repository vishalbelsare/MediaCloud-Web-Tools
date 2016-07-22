import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export default class Selector extends React.Component {

  handleChange = (event, index, value) => {
    const { onSelectionChanged } = this.props;
    if (onSelectionChanged !== undefined) {
      onSelectionChanged(value);
    }
  }

  render() {
    const { selectedId, disabled } = this.props;
    let isDisabled = disabled;
    let idToSelect = selectedId;
    if (idToSelect === undefined) idToSelect = 1;
    if (isDisabled === undefined) isDisabled = false;
    return (
      <SelectField
        value={selectedId}
        disabled={isDisabled}
        autoWidth
        onChange={this.handleChange}
      >
        <MenuItem value={1} primaryText="Never" />
        <MenuItem value={2} primaryText="Every Night" />
        <MenuItem value={3} primaryText="Weeknights" />
        <MenuItem value={4} primaryText="Weekends" />
        <MenuItem value={5} primaryText="Weekly" />
      </SelectField>
    );
  }
}

Selector.propTypes = {
  selectedId: React.PropTypes.number,
  disabled: React.PropTypes.bool,
  onSelectionChanged: React.PropTypes.function,
};

export default Selector;
