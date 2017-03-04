import React from 'react';
import { injectIntl } from 'react-intl';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { REMOVE_FOCUS } from './FocusSelectorContainer';

const localMessages = {
  pickFocus: { id: 'focus.pick', defaultMessage: 'Pick a Subtopic' },
  noFocus: { id: 'focus.none', defaultMessage: 'No Subtopic' },
};

class FocusSelector extends React.Component {

  handleFocusChange = (evt, index, value) => {
    const { foci, onFocusSelected } = this.props;
    const { formatMessage } = this.props.intl;
    let selected;
    if (value === REMOVE_FOCUS) {
      selected = { foci_id: REMOVE_FOCUS, name: formatMessage(localMessages.noFocus) };
    } else {
      selected = foci.find(focus => (focus.foci_id === value));
    }
    onFocusSelected(selected);
  }

  render() {
    const { foci, selectedId } = this.props;
    const { formatMessage } = this.props.intl;
    // default to none
    return (
      <div className="focus-selector-wrapper">
        <SelectField
          floatingLabelText={formatMessage(localMessages.pickFocus)}
          floatingLabelFixed
          floatingLabelStyle={{ color: 'rgb(224,224,224)' }}
          labelStyle={{ color: 'rgb(255,255,255)' }}
          value={selectedId}
          onChange={this.handleFocusChange}
        >
          {foci.map(focus =>
            <MenuItem key={focus.foci_id} value={focus.foci_id} primaryText={focus.name} />
          )}
          <MenuItem value={REMOVE_FOCUS} primaryText={formatMessage(localMessages.noFocus)} />
        </SelectField>
      </div>
    );
  }

}

FocusSelector.propTypes = {
  foci: React.PropTypes.array.isRequired,
  selectedId: React.PropTypes.number,
  intl: React.PropTypes.object.isRequired,
  onFocusSelected: React.PropTypes.func,
};

export default
  injectIntl(
    FocusSelector
  );
